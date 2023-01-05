// See https://sequelize.org/master/manual/model-basics.html
// for more of what you can do here.
import { Sequelize, DataTypes, Model } from 'sequelize';
import { Application } from '../declarations';
import { HookReturn } from 'sequelize/types/hooks';
import { DEFAULT_VALUES } from '../utils/constants';

export default function (app: Application): typeof Model {
  const sequelizeClient: Sequelize = app.get('sequelizeClient');
  const notificationSettings = sequelizeClient.define('notification_settings', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM(DEFAULT_VALUES.notificationType.APP, DEFAULT_VALUES.notificationType.EMAIL),
      allowNull: false
    },
    accessRequest: {
      type:DataTypes.BOOLEAN,
      defaultValue: true
    },
    inviteRequest: {
      type:DataTypes.BOOLEAN,
      defaultValue: true
    },
    fileAction: {
      type:DataTypes.BOOLEAN,
      defaultValue: false
    },
    referalCredit: {
      type:DataTypes.BOOLEAN,
      defaultValue:false
    },
    payment: {
      type:DataTypes.BOOLEAN,
      defaultValue: true
    },

  }, {
    hooks: {
      beforeCount(options: any): HookReturn {
        options.raw = true;
      }
    }
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (notificationSettings as any).associate = function (models: any): void {
    // Define associations here
    // See https://sequelize.org/master/manual/assocs.html
    const {users} = models;
      //  this.notificationSettings.belongsTo(users);
  };

  return notificationSettings;
}
