const router = require("express").Router();
const WalletCtrl = require("./../controllers/wallet.controller");


router.post("/", WalletCtrl.create);
router.get("/", WalletCtrl.getAll);
router.get("/:wallet_id", WalletCtrl.get);
router.put("/new-signer", WalletCtrl.addSigner);
router.put("/remove-signer", WalletCtrl.removeSigner);
router.get("/signers/:wallet_id", WalletCtrl.getWalletSigners);

module.exports = router