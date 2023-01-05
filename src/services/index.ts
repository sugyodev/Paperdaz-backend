import { Application } from '../declarations';
// import users from './users1/users.service';
import packages from './packages/packages.service';
import cards from './cards/cards.service';
import subscriptions from './subscriptions/subscriptions.service';
import features from './features/features.service';
import files from './files/files.service';
import categories from './categories/categories.service';
import faq from './faq/faq.service';
import folders from './folders/folders.service';
import emails from './emails/emails.service';
import leaves from './leaves/leaves.service';
import invoices from './invoices/invoices.service';
import legals from './legals/legals.service';
import customerSupport from './customer_support/customer_support.service';
import dailyActivies from './daily_activies/daily_activies.service';
import plantTree from './plant_tree/plant_tree.service';
import tags from './tag/tag.service';
import adminSettings from './admin-settings/admin-settings.service';
import referral from './referral/referral.service';
import dashboard from './dashboard/dashboard.service';
import pdfGenerator from './pdf-generator/pdf-generator.service';
import test from './test/test.service';
import members from './members/members.service';
import settings from './settings/settings.service';
import notification from './notification/notification.service';
import notificationSettings from './notification-settings/notification-settings.service';
import favourites from './favourites/favourites.service';
import request from './request/request.service';

import filetags from './filetags/filetags.service';

import users from './users/users.service';

import revenue from './revenue/revenue.service';

import socialShare from './social-share/social-share.service';

import permissions from './permissions/permissions.service';

import ledger from './ledger/ledger.service';

import verify from './verify/verify.service';

// Don't remove this comment. It's needed to format import lines nicely.

export default function (app: Application): void {
  app.configure(users);
  app.configure(packages);
  app.configure(cards);
  app.configure(subscriptions);
  app.configure(features);
  app.configure(files);
  app.configure(categories);
  app.configure(faq);
  app.configure(folders);
  app.configure(emails);
  app.configure(leaves);
  app.configure(invoices);
  app.configure(legals);
  app.configure(customerSupport);
  app.configure(dailyActivies);
  app.configure(plantTree);
  app.configure(tags);
  app.configure(adminSettings);
  app.configure(referral);
  app.configure(dashboard);
  app.configure(pdfGenerator);
  app.configure(test);
  app.configure(members);
  app.configure(settings);
  app.configure(notification);
  app.configure(notificationSettings);
  app.configure(favourites);
  app.configure(request);
  app.configure(filetags);
  // app.configure(users);
  app.configure(revenue);
  app.configure(socialShare);
  app.configure(permissions);
  app.configure(ledger);
  app.configure(verify);
}
