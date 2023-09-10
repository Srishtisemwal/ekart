const { validationResult } = require("express-validator");
const fs = require("fs/promises");
const Product = require("../models/product");
const { fileDeleteHandler } = require("../util/file-delete");

exports.postAddProduct = async (req, res, next) => {
  const { title, price, description } = req.body;
  // const errors = validationResult(req);
  console.log(req.body);
  console.log(req.file);

  try {
    await Product.create({
      title,
      price,
      imageUrl: req.file.path,
      description,
    });
    res.status(201).json({ message: "Product added succesfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.find();
    res.status(200).json({ data: products });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateProduct = async (req, res, next) => {
  const { title, price, imageUrl, description } = req.body;
  const prodId = req.params.prodId;

  try {
    const filePath = await Product.findById(prodId).select({
      imageUrl: 1,
      _id: 0,
    });
    if (req.file) {
      const isFileDeleted = await fileDeleteHandler(filePath.imageUrl);
      if (!isFileDeleted) {
        return res.status(400).json({ message: "File Not Found" });
      }
    }
    const product = await Product.findByIdAndUpdate(prodId, {
      title,
      price,
      imageUrl: req.file ? req.file.path : filePath.imageUrl,
      description,
    });
    res.status(200).json({ product: product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getEditProduct = async (req, res, next) => {
  const id = req.params.id;
  const editable = req.query.edit;
  try {
    const product = await Product.findById(id);
    res.render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/add-product",
      product: product,
      editable: editable,
      errorMessage: req.flash("error"),
    });
  } catch (err) {
    console.log(err.message);
  }
};

exports.postEditProduct = async (req, res, next) => {
  const { title, price, description, id } = req.body;
  const product = await Product.findById(id);

  if (req.file) {
    try {
      await fs.unlink(product.imageUrl);
    } catch (err) {
      console.log("error deleting file" + err.message);
    }
  }

  try {
    await Product.findByIdAndUpdate(id, {
      title,
      price,
      imageUrl: req.file ? req.file.path : product.imageUrl,
      description,
    });
    res.redirect("/admin/products");
  } catch (err) {
    console.log("error deleting file" + err.message);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const filePath = await Product.findById(req.params.prodId).select({
      imageUrl: 1,
      _id: 0,
    });
    const isFileDeleted = await fileDeleteHandler(filePath.imageUrl);
    if (isFileDeleted) {
      const product = await Product.findByIdAndDelete(req.params.prodId);
      res.status(200).json({ product: product });
    } else {
      return res.status(400).json({ message: "file Not Found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
