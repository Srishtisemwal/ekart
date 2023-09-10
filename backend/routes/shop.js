const express = require("express");

const {
  getLatestProducts,

  getCart,
  getProduct,
  addToCart,
  updateCart,
  deleteItemFromCart,
  getCheckout,
  getAddress,
  addAddress,
  postCheckout,
  orders,
  getCheckoutCancel,
  getCheckoutSuccess,
  deleteOrderHistory,
  getOrderInvoice,
  getSingleProduct,
} = require("../controllers/shop");

const router = express.Router();

const isAuth = require("../middlewares/is-Auth");

router.get("/get-product/:prodId", getSingleProduct);

router.get("/latest-products", getLatestProducts);

router.get("/getProduct/:id", getProduct);

router.get("/cart",isAuth, getCart);

router.patch("/cart/:productID",isAuth, addToCart);

router.patch("/updateCart",isAuth, updateCart);

router.delete("/cart/:productID",isAuth, deleteItemFromCart);

router.get("/checkout", isAuth, getCheckout);

router.get("/address", getAddress);

router.post("/addAddress", isAuth, addAddress);

router.post("/checkout", isAuth, postCheckout);

router.get("/checkout/success", isAuth, getCheckoutSuccess);

router.get("/checkout/cancel", isAuth, getCheckoutCancel);

router.get("/orders", orders);

router.post("/delete_order_history", deleteOrderHistory);

router.get("/orders/:orderId", isAuth, getOrderInvoice);

module.exports = router;
