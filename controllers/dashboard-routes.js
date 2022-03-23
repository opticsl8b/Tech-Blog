const router = require("express").Router();
const { Post, User, Comment } = require("../models");
const isLogin = require("../utils/auth");
const sequelize = require('../config/connection');

// display all posts on dashboard main page
router.get("/", isLogin, (req, res) => {
  console.log("====================================");
  Post.findAll({
    where: {
      user_id: req.session.user_id,
    },
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
    .then((postsData) => {
      // create an array of posts from data
      // use plain true to retrive the data as a plain object
      const posts = postsData.map((post) => post.get({ plain: true }));
      // send the objects to mvc engine on dashboard page
      res.render("dashboard", { posts, loggedIn: true });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// endpoint to edit page
router.get("/edit/:id", isLogin, (req, res) => {
  Post.findOne({
    where: {
      id: req.params.id,
    },
    attributes: ["id", "content", "title", "created_at"],
    include: [
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
      res.render("edit-post", { post, loggedIn: true });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// endpoint to create post page
router.get("/add",isLogin,(req,res)=>{
    res.render("create-post",{loggedIn:true})
})

module.exports=router;