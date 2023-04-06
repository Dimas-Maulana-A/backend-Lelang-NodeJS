const models = require("./../../models/index");
const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const user = models.user;

module.exports = {
  controllerGetUser: (req, res) => {
    user
      .findAll({
        attributes: {
          exclude: ["createdAt", "updatedAt"]
        },
        include: {
          model: models.role,
          as: "roles",
          attributes: {
            exclude: ["createdAt", "updatedAt"]
          }
        }
      })
      .then((result) => {
        res.json({
          data: result
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
          id: req.params.id
        },
        attributes: {
          exclude: ["createdAt", "updatedAt"]
        },
        include: {
          model: models.role,
          as: "roles",
          attributes: {
            exclude: ["createdAt", "updatedAt"]
          }
        }
      })
      .then((result) => {
        res.json({
          data: result
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
      status: false
    };
    user
      .create(data)
      .then((result) => {
        res.json({
          data: data
        });
      })
      .catch((err) => {
        console.log(err);
      });
  },
  controllerUpdateUser: async (req, res) => {
    const { name, username, password, role, status } = req.body;
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);
    const data = {
      name: name,
      username: username,
      password: hash,
      role: role,
      status: status
    };
    user
      .update(data, {
        where: {
          id: req.params.id
        }
      })
      .then((result) => {
        res.json({
          data: data
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
          username: req.body.username
        }
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
          password: hash
        };
        user
          .update(data, {
            where: {
              id: result.id
            }
          })
          .then((result) => {
            res.json({
              message: "password updated"
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
          id: req.params.id
        }
      })
      .then((result) => {
        res.json({
          message: "data was deleted"
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
          username: req.body.username
        }
      })
      .then(async (result) => {
        const match = await bcrypt.compare(req.body.password, result.password);
        if (!match) return res.status(400).json({ message: "wrong password" });

        // mail server

        const transport = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSW
          }
        });

        const randomPin = generateRandomPin();

        const mailOption = {
          from: process.env.EMAIL,
          to: req.body.username,
          subject: "Kode Verifikasi Login Lelang App",
          text: `Kode Verifikasinya adalah ${randomPin}`
        };

        transport.sendMail(mailOption, function (err, info) {
          if (err) {
            console.log(err);
          } else {
            console.log("email send :", info.response);
          }
        });

        // save Verifikasi

        models.otp
          .create({
            username: req.body.username,
            otp: randomPin,
            status: false
          })
          .then((result) => {
            console.log("success");
          })
          .catch((err) => {
            console.log(err);
          });

        const id = result.id;
        const username = result.username;

        const sign = jwt.sign((id, username), process.env.TOKEN);
        res.json({
          token: sign,
          __id: id
        });
      })
      .catch((err) => {
        res.status(404).json({
          message: "username not found"
        });
      });
  },
  verifyEmail: (req, res) => {
    models.otp
      .findOne({
        where: {
          otp: req.body.otp
        }
      })
      .then((result) => {
        if (result.username !== req.body.username) {
          return res.status(400).json({ message: "otp code was wrong" });
        } else if (result.status === true) {
          return res.status(400).json({ message: "token was used" });
        } else {
          models.otp
            .update(
              {
                status: true
              },
              {
                where: {
                  otp: req.body.otp
                }
              }
            )
            .then((results) => {
              user
                .findOne({
                  where: {
                    username: req.body.username
                  }
                })
                .then((d) => {
                  const id = d.id;
                  const username = d.username;

                  const sign = jwt.sign((id, username), process.env.TOKEN);
                  res.json({
                    token: sign,
                    __id: id
                  });
                })
                .catch((err) => {
                  console.log(err);
                });
            })
            .catch((err) => {
              console.log(err);
            });
        }
      })
      .catch((err) => {
        res.status(404).json({
          message: "token was wrong"
        })
      });
  }
};

function generateRandomPin() {
  const min = 1000;
  const max = 9999;
  return Math.floor(Math.random() * (max - min + 1) + min);
}
