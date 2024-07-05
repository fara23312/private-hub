const express = require("express");
const router = express.Router();
const { fetchCategories } = require("../utils/categoriesScrape");

const baseUrl = "https://www.pornhub.org/";
const url = `${baseUrl}categories`;

router.get("/", async (req, res) => {
  let fetchedCategories = await fetchCategories(url);
  let total = fetchedCategories.length;
  res.json({ total, categories: fetchedCategories });
});

router.get("/:category", async (req, res) => {
  let { category } = req.params;
  res.redirect(`/videos/${category}`);
});

module.exports = router;
