// User facing Routes -HomePage & Login page

const sequelize = require("sequelize");
const { User, Post, Comment } = require("../models");
const router = require("express").Router();

// homepage endpoint
router.get("/", (req, res) => {
  Post.findAll({
    attribute: ["id", "content", "title", "created_at"],
    include: [
      {
        model: Comment,
        attributes: ["id", "comment_text", "post_id", "user_id", "created_at"],
        include: {
          model: User,
          attribute: ["username"],
        },
      },
      {
        model: User,
        attributes: ["username"],
      },
    ],
  })
    .then((postData) => {
      // create an array of posts from data
      // use plain true to retrive the data as a plain object
      const posts = postData.map((post) => post.get({ plain: true }));
      // send the objects to mvc engine on homepage page
      res.render("homepage", { posts, loggedIn: req.session.loggedIn });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// login endpoint
router.get("/login", (req, res) => {
  // check  session and redirect to the homepage if exists
  if (req.session.loggedIn) {
    res.redirect("/");
    return;
  }
  res.render("login");
});

// signup endpoint
router.get("/signup", (req, res) => {
  // check session and redirect to the homepage if exists
  if (req.session.loggedIn) {
    res.redirect("/");
    return;
  }
  res.render("signup");
});

// endpoint for looking up post

router.get("/post/:id", (req, res) => {
  Post.findOne({
    where: { id: req.params.id },
    attributes: ["id", "content", "title", "created_at"],
    include: [
      {
        model: Comment,
        attributes: ["id", "comment_text", "post_id", "user_id", "created_at"],
        include: {
          model: User,
          attributes: ["username"],
        },
      },
      {
        model: User,
        attributes: ["username"],
      },
    ],
  })
    .then((postData) => {
      if (!postData) {
        res.status(400).json({
          message: "No Post Found Under This ID",
        });
        return;
      }

      const post = postData.get({ plain: true });

      // send data to template
      res.render("single-post", {
        post,
        loggedIn: req.session.loggedIn,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;
