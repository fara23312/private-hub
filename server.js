require("dotenv").config(); // Load environment variables from a .env file
const express = require("express");
const axios = require("axios");
const app = express();
const trimScriptTags = require("./utils/trimScriptTags");
const port = 3000;

app.set("view engine", "ejs");

// Endpoint to display homepage
app.get("/", (req, res) => {
  res.send("Welcome to the Pornhub API");
});

// Endpoint to fetch porn
const url = `https://www.pornhub.org/video/search_autocomplete?pornstars=true&token=${token}&orientation=straight&q=brazzers&alt=0`;
const category = "https://www.pornhub.org/categories/";

// Endpoint to fetch videos
app.get("/videos/categories", async (req, res) => {
  const token = process.env.PORNHUB_TOKEN; // Use environment variables for token and cookie
  const cookie = process.env.PORNHUB_COOKIE;
  // console.log(token, cookie);


  const options = {
    headers: {
      Cookie: cookie,
    },
  };

  try {
    const response = await axios.get(category, options);
    res.send(trimScriptTags(response.data))
  } catch (error) {
    console.error("Error fetching videos:", error);
    res.status(500).send("Error fetching videos");
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
