const CrytpoTransferService = require("../services/transfer");
const response = require("../utils/response");

class CryptoTransaferContoller {
  async create(req, res) {
    const result = await CrytpoTransferService.create(req.body);
    res.status(201).send(response("Transfer request created", result));
  }

  async sign(req, res) {
    const result = await CrytpoTransferService.addSignature(req.body);
    res.status(200).send(response("Transfer signature added", result));
  }


}

module.exports = new CryptoTransaferContoller();