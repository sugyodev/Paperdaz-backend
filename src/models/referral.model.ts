// See https://sequelize.org/master/manual/model-basics.html
// for more of what you can do here.
import { Sequelize, DataTypes, Model } from 'sequelize';
import { Application } from '../declarations';
import { HookReturn } from 'sequelize/types/hooks';
import { DEFAULT_VALUES } from '../utils/constants';

export default function (app: Application): typeof Model {
  const sequelizeClient: Sequelize = app.get('sequelizeClient');
  const referral = sequelizeClient.define('referral', {
    type: {
      type: DataTypes.ENUM(DEFAULT_VALUES.referalType.PAYMENT, DEFAULT_VALUES.referalType.REGISTERATION),
      allowNull: false
    },
    referreeName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    referreeCompanyName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    newUserName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    newUserCompanyName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    leavesEarned: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    creditEarned: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    referralCode: {
      type: DataTypes.STRING,
      allowNull: false
    }


  }, {
    hooks: {
      beforeCount(options: any): HookReturn {
        options.raw = true;
      }
    }
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (referral as any).associate = function (models: any): void {
    // Define associations here
    // See https://sequelize.org/master/manual/assocs.html
  };

  return referral;
}
