const WalletServ = require("./../services/wallet.service");
const response = require("./../utils/response");

class WalletContoller {
  async create(req, res) {
    const result = await WalletServ.create(req.body);
    res.status(200).send(response("Wallet created", result));
  }

}

module.exports = new WalletContoller();