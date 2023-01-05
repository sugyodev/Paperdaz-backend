import { HooksObject } from '@feathersjs/feathers'
import * as authentication from '@feathersjs/authentication'
import app from '../../app'
import { DEFAULT_VALUES } from '../../utils/constants'
import moment from 'moment'
import { BadRequest } from '@feathersjs/errors'
import getSubscriptionRelatedHook from '../../hooks/get-subscription-related-hook'
import { sendPackageSubscription } from '../../utils/email-sender/package-subscription'
import { sendPackageSubscriptionCancel } from '../../utils/email-sender/package-subscription-cancel'
import sendReferralCredit from '../../utils/email-sender/referal-rewards'
import { sendPaperdazReceipt } from '../../utils/email-sender/paperdaz-receipt'
import { PDFDocument, rgb } from 'pdf-lib'
import { writeFile } from 'fs/promises'
import axios from 'axios';
import fetch from 'node-fetch'
import fs from 'fs'
import FormData from 'form-data';

// Don't remove this comment. It's needed to format import lines nicely.
require('dotenv').config()
const { authenticate } = authentication.hooks
const stripe = require('stripe')(process.env.STRIPE_S_Key)

/**
 * ***steps to subscribing
 * get the packages by id
 * get the user
 * get the card by user id
 * submit in sequence to stripe subscription id
 * update stripe subscription
 *
 */

export const chargeUser = async (user: any, amount: any) => {
  //check if user has card
  const cards: any = await app.services.cards.find({
    query: { userId: user.id }
  })
  if (cards.total === 0) {
    throw new BadRequest('user does not have a card, create a card to proceed')
  }
  const card = cards.data[0]
  const token = await stripe.tokens.create({
    card: {
      number: card.card_number,
      exp_month: parseInt(card.exp_month),
      exp_year: parseInt(card.exp_year),
      cvc: card.cvv
    }
  })
  const charge = await stripe.charges.create(
    {
      amount: amount * 100,
      currency: 'usd',
      source: token.id,
      description: `${user.email} subscribed`
    },
    {
      idempotencyKey: Date.now().toString()
    }
  )

  return charge
}

const subscribe = async (context: any) => {
  if (context.data.action == 'subscribe') {
    const user = context.params.user
    let plan = DEFAULT_VALUES.subscriptionsPlan.MONTHLY
    let amount = 0.0
    let interval = 'month'
    let startDate = moment().format('x')
    let endDate = moment().add(30, 'days').format('x')
    const custom = context.data.custom

    if (custom) {
      //create a custom package for that user
      context.data.packageName = custom.name
      context.data.paperlink = custom.paperlink
      context.data.teamMembers = custom.teamMembers
      context.data.cc = custom.cc
      context.data.publicProfile = custom.publicProfile
      context.data.companyLedger = custom.companyLedger
      context.data.isCustomPackage = true
      //price calculation
      let monthly =
        DEFAULT_VALUES.packagesPrices.paperlink * context.data.paperlink +
        DEFAULT_VALUES.packagesPrices.teamMembers * context.data.teamMembers +
        DEFAULT_VALUES.packagesPrices.cc * context.data.cc +
        (context.data.publicProfile
          ? DEFAULT_VALUES.packagesPrices.publicProfile
          : 0) +
        (context.data.companyLedger
          ? DEFAULT_VALUES.packagesPrices.companyLedger
          : 0)

      context.data.monthlyPrice = monthly
      context.data.yearlyPrice = monthly * 12
    } else {
      if (!context.data.packageId) {
        throw new BadRequest('packageId or custom data required')
      }
      let packages = await app.services.packages.get(context.data.packageId)
      context.data._package = packages
      context.data.packageName = packages.name
      context.data.paperlink = packages.paperlink
      context.data.teamMembers = packages.teamMembers
      context.data.cc = packages.cc
      context.data.publicProfile = packages.publicProfile
      context.data.companyLedger = packages.companyLedger
      context.data.monthlyPrice = packages.monthlyPrice
      context.data.yearlyPrice = packages.yearlyPrice
    }
    //set amount and plan
    if (context.data.plan === DEFAULT_VALUES.subscriptionsPlan.YEARLY) {
      plan = DEFAULT_VALUES.subscriptionsPlan.YEARLY
      amount = context.data.yearlyPrice
      interval = 'year'
      endDate = moment().add(365, 'days').format('x')
    } else {
      amount = context.data.monthlyPrice
    }
    const charge: any = await chargeUser(user, amount)
    if (context.data.isUpdate === true) {
      const prevSub: any = await app.services.subscriptions.find({
        query: { userId: user.id }
      })
      await app.services.subscriptions.remove(prevSub.data[0].id)
    }
    //create subscription
    context.data.stripeChargeId = charge.id
    context.data.plan = plan
    context.data.amount = amount
    context.data.startDate = parseInt(startDate)
    context.data.endDate = parseInt(endDate)
    context.data.paymentType = DEFAULT_VALUES.subscriptionsPaymentType.CARD
    context.data.status =
      charge?.status === 'succeeded'
        ? DEFAULT_VALUES.subscriptionsStatus.ACTIVE
        : charge?.status
    // context.data.userId = user.id
  }
  return context
}

