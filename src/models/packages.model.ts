// See https://sequelize.org/master/manual/model-basics.html
// for more of what you can do here.
import { Sequelize, DataTypes, Model } from 'sequelize';
import { Application } from '../declarations';
import { HookReturn } from 'sequelize/types/hooks';

export default function (app: Application): typeof Model {
  const sequelizeClient: Sequelize = app.get('sequelizeClient');
  const packages = sequelizeClient.define('packages', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
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
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    isCreatedByAdmin: {
      type: DataTypes.BOOLEAN
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: true
    },
    promoCode: {
      type: DataTypes.STRING,
      allowNull: true
    },
    monthlyPrice: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    yearlyPrice: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    tag:{
      type: DataTypes.STRING,
      allowNull: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    isPromotion: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    promotionStartDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    promotionEndDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    numberOfSubscribers: {
       type: DataTypes.INTEGER,
       allowNull: true,
       defaultValue: 0
    }
  }, {
    hooks: {
      beforeCount(options: any): HookReturn {
        options.raw = true;
      }
    }
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (packages as any).associate = function (models: any): void {
    // Define associations here
    // See https://sequelize.org/master/manual/assocs.html
    const {packages, features} = models;
    packages.hasMany(features)
    features.belongsTo(packages)

    // packages.hasOne(tag)
    // tag.belongsTo(packages)
  };

  return packages;
}
