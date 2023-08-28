const router = require("express").Router();
const CryptoTransferCtrl = require("../controllers/transfer.controller");

router.post("/",  CryptoTransferCtrl.create);
router.post("/sign",  CryptoTransferCtrl.sign);



module.exports = router