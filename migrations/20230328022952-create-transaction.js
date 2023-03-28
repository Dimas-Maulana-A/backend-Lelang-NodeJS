'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('transactions', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      user_id: {
        type: Sequelize.UUID,
        references: {
          model: "user",
          key: "id"
        },
      },
      product_id: {
        type: Sequelize.UUID,
        references: {
          model: "product",
          key: "id"
        },
      },
      from_price: {
        type: Sequelize.DOUBLE
      },
      to_price: {
        type: Sequelize.DOUBLE
      },
      status: {
        type: Sequelize.BOOLEAN
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('transactions');
  }
};