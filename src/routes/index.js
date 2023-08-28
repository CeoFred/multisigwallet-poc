const router = require("express").Router();

router.use("/transfer", require("./transfer"));
router.use("/wallet", require("./wallet.route"));


module.exports = router