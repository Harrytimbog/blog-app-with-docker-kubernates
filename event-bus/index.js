const express = require("express");
const axios = require("axios");
const cors = require("cors");
const bodyParser = require("body-parser");
// const { randomBytes } = require("crypto");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Routes
app.post("/events", async (req, res) => {
  const event = req.body;

  // axios.post("http://localhost:4000/events", event);
  // axios.post("http://localhost:4001/events", event);
  // axios.post("http://localhost:4002/events", event);
  try {
    await axios.post("http://127.0.0.1:4000/events", event);
  } catch (err) {
    console.error("Error posting to posts service:", err.message);
  }

  try {
    await axios.post("http://127.0.0.1:4001/events", event);
  } catch (err) {
    console.error("Error posting to comments service:", err.message);
  }

  try {
    await axios.post("http://127.0.0.1:4002/events", event);
  } catch (err) {
    console.error("Error posting to another service:", err.message);
  }

  res.send({ status: "OK" });
});

app.listen(5000, () => {
  console.log("Listening on 5000");
});
