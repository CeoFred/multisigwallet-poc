const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const walletSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Wallet Name is required"],
    },
    network: {
      type: String,
      trim: true,
      unique: false,
      required: [true, "Network is required"],
    },
    address: {
      type: String,
      required: [true, "Address is required"],
    },
    walletId: {
      type: String,
      required: [true, "Wallet Id is required"],
    },
    walletSecretPhrase: {
      type: String,
      required: [true, "Wallet Phrase is required"]
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    minSignatureApprovals: {
      type: Number,
      required: [true, "Min signature is required"],
    },
    assets: {
      type : [String],
      required: [true, "Crypto asset must be provided"]
    },
    signers: {
       type : [String],
       required: [true, "Provide at least one signer"]
    }
  },
  {
    timestamps: true
  }
);


module.exports = mongoose.model('wallets', walletSchema)