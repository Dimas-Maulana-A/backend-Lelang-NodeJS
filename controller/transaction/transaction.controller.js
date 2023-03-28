const models = require("./../../models/index");
const { v4: uuidv4 } = require("uuid");
const transaction = models.transaction;

module.exports = {
  controllerGetTransactions: (req, res) => {
    transaction
      .findAll({
        attributes: {
          exclude: ["updatedAt"],
        },
        include: [
          {
            model: models.product,
            as: "products",
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
          },
          {
            model: models.user,
            as: "users",
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
            include: {
              model: models.role,
              as: "roles",
              attributes: {
                exclude: ["createdAt", "updatedAt"],
              },
            },
          },
        ],
      })
      .then((result) => {
        res.json({
          data: result,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  },
  controllerGetTransactionsById: (req, res) => {
    transaction
      .findOne({
        where: {
          id: req.params.id,
        },
        attributes: {
          exclude: ["updatedAt"],
        },
        include: [
          {
            model: models.product,
            as: "products",
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
          },
          {
            model: models.user,
            as: "users",
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
            include: {
              model: models.role,
              as: "roles",
              attributes: {
                exclude: ["createdAt", "updatedAt"],
              },
            },
          },
        ],
      })
      .then((result) => {
        res.json({
          data: result,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  },
  controllerAddTransaction: (req, res) => {
    const id = uuidv4();
    const { userId, productId, toPrice } = req.body;
    const data = {
      id: id,
      user_id: userId,
      product_id: productId,
      to_price: toPrice,
      status: false,
    };
    transaction
      .create(data)
      .then((result) => {
        res.json({
          data: result,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  },
//   controllerUpdateTransaction: ()=> {},
};
