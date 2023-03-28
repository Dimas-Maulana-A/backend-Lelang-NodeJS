const express = require("express");
const {
  controllerGetRole,
  controllerGetRoleById,
  controllerAddRole,
  controllerUpdateRole,
  controllerDeleteRole,
} = require("./role.controller");
const router = express.Router();

router.get("/", controllerGetRole);
router.get("/:id", controllerGetRoleById);
router.post("/", controllerAddRole);
router.put("/:id", controllerUpdateRole);
router.delete("/:id", controllerDeleteRole);

module.exports = router;
