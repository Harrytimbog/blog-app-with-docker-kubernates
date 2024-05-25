const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/events", (req, res) => {
  const { type, data } = req.body;

  if (type === "PostCreated") {
    const { id, title } = data;
    posts[id] = { id, title, comments: [] };
  }
  if (type === "CommentCreated") {
    const { id, content, postId } = data;

    const post = posts[postId];
    post.comments.push({ id, content });
  }
  console.log(posts);
  res.send({});
});

app.listen(4002, () => {
  console.log("Listening on 4002");
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
