const router = require("express").Router();
const User = require("../Models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");

// Register
router.post(
  "/register",
  [
    check("password", "password length should more than 6 characters").isLength(
      { min: 6, max: 256 }
    ),
    check("phoneNumber", "Mobile number should contains 11-13 digits").isLength(
      { min: 11, max: 13 }
    ),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      const salt = await bcrypt.genSalt(10);
      const hashedPass = await bcrypt.hash(req.body.password, salt);
      const newUser = new User({
        fullname: req.body.fullname,
        phoneNumber: req.body.phoneNumber,
        email: req.body.email,
        password: hashedPass,
      });
      if (!errors.isEmpty()) {
        res.status(400).send({
          success: false,
          message: errors,
        });
      } else {
        const user = await newUser.save();
        res.status(200).send({
          success: true,
          message: "success",
          data: {
            id: user._id,
          },
        });
      }
    } catch (err) {
      res.status(500).send({
        success: false,
        message: err,
      });
    }
  }
);

// Login
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    !user &&
      res.status(400).send({
        success: false,
        message: "Something Wrong",
      });

    const validate = await bcrypt.compare(req.body.password, user.password);
    !validate &&
      res.status(400).send({
        success: false,
        message: "Something Wrong",
      });

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT,
      { expiresIn: "3d" }
    );
    res.status(200).send({
      success: true,
      message: "success",
      data: {
        id: user._id,
        accessToken: token,
      },
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err,
    });
  }
});

module.exports = router;
