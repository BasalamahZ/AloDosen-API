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
        userId: req.body.userId,
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
  coreApi.transaction.notification(req.body).then(statusResponse => {
    let orderId = statusResponse.order_id;
    let responseMidtrans = statusResponse;
    Payment.updateMany({ responseMidtrans }, { id: orderId })
      .then(() => {
        res.json({
          status: true,
          pesan: "Berhasil Notifikasi",
          data: [],
        });
      })
      .catch(err => {
        res.status(500).json({
          status: false,
          pesan: "Gagal Notifikasi: " + err.message,
          data: [],
        });
      });
  });
});

module.exports = router;
