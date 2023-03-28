const models = require("./../../models/index");
const { v4: uuidv4 } = require("uuid");
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const product = models.product;
const app = express();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./image/");
  },
  filename: (req, file, cb) => {
    cb(null, `image-${Date.now()}.png`);
  },
});

const upload = multer({ storage: storage });

app.get("/", (req, res) => {
  product
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
});

app.get("/:id", (req, res) => {
  product
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
});

app.post("/", upload.single("image"), (req, res) => {
  if (!req.file) {
    res.json({
      message: "please input image",
    });
  } else {
    const id = uuidv4();
    const { name, price, description } = req.body;
    const data = {
      id: id,
      name: name,
      price: price,
      description: description,
      status: false,
      image: req.file.filename,
    };
    product
      .create(data)
      .then((result) => {
        res.json({
          data: data,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }
});

app.put("/:id", upload.single("image"), async (req, res) => {
  if (!req.file) {
    const { name, price, description } = req.body;
    const data = {
      name: name,
      price: price,
      description: description,
      status: false,
    };
    product
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
  } else {
    const results = await product.findOne({
      where: {
        id: req.params.id,
      },
    });
    let oldFileName = results.image;

    let dir = path.join(__dirname, "../../image/", oldFileName);
    fs.unlink(dir, (err) => {
      console.log(err);
    });

    const { name, price, description } = req.body;
    const data = {
      name: name,
      price: price,
      description: description,
      status: false,
      image: req.file.filename,
    };
    product
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
  }
});

app.delete("/:id", async (req, res) => {
  try {
    const results = await product.findOne({
      where: {
        id: req.params.id,
      },
    });
    let oldFileName = results.image;

    let dir = path.join(__dirname, "../../image/", oldFileName);
    fs.unlink(dir, (err) => {
      console.log(err);
    });

    product
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
  } catch (error) {
    product
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
  }
});

app.get("/img/:image", (req, res) => {
  let { image } = req.params;
  fs.readFile(`./image/${image}`, (err, data) => {
    if (err) return res.status(404).json({ message: "image not found" });
    res.writeHead(200, {
      "Content-Type": "image/png",
    });
    res.end(data);
  });
});

module.exports = app;
