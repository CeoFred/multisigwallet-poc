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
      unique: true,
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
      trim: true,
      required: [true, "Wallet Phrase is required"]
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    maxSignatureApprovals: {
      type: Number,
      required: [true, "Max signature is required"]
    }
  },
  {
    timestamps: true
  }
);


module.exports = mongoose.model('wallets', walletSchema)