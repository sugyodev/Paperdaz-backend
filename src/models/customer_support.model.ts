// See https://sequelize.org/master/manual/model-basics.html
// for more of what you can do here.
import { Sequelize, DataTypes, Model } from 'sequelize';
import { Application } from '../declarations';
import { HookReturn } from 'sequelize/types/hooks';
import { DEFAULT_VALUES } from '../utils/constants';

export default function (app: Application): typeof Model {
  const sequelizeClient: Sequelize = app.get('sequelizeClient');
  const customerSupport = sequelizeClient.define('customer_support', {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM(DEFAULT_VALUES.supportType.CUSTOMER,DEFAULT_VALUES.supportType.PARTNERSHIP),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM(DEFAULT_VALUES.supportStatus.NEW, DEFAULT_VALUES.supportStatus.INPROGRESS, DEFAULT_VALUES.supportStatus.COMPLETED),
      defaultValue: DEFAULT_VALUES.supportStatus.NEW
    }

  }, {
    hooks: {
      beforeCount(options: any): HookReturn {
        options.raw = true;
      }
    }
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (customerSupport as any).associate = function (models: any): void {
    // Define associations here
    // See https://sequelize.org/master/manual/assocs.html

  };

  return customerSupport;
}
