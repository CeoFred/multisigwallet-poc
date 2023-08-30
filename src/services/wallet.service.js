const ethers = require('ethers');
const web3 = require("@solana/web3.js");

const Wallet = require("./../models/wallet.model");
const CustomError = require("./../utils/custom-error");


class WalletService {
  async createEthWallet(dto) {
    const wallet = ethers.Wallet.createRandom();

    const data = {
  name: dto.name,
  network: dto.network,
  address: wallet.address,
  walletId: 12,
  walletSecretPhrase: wallet.privateKey,
  isActive: true,
  maxSignatureApprovals: dto.maxSignatureApprovals,
  signers: dto.signers,
  assets: dto.assets,
    }
    return await new Wallet(data).save();
  }
 

  async createSOLWallet(dto) {
    const wallet = web3.Keypair.generate();

    const data = {
  name: dto.name,
  network: dto.network,
  address: wallet.publicKey.toBase58(),
  walletId: 12,
  walletSecretPhrase: wallet.secretKey.toString(),
  isActive: true,
  maxSignatureApprovals: dto.maxSignatureApprovals,
  signers: dto.signers,
  assets: dto.assets,
    }
    return await new Wallet(data).save();
  }

  async getWallet(id) {
    return await Wallet.findById(id)
  }

  async addSignerToWallet(dto){
    const wallet_id = dto.wallet_id
    const newSigners = dto.signers

    const wallet = await this.getWallet(wallet_id);
    if (!wallet){
      throw new CustomError("Couldn't find wallet")
    }

      newSigners.forEach(newSigner => {
      if (!wallet.signers.includes(newSigner)) {
        wallet.signers.push(newSigner.toLowerCase());
      }
    });
    // Save the updated wallet document
    await wallet.save();
  }

  async removeSigner(dto){
    const wallet_id = dto.wallet_id;
    const signerToRemove = dto.signer;

      const wallet = await this.getWallet(wallet_id);

    if (!wallet) {
      console.log('Wallet not found');
      return;
    }

    // Remove the signer from the signers array
    wallet.signers = wallet.signers.filter(signer => signer !== signerToRemove);

    // Save the updated wallet document
    await wallet.save();
  }

  async getWalletSigners(wallet_id){
       const wallet = await this.getWallet(wallet_id);
    if (!wallet){
      throw new CustomError("Couldn't find wallet")
    }

    return wallet.signers;
  }

}

module.exports = new WalletService();