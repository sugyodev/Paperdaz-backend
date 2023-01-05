// See https://sequelize.org/master/manual/model-basics.html
// for more of what you can do here.
import { Sequelize, DataTypes, Model } from 'sequelize';
import { Application } from '../declarations';
import { HookReturn } from 'sequelize/types/hooks';
import { DEFAULT_VALUES } from '../utils/constants';


export default function (app: Application): typeof Model {
  const sequelizeClient: Sequelize = app.get('sequelizeClient');
  const files = sequelizeClient.define('files', {

    fileName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    fixedFileName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    fileAction: {
      type: DataTypes.ENUM(DEFAULT_VALUES.fileActions.SAVED,DEFAULT_VALUES.fileActions.UPLOADED,DEFAULT_VALUES.fileActions.COMPLETE, DEFAULT_VALUES.fileActions.CONFIRM, DEFAULT_VALUES.fileActions.SIGNED, DEFAULT_VALUES.fileActions.SHARED, DEFAULT_VALUES.fileActions.EDITING),
      defaultValue:null
    },
    paperLink: {
      type: DataTypes.STRING,
      allowNull:false
    },
    downloadLink: {
      type: DataTypes.STRING,
      allowNull: false
    },
    key: {
      type: DataTypes.STRING,
      allowNull: false
    },
    annotaions: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    leavesEarned: {
      type: DataTypes.INTEGER,
      defaultValue:DEFAULT_VALUES.leavesEarned.SAVED
    },
    shared: {
      type: DataTypes.ENUM(DEFAULT_VALUES.sharedChannels.FACEBOOK, DEFAULT_VALUES.sharedChannels.LINKED, DEFAULT_VALUES.sharedChannels.REDDIT, DEFAULT_VALUES.sharedChannels.TELEGRAM, DEFAULT_VALUES.sharedChannels.TWITTER, DEFAULT_VALUES.sharedChannels.WHATSAPP),
      allowNull: true
    },
    filePrivacy: {
      type: DataTypes.ENUM(DEFAULT_VALUES.filesPrivacy.DO_NOT_POST,DEFAULT_VALUES.filesPrivacy.PRIVATE, DEFAULT_VALUES.filesPrivacy.PUBLIC),
      defaultValue:DEFAULT_VALUES.filesPrivacy.PUBLIC
    },
    userName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    role: {
      type: DataTypes.STRING,
      allowNull: true
    },
    teamMemberId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    isSuspended: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    cc: {
      type: DataTypes.STRING,
      allowNull: true
    },
    uploadedBy: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    isEditing: {
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
  (files as any).associate = function (models: any): void {
    // Define associations here
    // See https://sequelize.org/master/manual/assocs.html
    const {users, files, folders} = models;
    files.belongsTo(users)
    files.belongsTo(folders)
    folders.hasMany(files)
  };

  return files;
}
