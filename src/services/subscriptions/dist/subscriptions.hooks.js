"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.chargeUser = void 0;
var authentication = require("@feathersjs/authentication");
var app_1 = require("../../app");
var constants_1 = require("../../utils/constants");
var moment_1 = require("moment");
var errors_1 = require("@feathersjs/errors");
var get_subscription_related_hook_1 = require("../../hooks/get-subscription-related-hook");
var package_subscription_1 = require("../../utils/email-sender/package-subscription");
var package_subscription_cancel_1 = require("../../utils/email-sender/package-subscription-cancel");
var referal_rewards_1 = require("../../utils/email-sender/referal-rewards");
var paperdaz_receipt_1 = require("../../utils/email-sender/paperdaz-receipt");
var pdf_lib_1 = require("pdf-lib");
var promises_1 = require("fs/promises");
var axios_1 = require("axios");
var node_fetch_1 = require("node-fetch");
var fs_1 = require("fs");
var form_data_1 = require("form-data");
// Don't remove this comment. It's needed to format import lines nicely.
require('dotenv').config();
var authenticate = authentication.hooks.authenticate;
var stripe = require('stripe')(process.env.STRIPE_S_Key);
/**
 * ***steps to subscribing
 * get the packages by id
 * get the user
 * get the card by user id
 * submit in sequence to stripe subscription id
 * update stripe subscription
 *
 */
