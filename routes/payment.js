const router = require("express").Router();
const Payment = require("../Models/Payment");
const midtransClient = require("midtrans-client");

// Create Core API instance
let coreApi = new midtransClient.CoreApi({
  isProduction: false,
  serverKey: "SB-Mid-server-KJhF1EBlbLFpuVHflMr2DxTm",
  clientKey: "SB-Mid-client-dyrxC4AokmQVl_8E",
});

router.get("/payment", async (req, res) => {
  try {
    const data = await Payment.find();
    res.status(200).send({
      success: true,
      message: "Success",
      data: data,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err,
    });
  }
});

router.post("/payment", async (req, res) => {
  coreApi
    .charge(req.body)
    .then(chargeResponse => {
      let dataOrder = {
        dosenId: req.body.dosenId,
        name: req.body.name,
        responseMidtrans: chargeResponse,
      };
      Payment.create(dataOrder)
        .then(data => {
          res.json({
            status: true,
            message: "success",
            data: data,
          });
        })
        .catch(err => {
          res.json({
            status: false,
            message: err.message,
            data: [],
          });
        });
    })
    .catch(e => {
      res.json({
        status: false,
        message: e.message,
        data: [],
      });
    });
});

router.post("/notifikasi", function (req, res) {
  apiClient.transaction.notification(req.body).then(statusResponse => {
    let orderId = statusResponse.order_id;
    let transactionStatus = statusResponse.transaction_status;
    let fraudStatus = statusResponse.fraud_status;

    console.log(
      `Transaction notification received. Order ID: ${orderId}. Transaction status: ${transactionStatus}. Fraud status: ${fraudStatus}`
    );
    // Sample transactionStatus handling logic

    if (transactionStatus == "capture") {
      // capture only applies to card transaction, which you need to check for the fraudStatus
      if (fraudStatus == "challenge") {
        // TODO set transaction status on your databaase to 'challenge'
      } else if (fraudStatus == "accept") {
        // TODO set transaction status on your databaase to 'success'
      }
    } else if (transactionStatus == "settlement") {
      // TODO set transaction status on your databaase to 'success'
    } else if (transactionStatus == "deny") {
      // TODO you can ignore 'deny', because most of the time it allows payment retries
      // and later can become success
    } else if (transactionStatus == "cancel" || transactionStatus == "expire") {
      // TODO set transaction status on your databaase to 'failure'
    } else if (transactionStatus == "pending") {
      // TODO set transaction status on your databaase to 'pending' / waiting payment
    }
  });
});

module.exports = router;
