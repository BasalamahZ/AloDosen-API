const router = require("express").Router();
const Payment = require("../Models/Payment");
const Dosen = require("../Models/Dosen");
const midtransClient = require("midtrans-client");

let coreApi = new midtransClient.CoreApi({
  isProduction: false,
  serverKey: "SB-Mid-server-KJhF1EBlbLFpuVHflMr2DxTm",
  clientKey: "SB-Mid-client-dyrxC4AokmQVl_8E",
});

router.get("/payment", async (req, res) => {
  try {
    const data = await Payment.find();
    let tampilData = data.map(item=>{
      return {
      id:item._id,
      userId:item.userId,
      dosenId:item.dosenId,
      responseMidtrans:JSON.parse(item.responseMidtrans),
      createdAt:item.createdAt,
      updatedAt:item.updatedAt
      }
      });
    res.status(200).send({
      success: true,
      message: "Success",
      data: tampilData,
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
    let tampilData = data.map(item=>{
      return {
      id:item._id,
      userId:item.userId,
      dosenId:item.dosenId,
      responseMidtrans:JSON.parse(item.responseMidtrans),
      createdAt:item.createdAt,
      updatedAt:item.updatedAt
      }
      });
    res.status(200).send({
      success: true,
      message: "Success",
      data: tampilData,
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
      responseMidtrans: JSON.stringify(chargeResponse),
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
    statusResponse = await coreApi.transaction.notification(req.body);
    let orderId = statusResponse.order_id;
    let responseMidtrans = JSON.stringify(statusResponse);;
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

router.post("/status/:order_id", function (req, res) {
  coreApi.transaction.status(req.params.order_id).then(statusResponse => {
    let responseMidtrans = JSON.stringify(statusResponse);;
    console.log(responseMidtrans);
    Payment.updateMany({ id: req.body.order_id },{ 
      dosenId: req.body.dosenId,
      userId: req.body.userId,
      responseMidtrans: responseMidtrans,
    })
      .then(() => {
        res.status(200).send({
          success: true,
          message: "Success",
          data: statusResponse,
        });
      })
      .catch(err => {
        res.status(500).send({
          success: false,
          message: err,
        });
      });
  });
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