exports.chargeUser = function (user, amount) { return __awaiter(void 0, void 0, void 0, function () {
    var cards, card, token, charge;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, app_1["default"].services.cards.find({
                    query: { userId: user.id }
                })];
            case 1:
                cards = _a.sent();
                if (cards.total === 0) {
                    throw new errors_1.BadRequest('user does not have a card, create a card to proceed');
                }
                card = cards.data[0];
                return [4 /*yield*/, stripe.tokens.create({
                        card: {
                            number: card.card_number,
                            exp_month: parseInt(card.exp_month),
                            exp_year: parseInt(card.exp_year),
                            cvc: card.cvv
                        }
                    })];
            case 2:
                token = _a.sent();
                return [4 /*yield*/, stripe.charges.create({
                        amount: amount * 100,
                        currency: 'usd',
                        source: token.id,
                        description: user.email + " subscribed"
                    }, {
                        idempotencyKey: Date.now().toString()
                    })];
            case 3:
                charge = _a.sent();
                return [2 /*return*/, charge];
        }
    });
}); };
var subscribe = function (context) { return __awaiter(void 0, void 0, void 0, function () {
    var user, plan, amount, interval, startDate, endDate, custom, monthly, packages, charge, prevSub;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!(context.data.action == 'subscribe')) return [3 /*break*/, 8];
                user = context.params.user;
                plan = constants_1.DEFAULT_VALUES.subscriptionsPlan.MONTHLY;
                amount = 0.0;
                interval = 'month';
                startDate = moment_1["default"]().format('x');
                endDate = moment_1["default"]().add(30, 'days').format('x');
                custom = context.data.custom;
                if (!custom) return [3 /*break*/, 1];
                //create a custom package for that user
                context.data.packageName = custom.name;
                context.data.paperlink = custom.paperlink;
                context.data.teamMembers = custom.teamMembers;
                context.data.cc = custom.cc;
                context.data.publicProfile = custom.publicProfile;
                context.data.companyLedger = custom.companyLedger;
                context.data.isCustomPackage = true;
                monthly = constants_1.DEFAULT_VALUES.packagesPrices.paperlink * context.data.paperlink +
                    constants_1.DEFAULT_VALUES.packagesPrices.teamMembers * context.data.teamMembers +
                    constants_1.DEFAULT_VALUES.packagesPrices.cc * context.data.cc +
                    (context.data.publicProfile
                        ? constants_1.DEFAULT_VALUES.packagesPrices.publicProfile
                        : 0) +
                    (context.data.companyLedger
                        ? constants_1.DEFAULT_VALUES.packagesPrices.companyLedger
                        : 0);
                context.data.monthlyPrice = monthly;
                context.data.yearlyPrice = monthly * 12;
                return [3 /*break*/, 3];
            case 1:
                if (!context.data.packageId) {
                    throw new errors_1.BadRequest('packageId or custom data required');
                }
                return [4 /*yield*/, app_1["default"].services.packages.get(context.data.packageId)];
            case 2:
                packages = _a.sent();
                context.data._package = packages;
                context.data.packageName = packages.name;
                context.data.paperlink = packages.paperlink;
                context.data.teamMembers = packages.teamMembers;
                context.data.cc = packages.cc;
                context.data.publicProfile = packages.publicProfile;
                context.data.companyLedger = packages.companyLedger;
                context.data.monthlyPrice = packages.monthlyPrice;
                context.data.yearlyPrice = packages.yearlyPrice;
                _a.label = 3;
            case 3:
                //set amount and plan
                if (context.data.plan === constants_1.DEFAULT_VALUES.subscriptionsPlan.YEARLY) {
                    plan = constants_1.DEFAULT_VALUES.subscriptionsPlan.YEARLY;
                    amount = context.data.yearlyPrice;
                    interval = 'year';
                    endDate = moment_1["default"]().add(365, 'days').format('x');
                }
                else {
                    amount = context.data.monthlyPrice;
                }
                return [4 /*yield*/, exports.chargeUser(user, amount)];
            case 4:
                charge = _a.sent();
                if (!(context.data.isUpdate === true)) return [3 /*break*/, 7];
                return [4 /*yield*/, app_1["default"].services.subscriptions.find({
                        query: { userId: user.id }
                    })];
            case 5:
                prevSub = _a.sent();
                return [4 /*yield*/, app_1["default"].services.subscriptions.remove(prevSub.data[0].id)];
            case 6:
                _a.sent();
                _a.label = 7;
            case 7:
                //create subscription
                context.data.stripeChargeId = charge.id;
                context.data.plan = plan;
                context.data.amount = amount;
                context.data.startDate = parseInt(startDate);
                context.data.endDate = parseInt(endDate);
                context.data.paymentType = constants_1.DEFAULT_VALUES.subscriptionsPaymentType.CARD;
                context.data.status =
                    (charge === null || charge === void 0 ? void 0 : charge.status) === 'succeeded'
                        ? constants_1.DEFAULT_VALUES.subscriptionsStatus.ACTIVE
                        : charge === null || charge === void 0 ? void 0 : charge.status;
                _a.label = 8;
            case 8: return [2 /*return*/, context];
        }
    });
}); };
var upgrade = function (context) { return __awaiter(void 0, void 0, void 0, function () {
    var subscription, amount, charge, date, current_date;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!(context.data.upgrade === true)) return [3 /*break*/, 3];
                return [4 /*yield*/, app_1["default"].services.subscriptions.get(context.id)];
            case 1:
                subscription = _a.sent();
                amount = constants_1.DEFAULT_VALUES.packagesPrices.paperlink *
                    context.data.additional_paperlink +
                    constants_1.DEFAULT_VALUES.packagesPrices.teamMembers *
                        context.data.additional_teamMembers +
                    constants_1.DEFAULT_VALUES.packagesPrices.cc * context.data.additional_cc;
                return [4 /*yield*/, exports.chargeUser(context.parans.user, amount)];
            case 2:
                charge = _a.sent();
                if (!charge) {
                    throw new errors_1.BadRequest('failed to charge user card');
                }
                context.data.paperlink =
                    context.data.additional_paperlink + subscription.paperlink;
                context.data.teamMembers =
                    context.data.additional_teamMembers + subscription.teamMembers;
                context.data.cc = context.data.additional_cc + subscription.cc;
                context.data.action = subscription.amount + amount;
                _a.label = 3;
            case 3:
                if (!(context.data.isCancelled === true)) return [3 /*break*/, 5];
                date = new Date();
                current_date = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
                return [4 /*yield*/, package_subscription_cancel_1.sendPackageSubscriptionCancel(context.params.user, current_date)];
            case 4:
                _a.sent();
                _a.label = 5;
            case 5: return [2 /*return*/, context];
        }
    });
}); };
var packageInvoiceCreate = function (context) { return __awaiter(void 0, void 0, void 0, function () {
    var pdfDoc, pngUrl, pngImageBytes, pngImage, pngDims, page, _a, width, height, fontSize, pdfBytes, user, datax, configData;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, pdf_lib_1.PDFDocument.create()];
            case 1:
                pdfDoc = _b.sent();
                pngUrl = app_1["default"].get('base_url') + "/invoice_reciepts.png";
                return [4 /*yield*/, node_fetch_1["default"](pngUrl).then(function (res) { return res.arrayBuffer(); })];
            case 2:
                pngImageBytes = _b.sent();
                return [4 /*yield*/, pdfDoc.embedPng(pngImageBytes)];
            case 3:
                pngImage = _b.sent();
                pngDims = pngImage.scale(0.5);
                page = pdfDoc.addPage([pngDims.width, pngDims.height]);
                page.drawImage(pngImage, {
                    width: pngDims.width,
                    height: pngDims.height
                });
                _a = page.getSize(), width = _a.width, height = _a.height;
                fontSize = 14;
                page.drawText("#" + context.result.id + "-" + moment_1["default"]().year(), {
                    x: 220,
                    y: height - 16.7 * fontSize,
                    size: fontSize,
                    color: pdf_lib_1.rgb(0.48, 0.48, 0.48)
                });
                page.drawText("" + moment_1["default"](context.data.startDate, "x").format("MMM YYYY"), {
                    x: 530,
                    y: height - 16.9 * fontSize,
                    size: fontSize,
                    color: pdf_lib_1.rgb(0.48, 0.48, 0.48)
                });
                page.drawText("" + context.data.companyName, {
                    x: 220,
                    y: height - 19.2 * fontSize,
                    size: fontSize,
                    color: pdf_lib_1.rgb(0.48, 0.48, 0.48)
                });
                page.drawText('Visa (4*** ** *** 4242)', {
                    x: 220,
                    y: height - 22.1 * fontSize,
                    size: fontSize,
                    color: pdf_lib_1.rgb(0.48, 0.48, 0.48)
                });
                // summary
                page.drawText(moment_1["default"](context.data.startDate, "x").format("MMM YYYY") + " to " + moment_1["default"](context.data.endDate, "x").format("MMM YYYY"), {
                    x: 220,
                    y: height - 29.6 * fontSize,
                    size: fontSize,
                    color: pdf_lib_1.rgb(0.48, 0.48, 0.48)
                });
                page.drawText("" + context.data.packageName, {
                    x: 84,
                    y: height - 32.1 * fontSize,
                    size: 16,
                    color: pdf_lib_1.rgb(0.48, 0.48, 0.48)
                });
                page.drawText("$" + context.data.amount, {
                    x: 530,
                    y: height - 32.2 * fontSize,
                    size: fontSize,
                    color: pdf_lib_1.rgb(0.48, 0.48, 0.48)
                });
                page.drawText("$" + context.data.amount, {
                    x: 530,
                    y: height - 36 * fontSize,
                    size: fontSize,
                    color: pdf_lib_1.rgb(0.48, 0.48, 0.48)
                });
                // contact us in footer
                page.drawText('www.paperdaz.com/contact-us', {
                    x: 450,
                    y: height - 51.2 * fontSize,
                    size: 11,
                    color: pdf_lib_1.rgb(0.48, 0.48, 0.48)
                });
                page.drawText('contact@paperdaz.com', {
                    x: 450,
                    y: height - 52.3 * fontSize,
                    size: 11,
                    color: pdf_lib_1.rgb(0.48, 0.48, 0.48)
                });
                return [4 /*yield*/, pdfDoc.save()];
            case 4:
                pdfBytes = _b.sent();
                return [4 /*yield*/, promises_1.writeFile('./src/services/subscriptions/paperdaz_receipt.pdf', pdfBytes)];
            case 5:
                _b.sent();
                console.log('Invoice PDF created!');
                user = context.params.user;
                datax = new form_data_1["default"]();
                //@ts-ignore
                datax.append('upload', fs_1["default"].createReadStream('./src/services/subscriptions/paperdaz_receipt.pdf'));
                datax.append('type', 'pdf');
                configData = {
                    method: 'post',
                    url: app_1["default"].get('base_url') + "/files",
                    data: datax
                };
                return [4 /*yield*/, axios_1["default"](configData)
                        .then(function (response) {
                        return __awaiter(this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, paperdaz_receipt_1.sendPaperdazReceipt(user, response.data.location)];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        });
                    })["catch"](function (error) {
                        console.log(error);
                        throw new Error(error);
                    })];
            case 6:
                _b.sent();
                return [2 /*return*/];
        }
    });
}); };
var afterSubscription = function (context) { return __awaiter(void 0, void 0, void 0, function () {
    var user, paidUser, subCredit_1, referree_1, dispaersedCredit, totalCreditDispersed, notificationSettings, message_1;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                if (!(context.data.action !== 'retry')) return [3 /*break*/, 17];
                if (!(context.data.createFlage === true)) return [3 /*break*/, 8];
                if (!context.data.packageId) return [3 /*break*/, 2];
                return [4 /*yield*/, app_1["default"].services.packages.patch(context.data.packageId, {
                        numberOfSubscribers: context.data._package.numberOfSubscribers + 1
                    })];
            case 1:
                _c.sent();
                _c.label = 2;
            case 2:
                if (!context.data.companyName) return [3 /*break*/, 8];
                user = context.params.user;
                return [4 /*yield*/, app_1["default"].services.users.create({
                        firstName: user.firstName,
                        lastName: user.lastName,
                        companyEmail: context.params.user.role === constants_1.DEFAULT_VALUES.users.roles.FREE_USER
                            ? user.email
                            : user.companyEmail,
                        companyName: context.data.companyName,
                        email: 'temp' +
                            Math.floor(Math.random() * Math.pow(10, 8)) +
                            '@paperdaz.com',
                        password: user.referralCode,
                        role: constants_1.DEFAULT_VALUES.users.roles.PAID_USER,
                        status: constants_1.DEFAULT_VALUES.users.status.ACTIVE,
                        subscriptionId: context.result.id,
                        mainAccountId: context.params.user.role === constants_1.DEFAULT_VALUES.users.roles.FREE_USER
                            ? user.id
                            : user.mainAccountId
                    })
                    // update user email
                ];
            case 3:
                paidUser = _c.sent();
                // update user email
                return [4 /*yield*/, app_1["default"].services.users.patch(paidUser.id, {
                        email: 'business' + paidUser.id + '@paperdaz.com'
                    })
                    //update subscription
                ];
            case 4:
                // update user email
                _c.sent();
                //update subscription
                return [4 /*yield*/, app_1["default"].services.subscriptions.patch(context.result.id, {
                        userId: paidUser.id
                    })];
            case 5:
                //update subscription
                _c.sent();
                return [4 /*yield*/, package_subscription_1.sendPackageSubscription(paidUser, context.data.packageName)
                    //subscription notification
                ];
            case 6:
                _c.sent();
                //subscription notification
                return [4 /*yield*/, packageInvoiceCreate(context)];
            case 7:
                //subscription notification
                _c.sent();
                _c.label = 8;
            case 8: return [4 /*yield*/, app_1["default"].services['admin-settings'].find({
                    query: { name: constants_1.DEFAULT_VALUES.adminSettings.REFERRAL_CREDIT }
                })
                //create referal credit
            ];
            case 9:
                subCredit_1 = _c.sent();
                if (!(context.params.user.isReferreePaid == false &&
                    context.params.user.referreeId != null)) return [3 /*break*/, 17];
                return [4 /*yield*/, app_1["default"].services.users.get(context.params.user.referreeId)];
            case 10:
                referree_1 = _c.sent();
                return [4 /*yield*/, app_1["default"].services.referral.create({
                        type: constants_1.DEFAULT_VALUES.referalType.PAYMENT,
                        referreeName: referree_1.firstName + ' ' + referree_1.lastName,
                        referreeCompanyName: (_a = referree_1.companyName) !== null && _a !== void 0 ? _a : '',
                        newUserName: context.params.user.firstName + ' ' + context.params.user.lastName,
                        newUserCompanyName: (_b = context.params.user.companyName) !== null && _b !== void 0 ? _b : '',
                        creditEarned: subCredit_1[0].value,
                        referralCode: referree_1.referralCode
                    })
                    //award credit
                ];
            case 11:
                _c.sent();
                //award credit
                return [4 /*yield*/, app_1["default"].services.users.patch(referree_1.id, {
                        totalCreditsEarned: referree_1.totalCreditsEarned + subCredit_1[0].value
                    })
                    //save mark as paid
                ];
            case 12:
                //award credit
                _c.sent();
                //save mark as paid
                return [4 /*yield*/, app_1["default"].services.users.patch(context.params.user.id, {
                        isReferreePaid: true
                    })
                    //get dispaersed credit
                ];
            case 13:
                //save mark as paid
                _c.sent();
                return [4 /*yield*/, app_1["default"].services['admin-settings'].find({
                        query: { name: constants_1.DEFAULT_VALUES.adminSettings.TOTAL_CREDIT_DISPERSED }
                    })];
            case 14:
                dispaersedCredit = _c.sent();
                totalCreditDispersed = dispaersedCredit[0].value + subCredit_1[0].value;
                return [4 /*yield*/, app_1["default"].services['admin-settings'].patch(dispaersedCredit[0].id, {
                        value: totalCreditDispersed
                    })
                    //create notification
                ];
            case 15:
                _c.sent();
                return [4 /*yield*/, app_1["default"].services['notification-settings'].find({ query: { userId: referree_1.id } })];
            case 16:
                notificationSettings = _c.sent();
                message_1 = '{' +
                    context.params.user.firstName +
                    ' ' +
                    context.params.user.lastName +
                    '}' +
                    ' ' +
                    constants_1.DEFAULT_VALUES.notificationMessage.SUCCESSFULLY_REFERRAL_SUBSCRIPTION +
                    'you earn ' +
                    subCredit_1[0].value +
                    ' Credits';
                notificationSettings.map(function (notification) { return __awaiter(void 0, void 0, void 0, function () {
                    var refIsBusiness, userIsBusiness;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!(notification.type === constants_1.DEFAULT_VALUES.notificationType.APP &&
                                    notification.referalCredit === true)) return [3 /*break*/, 2];
                                return [4 /*yield*/, app_1["default"].services.notification.create({
                                        message: message_1,
                                        userId: referree_1.id
                                    })];
                            case 1:
                                _a.sent();
                                _a.label = 2;
                            case 2:
                                if (!(notification.type === constants_1.DEFAULT_VALUES.notificationType.EMAIL &&
                                    notification.referalCredit === true)) return [3 /*break*/, 4];
                                refIsBusiness = false;
                                userIsBusiness = false;
                                if (referree_1.data[0].role === constants_1.DEFAULT_VALUES.users.roles.PAID_USER) {
                                    refIsBusiness = true;
                                }
                                if (context.result.role === constants_1.DEFAULT_VALUES.users.roles.PAID_USER) {
                                    userIsBusiness = true;
                                }
                                return [4 /*yield*/, referal_rewards_1["default"](referree_1, context.params.user, subCredit_1[0].value.toString(), 'credit', refIsBusiness, userIsBusiness)];
                            case 3:
                                _a.sent();
                                _a.label = 4;
                            case 4: return [2 /*return*/];
                        }
                    });
                }); });
                _c.label = 17;
            case 17: return [2 /*return*/, context];
        }
    });
}); };
var retryPayment = function (context) { return __awaiter(void 0, void 0, void 0, function () {
    var subscription, charge, update;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!(context.data.action === 'retry')) return [3 /*break*/, 6];
                return [4 /*yield*/, app_1["default"].services.subscriptions.find({
                        query: { userId: context.params.user.id }
                    })
                    //check if user has card
                ];
            case 1:
                subscription = _a.sent();
                return [4 /*yield*/, exports.chargeUser(context.parans.user, subscription.data[0].amount)];
            case 2:
                charge = _a.sent();
                if (!charge) {
                    throw new errors_1.BadRequest('an error occur while charging users card');
                }
                if (charge.status !== 'succeeded') {
                    throw new errors_1.BadRequest('an error occur while charging users card please check card and try again');
                }
                //notify user
                return [4 /*yield*/, app_1["default"].services.notification.create({
                        userId: context.params.user.id,
                        message: "Your Subscription of " + subscription.data[0].packageName + ", was successful"
                    })];
            case 3:
                //notify user
                _a.sent();
                return [4 /*yield*/, package_subscription_1.sendPackageSubscription(context.params.user, subscription.data[0].packageName)
                    //update subscription
                ];
            case 4:
                _a.sent();
                return [4 /*yield*/, app_1["default"].services.subscriptions.patch(subscription.data[0].id, {
                        startDate: moment_1["default"]().format('YYYY-MM-DD HH:MM'),
                        endDate: subscription.data[0].plan === 'monthly'
                            ? moment_1["default"]().format('YYYY-MM-DD HH:MM')
                            : moment_1["default"]().format('YYYY-MM-DD HH:MM'),
                        status: constants_1.DEFAULT_VALUES.subscriptionsStatus.ACTIVE,
                        isCancelled: true
                    })];
            case 5:
                update = _a.sent();
                context.result = update;
                _a.label = 6;
            case 6: return [2 /*return*/, context];
        }
    });
}); };
exports["default"] = {
    before: {
        all: [authenticate('jwt')],
        find: [get_subscription_related_hook_1["default"]()],
        get: [get_subscription_related_hook_1["default"]()],
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
};