const upgrade = async (context: any) => {
  if (context.data.upgrade === true) {
    let subscription = await app.services.subscriptions.get(context.id)
    let amount =
      DEFAULT_VALUES.packagesPrices.paperlink *
        context.data.additional_paperlink +
      DEFAULT_VALUES.packagesPrices.teamMembers *
        context.data.additional_teamMembers +
      DEFAULT_VALUES.packagesPrices.cc * context.data.additional_cc

    //check if user has card
    const charge: any = await chargeUser(context.parans.user, amount)

    if (!charge) {
      throw new BadRequest('failed to charge user card')
    }

    context.data.paperlink =
      context.data.additional_paperlink + subscription.paperlink
    context.data.teamMembers =
      context.data.additional_teamMembers + subscription.teamMembers
    context.data.cc = context.data.additional_cc + subscription.cc
    context.data.action = subscription.amount + amount
  }

  if (context.data.isCancelled === true) {
    //send cancelled male
    var date = new Date()
    var current_date =
      date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear()
    await sendPackageSubscriptionCancel(context.params.user, current_date)
  }

  return context
}

const packageInvoiceCreate = async (context: any) => {
  const pdfDoc = await PDFDocument.create()

  const pngUrl = `${app.get('base_url')}/invoice_reciepts.png`
  const pngImageBytes = await fetch(pngUrl).then(res => res.arrayBuffer())
  const pngImage = await pdfDoc.embedPng(pngImageBytes)
  const pngDims = pngImage.scale(0.5)

  const page = pdfDoc.addPage([pngDims.width, pngDims.height])

  page.drawImage(pngImage, {
    width: pngDims.width,
    height: pngDims.height
  })

  const { width, height } = page.getSize()
  const fontSize = 14

  page.drawText(`#${context.result.id}-${moment().year()}`, {
    x: 220,
    y: height - 16.7 * fontSize,
    size: fontSize,
    color: rgb(0.48, 0.48, 0.48)
  })
  page.drawText(`${moment(context.data.startDate, "x").format("MMM YYYY")}`, {
    x: 530,
    y: height - 16.9 * fontSize,
    size: fontSize,
    color: rgb(0.48, 0.48, 0.48)
  })
  page.drawText(`${context.data.companyName}`, {
    x: 220,
    y: height - 19.2 * fontSize,
    size: fontSize,
    color: rgb(0.48, 0.48, 0.48)
  })
  page.drawText('Visa (4*** ** *** 4242)', {
    x: 220,
    y: height - 22.1 * fontSize,
    size: fontSize,
    color: rgb(0.48, 0.48, 0.48)
  })

  // summary
  page.drawText(`${moment(context.data.startDate, "x").format("MMM YYYY")} to ${moment(context.data.endDate, "x").format("MMM YYYY")}`, {
    x: 220,
    y: height - 29.6 * fontSize,
    size: fontSize,
    color: rgb(0.48, 0.48, 0.48)
  })
  page.drawText(`${context.data.packageName}`, {
    x: 84,
    y: height - 32.1 * fontSize,
    size: 16,
    color: rgb(0.48, 0.48, 0.48)
  })
  page.drawText(`$${context.data.amount}`, {
    x: 530,
    y: height - 32.2 * fontSize,
    size: fontSize,
    color: rgb(0.48, 0.48, 0.48)
  })
  page.drawText(`$${context.data.amount}`, {
    x: 530,
    y: height - 36 * fontSize,
    size: fontSize,
    color: rgb(0.48, 0.48, 0.48)
  })

  // contact us in footer
  page.drawText('www.paperdaz.com/contact-us', {
    x: 450,
    y: height - 51.2 * fontSize,
    size: 11,
    color: rgb(0.48, 0.48, 0.48)
  })
  page.drawText('contact@paperdaz.com', {
    x: 450,
    y: height - 52.3 * fontSize,
    size: 11,
    color: rgb(0.48, 0.48, 0.48)
  })
  const pdfBytes = await pdfDoc.save()
  await writeFile('./src/services/subscriptions/paperdaz_receipt.pdf', pdfBytes)
  console.log('Invoice PDF created!')
  let user = context.params.user
  var datax = new FormData()
  //@ts-ignore
  datax.append('upload', fs.createReadStream('./src/services/subscriptions/paperdaz_receipt.pdf'))
  datax.append('type', 'pdf')
  // console.log(datax);
  var configData = {
    method: 'post',
    url: `${app.get('base_url')}/files`,
    data: datax
  }

  await axios(configData)
    .then(async function (response) {
      await sendPaperdazReceipt(user, response.data.location)
    })
    .catch(function (error) {
      console.log(error)
      throw new Error(error)
    })
}

