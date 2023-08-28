const { AlchemyProvider,SigningKey,InfuraProvider,verifyMessage,BaseWallet,parseEther } = require("ethers");

const CryptoTransfer = require("../models/transfer.model");

const WalletServ = require("../services/wallet.service");

const CustomError = require("../utils/custom-error");
class CryptoTransferService {
  
  async create(dto) {
    const { wallet_id } = dto;
    const wallet = await WalletServ.getWallet(wallet_id);

    if (!wallet){
      throw new CustomError("Couldn't find wallet")
    }
    return await new CryptoTransfer(dto).save();
  }

  async addSignature(dto){
     const {signature, transfer_id, address, message } = dto;

// Recover the signer's address from the signature
const recoveredAddress = await verifyMessage(message, signature);

// Compare the recovered address with the provided address
if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
  throw new CustomError('Signature is invalid or does not match the provided address.');
}

// check that the recovered address is a valid signer for the wallet

    const transfer_request = await this.get(transfer_id);

    if (!transfer_request){
      throw new CustomError("Transfer request is invalid")
    }

    const {completed, wallet_id,amount,receipient,asset,signers:transfer_signers } = transfer_request


     if (completed) {
      throw new CustomError("Transfer request is completed")
    }
    const wallet = await WalletServ.getWallet(wallet_id);

    if (!wallet){
      throw new CustomError("Couldn't find wallet")
    }

    const { minSignatureApprovals,signers ,isActive, network,walletSecretPhrase} = wallet

    if (!isActive) {
      throw new CustomError("wallet is not active")
    }

    if (!signers.includes(recoveredAddress.toLowerCase())){
      throw new CustomError(`Invalid signer`)
    }

    // check if the user has signed before
   if (transfer_signers.includes(recoveredAddress.toLowerCase())){
      throw new CustomError(`Already signed`)
    } 

    transfer_request.signatures.push(signature)
    transfer_request.signers.push(address.toLowerCase())


    if (transfer_request.signers.length >= minSignatureApprovals){
      // transfer 
      if (network === "ETH"){
         const hash = await this.transferEth({
            receipient,
            asset,
            amount,
            walletSecretPhrase
          })
          transfer_request.hash = hash
      }
        transfer_request.totalSignatures++
        transfer_request.completed = true;
       
    }
     await transfer_request.save();
     return transfer_request.hash;
  }

  async get(id){
     return await CryptoTransfer.findById(id)
  }

  async transferEth({ receipient, asset, amount, walletSecretPhrase }){
try {
  console.log(walletSecretPhrase)


  if (asset === "native"){
    const provider = new AlchemyProvider('sepolia','CYyojO5sQrox99EHQcCnG4MTgvnQOnY4');

   // Connect wallet using secret phrase

   const pk = new SigningKey(walletSecretPhrase)
    const walletFromSecret = new BaseWallet(pk,provider);

    // Construct the transaction data
    const txData = {
      to: receipient,
      value: parseEther(amount.toString())  // Convert amount to wei
    };

    // Send the transaction
    const txResponse = await walletFromSecret.sendTransaction(txData);
    console.log('Transaction hash:', txResponse.hash);
    return txResponse.hash
  }
 
  } catch (error) {
    throw new CustomError('Error transferring ETH:', error);
    return null;
  }
  }


}

module.exports = new CryptoTransferService();