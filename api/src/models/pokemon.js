import { Model, DataTypes } from 'sequelize';
import db from "../database.js";
import { response } from 'express';
const sequelize = db.sequelize;

export default class Pokemon extends Model { }
Pokemon.init(
    {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Please provide a value for "name"',
                },
                notEmpty: {
                    msg: 'Please provide a value for "name"',
                }
            }
        },
        jessehas: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Please provide a value for "email"',
                }
            }
        },
        jesselocation: {
            type: DataTypes.STRING,
        },
        jessechasecard: {
            type: DataTypes.STRING,
        },
        jessenote: {
            type: DataTypes.STRING,
        },
        jasminehas: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Please provide a value for "email"',
                }
            }
        },
        jasminelocation: {
            type: DataTypes.STRING,
        },
        jasminechasecard: {
            type: DataTypes.STRING,
        },
        jasminenote: {
            type: DataTypes.STRING,
        },
        defaultlocation: {
            type: DataTypes.STRING,
        }

    }, { sequelize, modelName: 'pokemon' });
(async () => {
    await sequelize.sync();
})();