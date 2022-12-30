const { Curl, Scraper } = require("./dist");
const curl = new Curl();
const scraper = new Scraper(curl);
const express = require("express");
const app = express();
const axios = require("axios");

app.get("/test", async (req, res) => {
  try {
    console.log("yes");
    const { data } = await scraper.get("https://zingmp3.vn/");
    res.send(data);
  } catch (err) {
    res.send(err.toString());
  }
});

app.listen(4444, () => {
  console.log("started");
});

setInterval(async () => {
  try {
    await axios.get("http://localhost:4444/test", {
      url: "https://zingmp3.vn/",
    });
    console.log("good");
  } catch (err) {
    console.log(err);
  }
}, 0);
