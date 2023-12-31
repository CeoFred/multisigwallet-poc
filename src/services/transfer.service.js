const { AlchemyProvider,SigningKey,verifyMessage,BaseWallet,parseEther } = require("ethers");

const {NONCE_ACCOUNT_LENGTH,sendAndConfirmTransaction, Keypair,Connection, PublicKey, Transaction, SystemProgram} = require("@solana/web3.js");

const CryptoTransfer = require("../models/transfer.model");

const WalletServ = require("./wallet.service");

const CustomError = require("../utils/custom-error");
class CryptoTransferService {
  
  async getSingle(id){
    const tf =  await CryptoTransfer.findById(id)
    const { wallet_id } = tf
      const wallet = await WalletServ.getWallet(wallet_id);

    return {transfer_request: tf,wallet};
  }

  async getAll(){
    const tf =  await CryptoTransfer.find({})
    let data = [];

    data =  tf.map(async (transferReq) => {
      const { wallet_id } = transferReq
      const wallet = await WalletServ.getWallet(wallet_id);

    if (!wallet){
      return;
    }
      // console.log(wallet)

    return {
      transaction: transferReq,
      wallet: wallet
    }
    });

    data = await Promise.all(data)
    return data.filter(wallet => wallet)
  }

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
      throw new CustomError("Transfer request is already completed")
    }
    const wallet = await WalletServ.getWallet(wallet_id);

    if (!wallet){
      throw new CustomError("Couldn't find wallet")
    }

    const { minSignatureApprovals,signers ,isActive, network,walletSecretPhrase} = wallet

    if (!isActive) {
      throw new CustomError("wallet is not active")
    }

    if (!signers.includes(recoveredAddress)){
      throw new CustomError(`Invalid signer`)
    }

    // check if the user has signed before
   if (transfer_signers.includes(recoveredAddress)){
      throw new CustomError(`Already signed`)
    } 

    transfer_request.signatures.push(signature)
    transfer_request.signers.push(address)

    transfer_request.totalSignatures++

    if (transfer_request.signers.length >= minSignatureApprovals){
      // transfer 
      if (network === "ETH"){
         const hash = await this.transferEth({
            receipient,
            asset,
            amount,
            walletSecretPhrase
          })
          transfer_request.hash = `https://sepolia.etherscan.io/tx/${hash}`
      }
 
      if (network === "SOL"){
    const hash = await this.transferSOL({
      receipient,
            asset,
            amount,
            walletSecretPhrase
    })
     transfer_request.hash = hash
      }
        transfer_request.completed = true;
       
    }
     await transfer_request.save();
     return transfer_request.hash;
  }


  async get(id){
     return await CryptoTransfer.findById(id)
  }

 

  async transferSOL({ receipient, asset, amount, walletSecretPhrase }){
    try {
  
     let seed = Uint8Array.from(walletSecretPhrase.split(','));
  
      let accountFromSecret = Keypair.fromSecretKey(seed);
         const SOLANA_CONNECTION = new Connection("https://icy-weathered-seed.solana-devnet.discover.quiknode.pro/c6fbd45e221d5e8443beb79775e80bf8e43221e3/", 'confirmed');

    const amountInSol = Number(amount);
    const amountInLamports = Math.round(amountInSol * Math.pow(10, 9));
    const wallet = accountFromSecret;

    const recipientAddress = new PublicKey(receipient);
      
    let transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: wallet.publicKey,
        toPubkey: recipientAddress,
        lamports: amountInLamports
      })
    );

    let { blockhash } = await SOLANA_CONNECTION.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = wallet.publicKey;
  
    const signature = await sendAndConfirmTransaction(SOLANA_CONNECTION, transaction, [wallet]);

    return `https://solscan.io/tx/${signature}?cluster=devnet`;

    } catch (error) {
          throw new CustomError('Error transferring SOL:', error);
    }
  }

  async transferEth({ receipient, asset, amount, walletSecretPhrase }){
try {
  
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

  }
  }


}

module.exports = new CryptoTransferService();