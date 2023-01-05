// See https://sequelize.org/master/manual/model-basics.html
// for more of what you can do here.
import { Sequelize, DataTypes, Model } from 'sequelize';
import { Application } from '../declarations';
import { HookReturn } from 'sequelize/types/hooks';

export default function (app: Application): typeof Model {
  const sequelizeClient: Sequelize = app.get('sequelizeClient');
  const cards = sequelizeClient.define('cards', {
    card_holder_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    card_number: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    exp_month: {
      type: DataTypes.STRING,
      allowNull: false
    },
    exp_year: {
      type: DataTypes.STRING,
      allowNull: false
    },
    cvv: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue:true
    }

  }, {
    hooks: {
      beforeCount(options: any): HookReturn {
        options.raw = true;
      }
    }
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (cards as any).associate = function (models: any): void {
    // Define associations here
    // See https://sequelize.org/master/manual/assocs.html
    const {users, cards} = models;
    cards.belongsTo(users)

  };

  return cards;
}
