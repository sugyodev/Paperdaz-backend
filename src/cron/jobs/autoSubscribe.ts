import { BadRequest } from "@feathersjs/errors"
import app from "../../app"
import { DEFAULT_VALUES } from "../../utils/constants"
require("dotenv").config();
const stripe = require('stripe')(process.env.STRIPE_S_Key);
import moment from "moment";
import { sendPackageSubscriptionCancel } from "../../utils/email-sender/package-subscription-cancel";
import { sendSubscriptionSuccess } from "../../utils/email-sender/subscription-success";
import { sendPackageSubscription } from "../../utils/email-sender/package-subscription";

export const autoSubscribe = async()=>{
  let today = moment().format('YYYY-MM-DD HH:MM');
  const subscriptions:any = await app.services.subscriptions.find({query:{status :DEFAULT_VALUES.subscriptionsStatus.ACTIVE, isCancelled: false, endDate:{$lt:today}}})
  subscriptions.data.map(async(subscription:any) =>{
    const user = await app.services.users.get(subscription.userId)
    if(subscription.paymentType === DEFAULT_VALUES.subscriptionsPaymentType.CARD){
        const cards:any = await app.services.cards.find({query:{userId:user.id}});
        if(cards?.total === 0){
            await app.services.subscriptions.patch(subscription.id, {status: DEFAULT_VALUES.subscriptionsStatus.EXPIRED, isBillingNotified: false})
            await app.services.notification.create({ userId: user.id,
              message:"Subscription failed, no card was found"
            })
            await sendPackageSubscriptionCancel(user, today)
          return
        }
        const card:any = cards.data[0];
        const token = await stripe.tokens.create({
          card: {
            number: card.card_number,
            exp_month: parseInt(card.exp_month),
            exp_year: parseInt(card.exp_year),
            cvc: card.cvv,
          }
          });
          if(!token){
          //failed to charge card
          await app.services.subscriptions.patch(subscription.id, {status: DEFAULT_VALUES.subscriptionsStatus.EXPIRED, isBillingNotified: false})
          await app.services.notification.create({ userId: user.id,
            message:"Subscription failed, failed to charge card, please check card information"
          })
          await sendPackageSubscriptionCancel(user, today)
          return
        }
        const charge = await stripe.charges.create({
          amount: subscription.amount,
          currency: "usd",
          source: token.id, // obtained with Stripe.js
          description: `${user.email} renewed subscription`
        },{
          idempotencyKey:Date.now().toString()
        })
        if(!charge){
          await app.services.subscriptions.patch(subscription.id, {status: DEFAULT_VALUES.subscriptionsStatus.EXPIRED, isBillingNotified: false })
          await app.services.notification.create({ userId: user.id,
            message:"Subscription failed, failed to charge card, please check card information"
          })
          await sendPackageSubscriptionCancel(user, today)
        }
        //success
        await app.services.subscriptions.patch(subscription.id, {
          status: DEFAULT_VALUES.subscriptionsStatus.ACTIVE,
          startDate: moment().format('YYYY-MM-DD HH:MM'),
          endDate: subscription.plan === 'yearly'  ? moment().add(365, "days").format('YYYY-MM-DD HH:MM') : moment().add(30, "days").format('YYYY-MM-DD HH:MM'), 
          stripeChargeId: charge.id,
          isBillingNotified: false
        })
        await app.services.notification.create({ userId: user.id,
          message:`Your Subscription of ${subscription.packageName}, was successful`
        })
        await sendPackageSubscription(user, subscription.packageName)
        // await app.services['daily-activies'].create({
        //   action: DEFAULT_VALUES.fileActions.COMPLETE,
        //   leavesEarned: 0,
        //   userId: user.id,
        //   fileId: newFile.id
        // })

        // await sendSubscriptionSuccess(user)
        return
      }else if(subscription.paymentType === DEFAULT_VALUES.subscriptionsPaymentType.CREDIT) {

          if(user.totalCreditsEarned < subscription.amount){
            await app.services.subscriptions.patch(subscription.id, {status: DEFAULT_VALUES.subscriptionsStatus.EXPIRED, isBillingNotified: false})
            await app.services.notification.create({ userId: user.id,
              message:"Subscription failed, insufficient credit"
            })
            await sendPackageSubscriptionCancel(user, today)
            return
          }else{
            await app.services.subscriptions.patch(subscription.id, {
              status: DEFAULT_VALUES.subscriptionsStatus.ACTIVE
            })
            await app.services.notification.create({ userId: user.id,
              message:`Your Subscription of ${subscription.packageName}, was successful`
            })
            await sendPackageSubscription(user, subscription.packageName)
            return
          }

      }else{
          await app.services.subscriptions.patch(subscription.id, {status: DEFAULT_VALUES.subscriptionsStatus.EXPIRED, isBillingNotified: false})
          await app.services.notification.create({ userId: user.id,
            message:"Subscription attempt failed"
          })
          await sendPackageSubscriptionCancel(user, today)
          return
      }
   })
}
