// See https://sequelize.org/master/manual/model-basics.html
// for more of what you can do here.
import { Sequelize, DataTypes, Model } from 'sequelize';
import { Application } from '../declarations';
import { HookReturn } from 'sequelize/types/hooks';
import { DEFAULT_VALUES } from '../utils/constants';

export default function (app: Application): typeof Model {
  const sequelizeClient: Sequelize = app.get('sequelizeClient');
  const members = sequelizeClient.define('members', {
    companyId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    access: {
      type: DataTypes.ENUM(DEFAULT_VALUES.membersAccess.COMPANY_FILES, DEFAULT_VALUES.membersAccess.OWN_FILES),
      defaultValue:DEFAULT_VALUES.membersAccess.OWN_FILES
    },
    status: {
      type: DataTypes.ENUM(DEFAULT_VALUES.membersStatus.ACTIVE, DEFAULT_VALUES.membersStatus.DISABLE,  DEFAULT_VALUES.membersStatus.PENDING),
      defaultValue:DEFAULT_VALUES.membersStatus.PENDING
    },
    inviteCode: {
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
  (members as any).associate = function (models: any): void {
    // Define associations here
    // See https://sequelize.org/master/manual/assocs.html
    const {users, members} = models
    users.belongsTo(members)
  };

  return members;
}
