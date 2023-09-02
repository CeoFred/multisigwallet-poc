const router = require("express").Router();
const CryptoTransferCtrl = require("../controllers/transfer.controller");

router.post("/",  CryptoTransferCtrl.create);
router.get("/",  CryptoTransferCtrl.get);
router.get("/:transfer_id",  CryptoTransferCtrl.getSingle);

router.post("/sign",  CryptoTransferCtrl.sign);



module.exports = router