const afterSubscription = async (context: any) => {
  if (context.data.action !== 'retry') {
    //add to number of subsscribers if the user was previously a free user
    if (context.data.createFlage === true) {
      if (context.data.packageId) {
        await app.services.packages.patch(context.data.packageId, {
          numberOfSubscribers: context.data._package.numberOfSubscribers + 1
        })
      }

      if (context.data.companyName) {
        let user = context.params.user
        const paidUser = await app.services.users.create({
          firstName: user.firstName,
          lastName: user.lastName,
          companyEmail:
            context.params.user.role === DEFAULT_VALUES.users.roles.FREE_USER
              ? user.email
              : user.companyEmail,
          companyName: context.data.companyName,
          email:
            'temp' +
            Math.floor(Math.random() * Math.pow(10, 8)) +
            '@paperdaz.com',
          password: user.referralCode,
          role: DEFAULT_VALUES.users.roles.PAID_USER,
          status: DEFAULT_VALUES.users.status.ACTIVE,
          subscriptionId: context.result.id,
          mainAccountId:
            context.params.user.role === DEFAULT_VALUES.users.roles.FREE_USER
              ? user.id
              : user.mainAccountId
        })

        // update user email
        await app.services.users.patch(paidUser.id, {
          email: 'business' + paidUser.id + '@paperdaz.com'
        })

        //update subscription
        await app.services.subscriptions.patch(context.result.id, {
          userId: paidUser.id
        })

        await sendPackageSubscription(paidUser, context.data.packageName)
        //subscription notification
        await packageInvoiceCreate(context)
      }
    }
    //reward referree
    const subCredit: any = await app.services['admin-settings'].find({
      query: { name: DEFAULT_VALUES.adminSettings.REFERRAL_CREDIT }
    })
    //create referal credit
    if (
      context.params.user.isReferreePaid == false &&
      context.params.user.referreeId != null
    ) {
      const referree = await app.services.users.get(
        context.params.user.referreeId
      )
      await app.services.referral.create({
        type: DEFAULT_VALUES.referalType.PAYMENT,
        referreeName: referree.firstName + ' ' + referree.lastName,
        referreeCompanyName: referree.companyName ?? '',
        newUserName:
          context.params.user.firstName + ' ' + context.params.user.lastName,
        newUserCompanyName: context.params.user.companyName ?? '',
        creditEarned: subCredit[0].value,
        referralCode: referree.referralCode
      })
      //award credit
      await app.services.users.patch(referree.id, {
        totalCreditsEarned: referree.totalCreditsEarned + subCredit[0].value
      })
      //save mark as paid
      await app.services.users.patch(context.params.user.id, {
        isReferreePaid: true
      })
      //get dispaersed credit
      let dispaersedCredit: any = await app.services['admin-settings'].find({
        query: { name: DEFAULT_VALUES.adminSettings.TOTAL_CREDIT_DISPERSED }
      })
      let totalCreditDispersed = dispaersedCredit[0].value + subCredit[0].value
      await app.services['admin-settings'].patch(dispaersedCredit[0].id, {
        value: totalCreditDispersed
      })
      //create notification
      const notificationSettings: any = await app.services[
        'notification-settings'
      ].find({ query: { userId: referree.id } })
      let message =
        '{' +
        context.params.user.firstName +
        ' ' +
        context.params.user.lastName +
        '}' +
        ' ' +
        DEFAULT_VALUES.notificationMessage.SUCCESSFULLY_REFERRAL_SUBSCRIPTION +
        'you earn ' +
        subCredit[0].value +
        ' Credits'
      notificationSettings.map(async (notification: any) => {
        if (
          notification.type === DEFAULT_VALUES.notificationType.APP &&
          notification.referalCredit === true
        ) {
          await app.services.notification.create({
            message: message,
            userId: referree.id
          })
        }
        if (
          notification.type === DEFAULT_VALUES.notificationType.EMAIL &&
          notification.referalCredit === true
        ) {
          // sendJoinMail(referree.email, message)
          let refIsBusiness = false
          let userIsBusiness = false
          if (referree.data[0].role === DEFAULT_VALUES.users.roles.PAID_USER) {
            refIsBusiness = true
          }
          if (context.result.role === DEFAULT_VALUES.users.roles.PAID_USER) {
            userIsBusiness = true
          }
          await sendReferralCredit(
            referree,
            context.params.user,
            subCredit[0].value.toString(),
            'credit',
            refIsBusiness,
            userIsBusiness
          )
        }
      })
    }
  }

  return context
}

