// See https://sequelize.org/master/manual/model-basics.html
// for more of what you can do here.
import { Sequelize, DataTypes, Model } from 'sequelize';
import { Application } from '../declarations';
import { HookReturn } from 'sequelize/types/hooks';
import { DEFAULT_VALUES } from '../utils/constants';

export default function (app: Application): typeof Model {
  const sequelizeClient: Sequelize = app.get('sequelizeClient');
  const subscriptions = sequelizeClient.define('subscriptions', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: true
    },
    packageName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    paperlink: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    teamMembers: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    cc: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    publicProfile: {
      type: DataTypes.BOOLEAN
    },
    companyLedger: {
      type: DataTypes.BOOLEAN
    },
    stripeChargeId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    plan: {
      type: DataTypes.ENUM(DEFAULT_VALUES.subscriptionsPlan.MONTHLY,DEFAULT_VALUES.subscriptionsPlan.YEARLY),
      allowNull: true
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: true
    },

    startDate: {
      type: DataTypes.DATE,
    },
    endDate: {
      type: DataTypes.DATE,
    },
    monthlyPrice: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    yearlyPrice: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    paymentType: {
      type: DataTypes.ENUM(DEFAULT_VALUES.subscriptionsPaymentType.CARD, DEFAULT_VALUES.subscriptionsPaymentType.CREDIT),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM(DEFAULT_VALUES.subscriptionsStatus.ACTIVE, DEFAULT_VALUES.subscriptionsStatus.EXPIRED),
      allowNull: false
    },
    isCancelled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    isCustomPackage: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
     //additional_feature
    // additional_paperlink: {
    //   type: DataTypes.INTEGER,
    //   allowNull: true
    // },
    // additional_teamMembers: {
    //   type: DataTypes.INTEGER,
    //   allowNull: true
    // },
    // additional_cc: {
    //   type: DataTypes.INTEGER,
    //   allowNull: true
    // },
    // additional_amount: {
    //   type: DataTypes.INTEGER,
    //   allowNull: true
    // },
    isRevenueCounted: {
      type: DataTypes.BOOLEAN,
      defaultValue:false
    },
    isBillingNotified: {
      type: DataTypes.BOOLEAN,
      defaultValue:false
    }

  }, {
    hooks: {
      beforeCount(options: any): HookReturn {
        options.raw = true;
      }
    }
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (subscriptions as any).associate = function (models: any): void {
    // Define associations here
    // See https://sequelize.org/master/manual/assocs.html
    // const user = Sequelize.define("users")
    const {subscriptions, users} = models
    users.hasOne(subscriptions)
    subscriptions.belongsTo(users)

  };

  return subscriptions;
}
