const express = require("express");
const router = express.Router();
const { fetchData } = require("../utils/videosScrape");

const baseUrl = "https://www.pornhub.org/";
const url = `${baseUrl}video/search`;

router.get("/", async (req, res) => {
  res.json({
    status: 200,
    message: "This route root path itself don't matter",
    endpoints: [
      {
        search: {
          method: "GET",
          path: "/videos/search",
          description: "Search for videos by keyword",
          params: {
            search: "keyword to search for",
          },
        },
      },
    ],
  });
});

router.get("/search", async (req, res) => {
  let { search } = req.query;
  if (!search)
    return res.json({
      status: 400,
      message: " [ search ] query is required",
      example: "/videos/search?search=mia%20khalifa",
      forNewbiies: "%20 is provided for space between words",
    });
  let options = {
    params: { search },
  };
  let scrapedData = await fetchData(url, options);

  res.send(scrapedData);
});

module.exports = router;
