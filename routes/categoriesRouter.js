const express = require("express");
const router = express.Router();
const { fetchCategories } = require("../utils/categoriesScrape");

const baseUrl = "https://www.pornhub.org/";
const url = `${baseUrl}categories`;

router.get("/", async (req, res) => {
  let fetchedCategories = await fetchCategories(url);
  res.send(fetchedCategories);
});

router.get("/:category", async (req, res) => {
  res.send({ category: req.params.category });
});

module.exports = router;
