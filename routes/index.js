const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    status: 200,
    endpoints: [
      {
        method: "GET",
        path: "/videos",
        endpoints: [
          {
            method: "GET",
            path: "/videos/search",
            description: "Search for videos by keyword",
            params: {
              search: "keyword to search for",
            },
          },
        ],
      },
    ],
  });
});

module.exports = router;
