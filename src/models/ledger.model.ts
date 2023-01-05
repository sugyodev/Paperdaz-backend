// See https://sequelize.org/master/manual/model-basics.html
// for more of what you can do here.
import { Sequelize, DataTypes, Model } from 'sequelize';
import { Application } from '../declarations';
import { HookReturn } from 'sequelize/types/hooks';

export default function (app: Application): typeof Model {
  const sequelizeClient: Sequelize = app.get('sequelizeClient');
  const ledger = sequelizeClient.define('ledger', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    fileOwnerId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    fileName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    action: {
      type: DataTypes.STRING,
      allowNull: false
    },

  }, {
    hooks: {
      beforeCount(options: any): HookReturn {
        options.raw = true;
      }
    }
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (ledger as any).associate = function (models: any): void {
    // Define associations here
    // See https://sequelize.org/master/manual/assocs.html
    const {files, users, ledger} = models;
    ledger.belongsTo(users, {
      as: 'fileOwner',
      foreignkey: 'owner'
    })
    ledger.belongsTo(users)
    ledger.belongsTo(files)
  };

  return ledger;
}
