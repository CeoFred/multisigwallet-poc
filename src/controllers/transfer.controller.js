const CrytpoTransferService = require("../services/transfer.service");
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

 async get(req, res) {
     const result = await CrytpoTransferService.getAll();
    res.status(200).send(response("retrieved", result));
 
 }
 async getSingle(req, res) {
  const id =  req.params.transfer_id
    const result = await CrytpoTransferService.getSingle(id);
    res.status(200).send(response("retrieved", result));
 }

}

module.exports = new CryptoTransaferContoller();