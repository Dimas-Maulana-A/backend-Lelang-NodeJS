'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.product,{
        foreignKey: 'product_id',
        as:'products'
      })

      this.belongsTo(models.user, {
        foreignKey: 'user_id',
        as: 'users'
      })
    }
  }
  transaction.init({
    user_id: DataTypes.INTEGER,
    product_id: DataTypes.INTEGER,
    from_price: DataTypes.DOUBLE,
    to_price: DataTypes.DOUBLE,
    status: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'transaction',
  });
  return transaction;
};