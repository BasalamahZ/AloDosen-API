const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema(
  {
    dosenId: {
      type: String,
    },
    name: {
      type: String,
    },
    responseMidtrans: {
      type: JSON,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", PaymentSchema);
