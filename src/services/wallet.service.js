const Wallet = require("./../models/wallet.model");
const CustomError = require("./../utils/custom-error");


class WalletService {
  async create(data) {
    return await new Wallet(data).save();
  }
 

}

module.exports = new WalletService();