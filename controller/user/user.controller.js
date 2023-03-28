const models = require("./../../models/index");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const user = models.user;

module.exports = {
  controllerGetUser: (req, res) => {
    user
      .findAll({
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
  controllerGetUserById: (req, res) => {
    user
      .findOne({
        where: {
          id: req.params.id,
        },
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
  controllerAddUser: async (req, res) => {
    const id = uuidv4();
    const { name, username, password, role } = req.body;
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);
    const data = {
      id: id,
      name: name,
      username: username,
      password: hash,
      role: role,
    };
    user
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
  controllerUpdateUser: async (req, res) => {
    const { name, username, password, role } = req.body;
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);
    const data = {
      name: name,
      username: username,
      password: hash,
      role: role,
    };
    user
      .update(data, {
        where: {
          id: req.params.id,
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
  controllerChangePassword: async (req, res) => {
    user
      .findOne({
        where: {
          username: req.body.username,
        },
      })
      .then(async (result) => {
        const match = await bcrypt.compare(
          req.body.oldpassword,
          result.password
        );
        if (!match) return res.status(400).json({ message: "wrong password" });
        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash(req.body.newpassword, salt);
        const data = {
          password: hash,
        };
        user
          .update(data, {
            where: {
              id: result.id,
            },
          })
          .then((result) => {
            res.json({
              message: "password updated",
            });
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  },
  controllerDeleteUser: (req, res) => {
    user
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
  controllerLoginUser: (req, res) => {
    user
      .findOne({
        where: {
          username: req.body.username,
        },
      })
      .then(async (result) => {
        const match = await bcrypt.compare(req.body.password, result.password);
        if (!match) return res.status(400).json({ message: "wrong password" });

        const id = result.id;
        const username = result.username;

        const sign = jwt.sign((id, username), process.env.TOKEN);
        res.json({
          token: sign,
        });
      })
      .catch((err) => {
        res.status(404).json({
          message: "username not found",
        });
      });
  },
};
