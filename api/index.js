require("dotenv").config(); // Load environment variables from a .env file
const express = require("express");
const path = require("path");
const app = express();
const port = 3000;

const videosRouter = require("../routes/videosRouter");
const categoriesRouter = require("../routes/categoriesRouter");

app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.set(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");

// Endpoint to display homepage
app.use("/", require("../routes"));
app.use("/videos", videosRouter);
app.use("/categories", categoriesRouter);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
