const WalletServ = require("./../services/wallet.service");
const response = require("./../utils/response");

class WalletContoller {
  async create(req, res) {
        let result;
    if (req.body.network === "ETH"){
        result = await WalletServ.createEthWallet(req.body);
    }
   
    res.status(201).send(response("Wallet created", result._id));
  }

  async get(req, res) {
    let result = await WalletServ.getWallet(req.params.wallet_id);
    res.status(200).send(response("Wallet retrieved", result));
  }

  async addSigner(req, res) {
   let result =  await WalletServ.addSignerToWallet(req.body)
    res.status(200).send(response("Updated", result));
  }

  async removeSigner(req, res) {
   let result =  await WalletServ.removeSigner(req.body)
    res.status(200).send(response("Removed signer", result));
  }

  async getWalletSigners(req,res){
    
   let result =  await WalletServ.getWalletSigners(req.params.wallet_id)
    res.status(200).send(response("Retrieved", result));
  
  }

}

module.exports = new WalletContoller();