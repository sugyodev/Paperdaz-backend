// See https://sequelize.org/master/manual/model-basics.html
// for more of what you can do here.
import { Sequelize, DataTypes, Model } from 'sequelize';
import { Application } from '../declarations';
import { HookReturn } from 'sequelize/types/hooks';
import { DEFAULT_VALUES } from '../utils/constants';

export default function (app: Application): typeof Model {
  const sequelizeClient: Sequelize = app.get('sequelizeClient');
  const leaves = sequelizeClient.define('leaves', {

    action: {
      type: DataTypes.ENUM(
        DEFAULT_VALUES.fileActions.COMPLETE,
        DEFAULT_VALUES.fileActions.CONFIRM,
        DEFAULT_VALUES.fileActions.SAVED,
        DEFAULT_VALUES.fileActions.SIGNED,
        DEFAULT_VALUES.fileActions.SHARED,
        DEFAULT_VALUES.fileActions.UPLOADED
      ),
      unique: true,
      allowNull: false
    },
    leavesPerAction: {
      type: DataTypes.INTEGER,
      defaultValue:0

    },
    totalLeaves: {
      type: DataTypes.INTEGER,
      defaultValue:0
    }
  }, {
    hooks: {
      beforeCount(options: any): HookReturn {
        options.raw = true;
      }
    }
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (leaves as any).associate = function (models: any): void {
    // Define associations here
    // See https://sequelize.org/master/manual/assocs.html
  };

  return leaves;
}
