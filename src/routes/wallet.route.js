const router = require("express").Router();
const WalletCtrl = require("./../controllers/wallet.controller");


router.post("/", WalletCtrl.create);


module.exports = router