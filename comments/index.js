const express = require("express");
const cors = require("cors");
const axios = require("axios");
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto");

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Fake comments

const commentsByPostId = {};

app.get("/posts/:id/comments", (req, res) => {
  res.send(commentsByPostId[req.params.id] || []);
});

app.post("/posts/:id/comments", async (req, res) => {
  // Generate a new Id
  const commentId = randomBytes(4).toString("hex");

  const { content } = req.body;

  // Comments will either be an array or undefined. (return an empty array instead of undefined to prevent error)
  const comments = commentsByPostId[req.params.id] || [];
  comments.push({ id: commentId, content, status: "pending" });

  commentsByPostId[req.params.id] = comments;

  // Emit Event
  try {
    await axios.post("http://127.0.0.1:5000/events", {
      type: "CommentCreated",
      data: {
        id: commentId,
        content,
        postId: req.params.id,
        status: "pending",
      },
    });
    console.log("Event sent to event-bus");
  } catch (err) {
    console.error("Error posting to event-bus:", err.message);
  }

  res.status(201).send(comments);
});

// Event handler
app.post("/events", async (req, res) => {
  console.log("Event Received:", req.body.type);
  // Handle CommentModerated

  if (type === "CommentModerated") {
    const { id, status, postId, content } = data;
    const comments = commentsByPostId[postId];
    const comment = comments.find((comment) => {
      return comment.id === id;
    });

    // set the new status value
    comment.status = status;

    // Not inserting the object back into the array after status is updated because this is already the object in memory
    // Emit updated event

    await axios.post("http://127.0.0.1:5000/events", {
      type: "CommentUpdated",
      data: {
        id,
        status,
        postId,
        content,
      },
    });
  }
  res.send({});
});

app.listen(4001, () => {
  console.log("Listening on 4001");
});
