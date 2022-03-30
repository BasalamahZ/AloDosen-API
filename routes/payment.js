const router = require("express").Router();
const Payment = require("../Models/Payment");
const Dosen = require("../Models/Dosen");
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

router.get("/payment/history/:userId", async (req, res) => {
  try {
    let data = await Payment.find({ userId: req.params.userId }).populate({
      path: "dosenId",
      model: Dosen,
      select: { namaLengkap: 1, fakultas: 1, image: 1 },
    });
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

// router.post("/notifikasi", async (req, res) => {
//   try {
//     statusResponse = await coreApi.transaction.notification(req.body);
//     let orderId = statusResponse.order_id;
//     let responseMidtrans = statusResponse;
//     const data = await Payment.updateMany(
//       { responseMidtrans },
//       { id: orderId }
//     );
//     res.status(200).send({
//       success: true,
//       message: "Success",
//       data: data,
//     });
//   } catch (err) {
//     res.status(500).send({
//       success: false,
//       message: err,
//     });
//   }
// });

// router.put("/status/:order_id", function (req, res) {
//   coreApi.transaction.status(req.params.order_id).then(statusResponse => {
//     let orderId = statusResponse.order_id;
//     let responseMidtrans = statusResponse;
//     Payment.update({ responseMidtrans }, { id: orderId })
//       .then(() => {
//         res.status(200).send({
//           success: true,
//           message: "Success",
//           data: statusResponse,
//         });
//       })
//       .catch(err => {
//         res.status(500).send({
//           success: false,
//           message: err,
//         });
//       });
//   });
// });

router.post("/callback", async (req, res, next) => {
  try {
    coreApi.transaction.notification(req.body).then((statusResponse) => {
      let orderId = statusResponse.order_id;
      let transactionStatus = statusResponse.transaction_status;
      let fraudStatus = statusResponse.fraud_status;

      console.log(
        `Transaction notification received. Order ID: ${orderId}. Transaction status: ${transactionStatus}. Fraud status: ${fraudStatus}`
      );

      if (transactionStatus == "capture") {
        if (fraudStatus == "challenge") {
          Payment.create({
            order_id: orderId,
            total_amount: statusResponse.gross_amount,
            transaction_status: transactionStatus,
          }).catch((err) => {
            next(err);
          });
          console.log("challenge");
        } else if (fraudStatus == "accept") {
          Payment.create({
            order_id: orderId,
            total_amount: statusResponse.gross_amount,
            transaction_status: transactionStatus,
          }).catch((err) => {
            next(err);
          });
          console.log("success");
        }
      } else if (transactionStatus == "settlement") {
        Payment.create({
          order_id: orderId,
          total_amount: statusResponse.gross_amount,
          transaction_status: transactionStatus,
        }).catch((err) => {
          next(err);
        });
        console.log("success");
        console.log("success");
      } else if (
        transactionStatus == "cancel" ||
        transactionStatus == "deny" ||
        transactionStatus == "expire"
      ) {
        Payment.create({
          order_id: orderId,
          total_amount: statusResponse.gross_amount,
          transaction_status: transactionStatus,
        }).catch((err) => {
          next(err);
        });
        console.log("failure");
      } else if (transactionStatus == "pending") {
        Payment.create({
          order_id: orderId,
          total_amount: statusResponse.gross_amount,
          transaction_status: transactionStatus,
        }).catch((err) => {
          next(err);
        });
        console.log("pending");
      }
    });
    res.status(200).json({
      code: 200,
      status: "OK",
      data: null,
    });
  } catch (error) {
    next(err);
  }
});

router.delete("/payment/:order_id", async (req, res) => {
  try {
    await Payment.findOneAndDelete(req.params.order_id);
    res.status(200).send({
      success: true,
      message: "Payment Has Been Deleted!",
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err,
    });
  }
});

module.exports = router;
