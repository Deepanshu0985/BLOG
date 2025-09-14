//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
// import { connectionState } from 'connection-state';

// const connection = connectionState();

const homeStartingContent = "Welcome to my personal blog! Here, I share my thoughts and experiences on various topics, including personal growth, mindfulness, travel, and more. Join me on this journey of self-discovery and exploration.";
const aboutContent = "Welcome to my personal blog! Join me on a journey of self-discovery and exploration. I share my thoughts on personal growth, mindfulness, travel, and more.";
const contactContent = "Welcome to my blog's contact page! If you have any questions, feedback, or just want to say hi, please feel free to reach out to me. You can send me an email at deepanshuy098@gmail.com, or connect with me on Instagram _yours__deepanshu_.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
const rawpass = "@Deepu0895.."
const encpass = encodeURIComponent(rawpass);

const uri = `mongodb+srv://deepanshuy098:${encpass}@ac-onzqgew.vjdq2ie.mongodb.net/BLOG?retryWrites=true&w=majority`;
// mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connect(uri)
  .then(()=> console.log("mongoose connected"))
  .catch(err => console.error("mongoose connection error:", err));

// connection.addListener((state) => {
// 	console.log(`Your connection state has changed. You are now ${state}.`)
// })

const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);

app.get("/", async function (req, res) {
  try {
    const posts = await Post.find({});
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
    });
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).send("Error fetching posts");
  }
});


app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", async function (req, res) {
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });

  try {
    await post.save();         // returns a promise
    res.redirect("/");
  } catch (err) {
    console.error("Error saving post:", err);
    res.status(500).send("Error saving post");
  }
});


app.get("/posts/:postId", async function (req, res) {
  const requestedPostId = req.params.postId;

  try {
    const post = await Post.findOne({ _id: requestedPostId });
    if (!post) {
      return res.status(404).send("Post not found");
    }
    res.render("post", {
      title: post.title,
      content: post.content
    });
  } catch (err) {
    console.error("Error fetching post:", err);
    res.status(500).send("Error fetching post");
  }
});

app.get("/about", function (req, res) {
  res.render("about", { aboutContent: aboutContent });
});

app.get("/contact", function (req, res) {
  res.render("contact", { contactContent: contactContent });
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});

