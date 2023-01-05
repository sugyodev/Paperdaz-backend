import app from "../../app"
import { DEFAULT_VALUES } from "../../utils/constants"
require("dotenv").config();
const stripe = require('stripe')(process.env.STRIPE_S_Key);
import moment from "moment";

export const notify3DaysToBilling =async()=>{
  let today = moment().format('YYYY-MM-DD');
  let threeDaysToCome = moment().subtract(3, 'd').format('YYYY-MM-DD');

  const subscriptions:any = await app.services.subscriptions.find({query:{status :DEFAULT_VALUES.subscriptionsStatus.ACTIVE, isCancelled: false, endDate:{$gte:threeDaysToCome}}})
  subscriptions.data.map(async(subscription:any) =>{
    //notify the user
    await app.services.subscriptions.patch(subscription.id, {isBillingNotified: true })
    await app.services.notification.create({ userId: subscription.userId,
      message:`Your subscription of  ${subscription.packageName}, will be charged on ${subscription.endDate}, please ensure your billing information is correct`
    })
    //mail notification
  })

}
