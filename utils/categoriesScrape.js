const axios = require("axios");
const cheerio = require("cheerio");

const baseUrl = "https://www.pornhub.org";

async function fetchCategories(url) {
  try {
    const response = await axios.get(url);
    const htmlString = response.data;
    const $ = cheerio.load(htmlString, {
      // Disable script execution to prevent DOM manipulation
      xmlMode: true,
      decodeEntities: true,
    });

    // Remove all script tags to prevent redirection caused by scripts
    $("script").remove();

    // Extract categories
    const categories = extractCategoriesDetails($);
    return categories;
  } catch (err) {
    console.error("Error fetching or parsing HTML:", err);
    return null;
  }
}

function extractCategoriesDetails($) {
  const categories = [];
  $(".catPic").each((index, element) => {
    const id = $(element).attr("data-category");
    const type = $(element).find("a").attr("alt");
    const officialUrl = baseUrl + $(element).find("a").attr("href");
    const thumbnail = $(element).find("img").attr("src");
    const endpoint = `/videos/${type.toLowerCase()}`;

    const category = {
      id,
      type,
      officialUrl,
      thumbnail,
      endpoint,
    };

    categories.push(category);
  });
  return categories;
}

module.exports = { fetchCategories };
