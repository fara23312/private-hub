const cheerio = require("cheerio");
function trimScriptTags(htmlString) {
 // Load HTML string into cheerio
 const $ = cheerio.load(htmlString);

 // Select all <script> elements inside <body>
 $('body script').remove();

 // Return the modified HTML
 return $.html();
}

module.exports = trimScriptTags;
