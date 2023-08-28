const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const cryptoTransferSchema = new Schema(
  {
    wallet_id: {
      type: String,
      trim: true,
      required: [true, "Wallet is required"],
    },
    amount: {
      type: Number,
      trim: true,
      required: [true, "amount is required"],
    },
    totalSignatures: {
      type: Number,
      default: 0
    },
    completed: {
      type: Boolean,
      default: false
    },
    asset: {
      type: String,
      trim: true,
      default: "native"
    },
    hash: {
      type: String,
      trim: true,
    },
    signatures: {
      type: [String]
    },
    signers: {
      type: [String]
    },
    receipient: {
      type :String,
      required: true
    }
  },
  {
    timestamps: true
  }
);


module.exports = mongoose.model('crypto_transfers', cryptoTransferSchema)