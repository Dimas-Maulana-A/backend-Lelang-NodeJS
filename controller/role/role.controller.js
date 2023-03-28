const models = require("./../../models/index");
const role = models.role;

module.exports = {
  controllerGetRole: (req, res) => {
    role
      .findAll({
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
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
  controllerGetRoleById: (req, res) => {
    role
      .findOne({
        where: {
          id: req.params.id,
        },
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
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
  controllerAddRole: (req, res) => {
    const data = {
      name: req.body.name,
    };

    role
      .create(data)
      .then((result) => {
        res.json({
          data: data,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  },
  controllerUpdateRole: (req, res) => {
    const data = {
      name: req.body.name,
    };

    role
      .update(data, {
        where: {
          id: req.params.id,
        },
      })
      .then((result) => {
        res.json({
          data: data,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  },
  controllerDeleteRole: (req, res) => {
    role
      .destroy({
        where: {
          id: req.params.id,
        },
      })
      .then((result) => {
        res.json({
          message: "data was deleted",
        });
      })
      .catch((err) => {
        console.log(err);
      });
  },
};
