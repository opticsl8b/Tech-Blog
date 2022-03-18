const router = require("express").Router();
const { User, Post, Comment } = require("../../models");
const { create } = require("../../models/User");
const { post } = require("./session-routes");

// GET /api/users
router.get("/", (req, res) => {
  User.findAll({
    attributes: { exclude: ["password"] },
  })
    .then((users) => res.json(users))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// GET specific user by id

router.get("/", (req, res) => {
  User.findOne({
    attributes: { exclude: ["password"] },
    where: {
      id: req.params.id,
    },
    include: [
      {
        model: Post,
        attributes: ["id", "title", "content", "created_at"],
      },
      {
        model: Comment,
        attributes: ["id", "comment_text", "created_at"],
        include: {
          model: Post,
          attributes: ["title"],
        },
      },
    ],
  })
    .then((user) => {
      if (!user) {
        res.status(404).json({ message: "No User Found With This ID" });
        return;
      }
      res.json(user);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

//  Add user

router.post("/",(req,res)=>{
User.create({
    username:req.body.username,
    email:req.body.email,
    password:req.body.password,
}).then((createData)=>{
    // create session before send the response back and express will save it via .save() method by default
    req.session.user_id=createData.id;
    req.session.username=createData.username;
    req.session.loggedIn=true;
    res.json(createData);
})
})