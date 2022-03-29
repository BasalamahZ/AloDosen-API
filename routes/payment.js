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
  try {
    chargeResponse = await coreApi.charge(req.body);
    let dataOrder = {
      dosenId: req.body.dosenId,
      userId: req.body.userId,
      responseMidtrans: chargeResponse,
    };
    const data = await Payment.create(dataOrder);
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

router.post("/notifikasi", async (req, res) => {
  try {
    statusResponse = coreApi.transaction.notification(req.body);
    let orderId = statusResponse.order_id;
    let responseMidtrans = statusResponse;
    const data = await Payment.updateMany(
      { responseMidtrans },
      { id: orderId }
    );
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

router.post("/status/:order_id", async (req, res) => {
  try {
    statusResponse = coreApi.transaction.notification(req.params.order_id);
    let responseMidtrans = statusResponse;
    const data = await Payment.updateMany({ responseMidtrans }, { id: req.params.order_id })
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

// router.get("/status/:order_id", function (req, res, next) {
//   coreApi.transaction.status(req.params.order_id).then(statusResponse => {
//     let responseMidtrans = statusResponse;
//     Payment.updateMany({ responseMidtrans }, { id: req.params.order_id })
//       .then(() => {
//         res.json({
//           status: true,
//           pesan: "Berhasil cek status",
//           data: statusResponse,
//         });
//       })
//       .catch(err => {
//         res.json({
//           status: false,
//           pesan: "Gagal cek status: " + err.message,
//           data: [],
//         });
//       });
//   });
// });

module.exports = router;
