const axios = require("axios");
const cheerio = require("cheerio");

// https://www.pornhub.org/view_video.php?viewkey=653515fea1a32

const baseUrl = "https://www.pornhub.org/";

// Function to fetch HTML and extract data
async function fetchVideos(url, options) {
  try {
    const response = await axios.get(url, options);
    const htmlString = response.data;
    const $ = cheerio.load(htmlString, {
      // Disable script execution to prevent DOM manipulation
      xmlMode: true,
      decodeEntities: true,
    });

    // Remove all script tags to prevent redirection caused by scripts
    $("script").remove();

    // Extract pagination details
    const paginationDetails = extractPaginationDetails($);

    // Extract video details
    const videoDetails = extractVideoDetails($);

    return {
      search: options.params.search,
      pagination: paginationDetails,
      data: {
        videoDetails,
      },
    };
  } catch (err) {
    console.error("Error fetching or parsing HTML:", err);
    return null;
  }
}

// Function to extract pagination details
function extractPaginationDetails($) {
  const paginationDetails = {
    currentPage: null,
    totalPages: null,
    prevPageUrl: null,
    nextPageUrl: null,
    pages: [],
  };

  // Extract current page number
  const currentPage = $(".page_current span").text().trim();
  paginationDetails.currentPage = parseInt(currentPage);

  // Extract total number of pages
  const lastPage = $(".page_number").last().find("a").text().trim();
  paginationDetails.totalPages = parseInt(lastPage);

  // Extract page URLs
  $(".page_number a").each((index, element) => {
    const pageNumber = $(element).text().trim();
    const pageUrl = $(element).attr("href");
    paginationDetails.pages.push({ pageNumber, pageUrl });
  });

  // Extract previous page URL
  const prevPageUrl = $(".page_previous a").attr("href");
  paginationDetails.prevPageUrl = prevPageUrl ? prevPageUrl.trim() : null;

  // Extract next page URL
  const nextPageUrl = $(".page_next a").attr("href");
  paginationDetails.nextPageUrl = nextPageUrl ? nextPageUrl.trim() : null;

  return paginationDetails;
}

// Function to extract video details
function extractVideoDetails($) {
  const videoDetailsList = [];

  // Select all <li> elements with class 'pcVideoListItem'
  $(".pcVideoListItem").each((index, element) => {
    const $element = $(element);

    // Extract data from current <li> element
    const id = $element.attr("data-video-id");
    const viewKey = $element.attr("data-video-vkey");
    const officialUrl = `${baseUrl}view_video.php?viewkey=${viewKey}`;
    const title = $element.find(".title a").attr("title");
    const thumbnail = $element.find(".js-linkVideoThumb img").attr("src");
    const duration = $element.find(".duration").text();
    const views = $element.find(".views var").text();
    const model = $element.find(".usernameWrap a").text();

    // Construct an object with extracted data and push to list
    const videoDetails = {
      id,
      viewKey,
      officialUrl,
      title,
      thumbnail,
      duration,
      views,
      model,
    };
    videoDetailsList.push(videoDetails);
  });

  return videoDetailsList;
}

module.exports = {
  fetchVideos,
};
