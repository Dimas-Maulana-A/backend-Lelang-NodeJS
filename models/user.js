'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.transaction, {
        foreignKey: 'id',
        as: 'users_id'
      })

      this.belongsTo(models.role, {
        foreignKey: 'role',
        as: 'roles'
      })
    }
  }
  user.init({
    name: DataTypes.STRING,
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'user',
  });
  return user;
};