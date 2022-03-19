const router = require("express").router();
const { Comment } = require("../../models");
const sequelize = require("../../config/connection");
const isLogin = require("../../utils/auth");

// Get all Comment

router.get("/", (req, res) => {
  Comment.findAll({
    attributes: ["id", "comment_text", "user_id", "post_id", "crearted_at"],
    order: [["created_at", "DESC"]],
  }).then((commentsData) => {
    res.json(commentsData).catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
  });
});
