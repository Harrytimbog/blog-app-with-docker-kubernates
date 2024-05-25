const express = require("express");
const cors = require("cors");
const axios = require("axios");
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/posts", async (req, res) => {
  const id = randomBytes(4).toString("hex");
  const { title } = req.body;

  posts[id] = { id, title };

  // emit an event

  try {
    await axios.post("http://127.0.0.1:5000/events", {
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

app.listen(4000, () => {
  console.log("Listening on 4000");
});
