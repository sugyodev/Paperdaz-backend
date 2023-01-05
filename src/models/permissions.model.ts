// See https://sequelize.org/master/manual/model-basics.html
// for more of what you can do here.
import { Sequelize, DataTypes, Model } from 'sequelize';
import { Application } from '../declarations';
import { HookReturn } from 'sequelize/types/hooks';

export default function (app: Application): typeof Model {
  const sequelizeClient: Sequelize = app.get('sequelizeClient');
  const permissions = sequelizeClient.define('permissions', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    fileId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    fileOwnerId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    isGranted: {
      type: DataTypes.BOOLEAN,
     defaultValue: false
    }
  }, {
    hooks: {
      beforeCount(options: any): HookReturn {
        options.raw = true;
      }
    }
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (permissions as any).associate = function (models: any): void {
    // Define associations here
    // See https://sequelize.org/master/manual/assocs.html
    // const {users, files, permissions} = models;
    // users.hasMany(permissions);
    // permissions.belongsTo(users);
    // files.hasMany(permissions);
    // permissions.belongsTo(files);
  };

  return permissions;
}
