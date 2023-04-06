const express = require("express");
const {
  controllerGetUser,
  controllerGetUserById,
  controllerAddUser,
  controllerUpdateUser,
  controllerDeleteUser,
  controllerLoginUser,
  verifyEmail
} = require("./user.controller");
const router = express.Router();

router.get("/", controllerGetUser);
router.get("/:id", controllerGetUserById);
router.post("/", controllerAddUser);
router.put("/:id", controllerUpdateUser);
router.delete("/:id", controllerDeleteUser);
router.post("/login", controllerLoginUser)
router.post("/verify", verifyEmail)

module.exports = router;
