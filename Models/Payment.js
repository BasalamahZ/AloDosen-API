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
      type: String,
    },
    order_id: {
      type: String,
    },
    type: {
      type: String,
    },
    hari: {
      type: String,
    },
    jam: {
      type: String,
    },
    lokasi: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", PaymentSchema);
