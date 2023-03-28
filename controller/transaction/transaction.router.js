const express = require("express");
const {
  controllerGetTransactions,
  controllerGetTransactionsById,
  controllerAddTransaction,
} = require("./transaction.controller");
const router = express.Router();

router.get("/", controllerGetTransactions);
router.get("/:id", controllerGetTransactionsById);
router.post("/", controllerAddTransaction);

module.exports = router;
