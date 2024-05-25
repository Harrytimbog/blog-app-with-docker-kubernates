const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

const handleEvent = (type, data) => {
  if (type === "PostCreated") {
    const { id, title } = data;
    posts[id] = { id, title, comments: [] };
  }
  if (type === "CommentCreated") {
    const { id, content, postId, status } = data;

    const post = posts[postId];
    post.comments.push({ id, content, status });
  }

  // CommentUpdated Event

  if (type === "CommentUpdated") {
    const { id, content, postId, status } = data;
    const post = posts[postId];
    const comment = post.comments.find((comment) => {
      return comment.id == id;
    });

    comment.status = status;
    comment.content = content;
  }
};

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/events", (req, res) => {
  const { type, data } = req.body;
  handleEvent(type, data);
  // console.log(posts);
  res.send({});
});

app.listen(4002, async () => {
  console.log("Listening on 4002");

  // fetch events
  const res = await axios("http://localhost:5000/events");

  for (let event of res.data) {
    console.log("Processing event:", event.type);

    handleEvent(event.type, event.data);
  }
});

// data example
// posts ===
//   {
//     j123j22: {
//       id: "j123j22",
//       title: "post title",
//       comments: [{ id: "kididi", content: "comment!" }],
//     },
//     js3344l: {
//       id: "js3344l",
//       title: "post title",
//       comments: [{ id: "kiyey55", content: "comment!" }],
//     },
//   };
