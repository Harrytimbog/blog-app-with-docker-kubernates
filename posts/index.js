const express = require("express");
const cors = require("cors");
const axios = require("axios");
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

// This get request below is only needed b4 we created our query services. I left iut for testing purpose only
app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/posts/create", async (req, res) => {
  const id = randomBytes(4).toString("hex");
  const { title } = req.body;

  posts[id] = { id, title };

  // emit an event

  try {
    await axios.post("http://event-bus-srv:5000/events", {
      type: "PostCreated",
      data: {
        id,
        title,
      },
    });
    console.log("Event sent to event-bus");
  } catch (err) {
    console.error("Error posting to event-bus:", err.message);
  }

  res.status(201).send(posts[id]);
});

// Event handler
app.post("/events", (req, res) => {
  console.log("Received Event:", req.body.type);

  res.send({});
});

app.listen(4000, () => {
  console.log("Listening on 4000");
});
