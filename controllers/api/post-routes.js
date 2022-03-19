const router = require("express").Router();
const { User, Post, Comment } = require("../../models");
const isLogin = require("../../utils/auth");

// get all posts
router.get("/", (req, res) => {
  Post.findAll({
    attributes: ["id", "content", "title", "created_at"],
    order: [["created_at", "DESC"]],
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
  }).then((posts) => {
    res.json(posts).catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
  });
});

// get single post

router.get("/:id", isLogin, (req, res) => {
  Post.findOne({
    where: {
      id: req.params.id,
    },
    attributes: ["id", "content", "title", "created_at"],
    include: [
      {
        model: User,
        attributes: ["usename"],
      },
    ],
  })
    .then((post) => {
      if (!post) {
        res.status(400).json({
          message: "No post found under this id",
        });
        return;
      }
      res.json(post);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// Creatr new Post

router.post("/", isLogin, (req, res) => {
  Post.create({
    title: req.body.title,
    content: req.body.conten,
    user_id: req.body.user_id,
  })
    .then((createdData) => res.json(createdData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// Update a Existing Post

router.put("/:id", isLogin, (req, res) => {
  Post.update(
    {
      title: req.body.title,
      content: req.body.content,
    },
    {
      where: {
        id: req.params.id,
      },
    }
  )
    .then((updateData) => {
      if (!updateData) {
        res.status(400).json({
          message: "No Post Found Under This ID",
        });
        return;
      }
      res.json(updateData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// Delete existing post

router.delete("/:id", isLogin, (req, res) => {
  Post.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((deleteData) => {
      if (!deleteData) {
        res.status(400).json({
          message: "No Post Found Under this ID",
        });
        return;
      }
      res.json(deleteData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;