const retryPayment = async (context: any) => {
  if (context.data.action === 'retry') {
    let subscription: any = await app.services.subscriptions.find({
      query: { userId: context.params.user.id }
    })
    //check if user has card
    const charge: any = await chargeUser(
      context.parans.user,
      subscription.data[0].amount
    )
    if (!charge) {
      throw new BadRequest('an error occur while charging users card')
    }

    if (charge.status !== 'succeeded') {
      throw new BadRequest(
        'an error occur while charging users card please check card and try again'
      )
    }

    //notify user
    await app.services.notification.create({
      userId: context.params.user.id,
      message: `Your Subscription of ${subscription.data[0].packageName}, was successful`
    })
    await sendPackageSubscription(
      context.params.user,
      subscription.data[0].packageName
    )
    //update subscription
    let update = await app.services.subscriptions.patch(
      subscription.data[0].id,
      {
        startDate: moment().format('YYYY-MM-DD HH:MM'),
        endDate:
          subscription.data[0].plan === 'monthly'
            ? moment().format('YYYY-MM-DD HH:MM')
            : moment().format('YYYY-MM-DD HH:MM'),
        status: DEFAULT_VALUES.subscriptionsStatus.ACTIVE,
        isCancelled: true
      }
    )
    context.result = update
  }
  return context
}

export default {
  before: {
    all: [authenticate('jwt')],
    find: [getSubscriptionRelatedHook()],
    get: [getSubscriptionRelatedHook()],
    create: [subscribe, retryPayment],
    update: [],
    patch: [upgrade],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [afterSubscription],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
}
