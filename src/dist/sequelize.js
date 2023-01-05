"use strict";
exports.__esModule = true;
var sequelize_1 = require("sequelize");
function default_1(app) {
    var connectionString = app.get('mysql');
    // const connectionString = app.get('mysql_local');
    var sequelize = new sequelize_1.Sequelize(connectionString, {
        dialect: 'mysql',
        logging: false,
        define: {
            freezeTableName: true
        }
    });
    var oldSetup = app.setup;
    app.set('sequelizeClient', sequelize);
    app.setup = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var result = oldSetup.apply(this, args);
        // Set up data relationships
        var models = sequelize.models;
        Object.keys(models).forEach(function (name) {
            if ('associate' in models[name]) {
                models[name].associate(models);
            }
        });
        // Sync to the database
        // app.set('sequelizeSync', sequelize.sync());
        app.set('sequelizeSync', sequelize.sync({ alter: false, force: false }));
        return result;
    };
}
exports["default"] = default_1;
