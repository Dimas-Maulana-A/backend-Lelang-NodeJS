'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.transaction, {
        foreignKey: "id",
        as: "products_id"
      })
    }
  }
  product.init({
    name: DataTypes.STRING,
    price: DataTypes.DOUBLE,
    image: DataTypes.STRING,
    description: DataTypes.TEXT,
    status: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'product',
    tableName: 'product'
  });
  return product;
};