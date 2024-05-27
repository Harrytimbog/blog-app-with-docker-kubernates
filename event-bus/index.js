const express = require("express");
const axios = require("axios");
const cors = require("cors");
const bodyParser = require("body-parser");
// const { randomBytes } = require("crypto");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const events = [];

// Routes
app.post("/events", async (req, res) => {
  const event = req.body;

  // Push every event we get into the event data store

  events.push(event);

  // axios.post("http://localhost:4000/events", event);
  // axios.post("http://localhost:4001/events", event);
  // axios.post("http://localhost:4002/events", event);
  try {
    await axios.post("http://post-clusterip-srv:4000/events", event);
  } catch (err) {
    console.error("Error posting to posts service:", err.message);
  }

  try {
    await axios.post("http://comments-srv:4001/events", event);
  } catch (err) {
    console.error("Error posting to comments service:", err.message);
  }

  try {
    await axios.post("http://query-srv:4002/events", event);
  } catch (err) {
    console.error("Error posting to query service:", err.message);
  }
  try {
    await axios.post("http://moderation-srv:4003/events", event);
  } catch (err) {
    console.error("Error posting to moderation service:", err.message);
  }

  res.send({ status: "OK" });
});

app.get("/events", (req, res) => {
  res.send(events);
});

app.listen(5000, () => {
  console.log("Listening on 5000");
});
