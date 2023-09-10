const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

const User = require("../models/user");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "semwalsrishti02@gmail.com",
    pass: "hpzqzulxwtbdnvsq",
  },
});

exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    pageTitle: "Sign up",
    path: "/signup",
    errorMessage: req.flash("error"),
  });
};

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    pageTitle: "Login",
    path: "/login",
    errorMessage: req.flash("error"),
  });
};

exports.postSignup = async (req, res, next) => {
  const { name, email, password } = req.body;
  // const errors = validationResult(req);

  // if (!errors.isEmpty()) {
  //   console.log(errors);
  //   return res.render("auth/signup", {
  //     pageTitle: "Sign up",
  //     path: "/signup",
  //     errorMessage: errors.array()[0].msg,
  //   });
  // }

  //1) Check if the user already exists or not
  const user = await User.findOne({ email: email });
  if (user) {
    return res.status(409).json({ message: "User Already exists!!" });
  }

  //2) Encrypt the password of the user
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
    // console.log(hashedPassword);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  //3) Store the email and password in the database
  try {
    const users = await User.find();
    if (users.length == 0) {
      const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role: "admin",
      });
    } else {
      const user = await User.create({
        name,
        email: email,
        password: hashedPassword,
        role: "customer",
      });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  //4)Send an email to the user on successfull signup
  try {
    const mailSent = await transporter.sendMail({
      from: "srishtisemwal21@gmail.com",
      to: email,
      subject: "Signup Successful",
      html: "<h1>You have successfully Signed Up</h1>",
    });
    if (mailSent) {
      return res.status(200).json({ message: "successful" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.getReset = (req, res, next) => {
  res.render("auth/reset", {
    pageTitle: "Reset Password",
    path: "/login",
    errorMessage: req.flash("error"),
  });
};

exports.postReset = async (req, res, next) => {
  const email = req.body.email;
  //1) Chek Whether the email exists or not
  let user = await User.findOne({ email: email });
  if (!user) {
    req.flash("error", "You don't have an account with us");
    return res.redirect("/reset");
  }
  //2) Generate the random token
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return;
    }
    const token = buffer.toString("hex");
    //3) Set the token and expiration in user instance
    user.resetToken = token;
    user.resetTokenExpiration = Date.now() + 3600000;
    user
      .save()
      .then(() => {
        //4) Send mail to the user along with token
        return transporter.sendMail({
          from: "testmailforotp@gmail.com",
          to: email,
          subject: "Reset Password",
          html: `<h1>You have requested for Password Reset</h1>
          <p>Click on this <a href='http://localhost:3000/reset/${token}'>link</a> to update password</p>`,
        });
      })
      .then(() => {
        res.redirect("/reset");
      })
      .catch((err) => console.log(err));
  });
};

exports.getNewPassword = async (req, res, next) => {
  const token = req.params.token;
  const user = await User.findOne({
    resetToken: token,
    resetTokenExpiration: { $gt: Date.now() },
  });

  if (!user) {
    req.flash("error", "Session Timeout");
    return res.redirect("/reset");
  }

  res.render("auth/new-password", {
    pageTitle: "Update Password",
    path: "/login",
    token: token,
    userId: user._id,
    errorMessage: req.flash("error"),
  });
};

exports.postNewPassword = async (req, res, next) => {
  const { password, token, userId } = req.body;
  const user = await User.findOne({
    resetToken: token,
    resetTokenExpiration: { $gt: Date.now() },
  });

  if (!user) {
    req.flash("error", "Session Timeout");
    return res.redirect("/reset");
  }
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    console.log("unable to encrypt password");
    return next(err);
  }

  try {
    await User.findByIdAndUpdate(userId, {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiration: null,
    });
    res.redirect("/login");
  } catch (err) {
    console.log("unable to update password");
    return next(err);
  }
};

exports.postLogin = async (req, res, next) => {
  console.log(req.body);
  const { email, password } = req.body;
  //1) Check whether the email exists or not
  const user = await User.findOne({ email: email });
  if (!user) {
    return res.status(401).json({ message: "Invalid email or apssword" });
  }

  //2)To check the password is correct or not
  try {
    const doMatches = await bcrypt.compare(password, user.password);
    if (doMatches) {
      const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_KEY,
        {
          expiresIn: Date.now() + 3600000,
        }
      );
      res.status(200).json({ token: token, role: user.role });
    } else {
      return res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
};
