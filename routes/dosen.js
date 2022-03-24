const router = require("express").Router();
const Dosen = require("../Models/Dosen");

// get all dosen
// router.get("/", async (req, res) => {
//   try {
//     const data = await Dosen.find();
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

// get spesific dosen
router.get("/:id", async (req, res) => {
  try {
    const data = await Dosen.findById(req.params.id);
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

// post dosen
router.post("/", async (req, res) => {
  try {
    const data = new Dosen(req.body);
    const newData = await data.save();
    res.status(200).send(newData);
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err,
    });
  }
});

// get dosen by name or location
router.get("/", async (req, res) => {
  const namaLengkap = req.query.name;
  const lokasi = req.query.loc;
  try {
    let data;
    if (namaLengkap) {
      data = await Dosen.find({
        "namaLengkap": {
          "$regex": namaLengkap,
          "$options": "i",
        },
      });
    } else if (lokasi) {
      data = await Dosen.find({
        "lokasi": {
          "$regex": lokasi,
          "$options": "i",
        },
      });
    } else {
      data = await Dosen.find();
    }
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
module.exports = router;
