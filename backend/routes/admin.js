const express = require("express");
const { body, check } = require("express-validator");
const router = express.Router();

const {
  postAddProduct,
  deleteProduct,
  getProducts,
  getSingleProduct,
  updateProduct,
} = require("../controllers/admin");
const isAuth = require("../middlewares/is-Auth");
const upload = require("../middlewares/file-upload");
const product = require("../models/product");
const { getProduct } = require("../controllers/shop");

// router.use((req, res, next) => {
//   if (req.session.role !== "admin") {
//     return res.redirect("/");
//   }
//   next();
// });

// router.get("/add-product", isAuth, getAddProduct);

// router.get("/products", isAuth, getProducts);

router.post("/add-product", upload.single("imageUrl"), postAddProduct);

router.get("/get-products", isAuth, getProducts);

router.put(
  "/update-product/:prodId",
  isAuth,
  upload.single("imageUrl"),
  updateProduct
);

router.delete("/delete-product/:prodId", isAuth, deleteProduct);

// router.get("/edit-product/:id", isAuth, getEditProduct);

// router.post(
//   "/edit-product",
//   isAuth,
//   upload.single("imageUrl"),
//   postEditProduct
// );

module.exports = router;
