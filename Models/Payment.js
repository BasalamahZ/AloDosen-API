const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
    },
    dosenId: {
      type: String,
    },
    responseMidtrans: {
      type: JSON,
    },
    type: {
      type: String
    },
    hari: {
      type: String
    },
    jam: {
      type: String
    },
    lokasi: {
      type: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", PaymentSchema);
