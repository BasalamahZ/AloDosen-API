const router = require("express").Router();
const Payment = require("../Models/Payment");
const midtransClient = require("midtrans-client");
// Create Core API instance
let coreApi = new midtransClient.CoreApi({
  isProduction: false,
  serverKey: "SB-Mid-server-KJhF1EBlbLFpuVHflMr2DxTm",
  clientKey: "SB-Mid-client-dyrxC4AokmQVl_8E",
});
router.get("/", async (req, res) => {
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

// router.post("/payment", async (req, res) => {
//   try {
//     const chargeResponse = await coreApi.charge(req.body);
//     res.status(200).send({
//       success: true,
//       message: "Success",
//       chargeResponse: JSON.stringify(chargeResponse),
//     });
//   } catch (err) {
//     res.status(500).send({
//       success: false,
//       message: err,
//     });
//   }
// });

// router.post("/", async (req, res) => {
//   const newPayment = new Payment(req.body);
//   try {
//     const chargeResponse = await coreApi.charge({
//       dosenId: req.body.dosenId,
//       nama: req.body.nama,
//       responseMidtrans: JSON.stringify(chargeResponse),
//     })
//     const savedPayment = await newPayment.save();
//     res.status(200).send({
//       success: true,
//       message: "Success",
//       data: savedPayment,
//     });
//   } catch (err) {
//     res.status(500).send({
//       success: false,
//       message: err,
//     });
//   }
// });
router.post("/", function (req, res, next) {
  coreApi
    .charge(req.body)
    .then(chargeResponse => {
      let dataOrder = {
        dosenId: req.body.dosenId,
        name: req.body.name,
        responseMidtrans: JSON.stringify(chargeResponse),
      };
      Payment.create(dataOrder)
        .then(data => {
          res.json({
            status: true,
            pesan: "Berhasil Order",
            data: data,
          });
        })
        .catch(err => {
          res.json({
            status: false,
            pesan: "Gagal Order: " + err.message,
            data: [],
          });
        });
    })
    .catch(e => {
      res.json({
        status: false,
        pesan: "Gagal order: " + e.message,
        data: [],
      });
    });
});

module.exports = router;
