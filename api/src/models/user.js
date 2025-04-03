import { Model, DataTypes } from 'sequelize';
import db from "../database.js";
const sequelize = db.sequelize;
import bcrypt from 'bcryptjs';

export default class User extends Model { }
User.init(
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
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Please provide a value for "email"',
                },
                notEmpty: {
                    msg: 'Please provide a value for "email"',
                },
                isEmail: {
                    msg: 'Please provide a valid email address',
                }
            },
            unique: {
                msg: 'The email you entered already exists'
            }
        },
        password: {
            type: DataTypes.VIRTUAL,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Please provide a value for "password"',
                },
                notEmpty: {
                    msg: 'Please provide a value for "password"',
                },
                len: {
                    args: [8, 20],
                    msg: 'The password should be between 8 and 20 characters in length'
                }
            }
        },
        confirmedPassword: {
            type: DataTypes.STRING,
            allowNull: false,
            set(val) {
              if ( val === this.password ) {
                const hashedPassword = bcrypt.hashSync(val, 10);
                this.setDataValue('confirmedPassword', hashedPassword);
              }
            },
            validate: {
              notNull: {
                msg: 'Both passwords must match'
              }
            }
          }
    }, { sequelize, modelName: 'user' }
);
(async () => {
    await sequelize.sync();
})();
