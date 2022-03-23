const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema(
  {
    dosenId: {
      type: String,
    },
    name: {
      type: String,
    },
    responeMidtrans: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", PaymentSchema);
