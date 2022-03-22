const router = require("express").Router();
const Dosen = require("../Models/Dosen");

// get all dosen
router.get("/", async (req, res) => {
  try {
    const data = await Dosen.find();
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
module.exports = router;
