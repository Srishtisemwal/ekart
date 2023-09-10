const express = require("express");

const {
  getLogin,
  getSignup,
  getReset,
  getNewPassword,
  postLogin,
  postLogout,
  postSignup,
  postReset,
  postNewPassword,
} = require("../controllers/auth");

const { body, check } = require("express-validator");

const router = express.Router();

router.post(
  "/signup",
  // [
  //   check("email").notEmpty().isEmail().withMessage("Invalid Email-Id"),
  //   body("password", "Invalid Password").matches(
  //     /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[$#@]).{8,24}$/
  //   ),
  //   body("confirmPassword").custom((value, { req }) => {
  //     if (value !== req.body.password) {
  //       throw new Error("Passwords do not match");
  //     }
  //     return true;
  //   }),
  // ],
  postSignup
);

router.get("/login", getLogin);

router.post("/login", postLogin);

router.post("/logout", postLogout);

router.get("/signup", getSignup);

router.get("/reset", getReset);

router.post("/reset", postReset);

router.get("/reset/:token", getNewPassword);

router.post("/new-password", postNewPassword);

module.exports = router;
