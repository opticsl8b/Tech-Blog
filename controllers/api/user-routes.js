const router = require("express").Router();
const { User, Post, Comment } = require("../../models");


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

router.get("/:id", (req, res) => {
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
      },{
        model: Post,
        attributes: ["title"],
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

//  Add user with login scenario

router.post("/", (req, res) => {
  User.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  }).then((createData) => {
    // create session before send the response back and express will save it via .save() method by default
    req.session.user_id = createData.id;
    req.session.username = createData.username;
    req.session.loggedIn = true;
    res.json(createData);
  });
});

router.post("/login", (req, res) => {
  User.findOne({
    where: { email: req.body.email },
  })
  .then((loginData) => {
    if (!loginData) {
      res.status(400).json({ message: "No User with that Email was found" });
      return;
    }
    // Verify user
    const isPassword = loginData.checkPassword(req.body.password);

    if (!isPassword) {
      res.status(400).json({ message: "Incorrect password!" });
      return;
    }

    req.session.user_id = loginData.id;
    req.session.username = loginData.username;
    req.session.loggedIn = true;

    res.json({ user: loginData, message: "Loggin successfully" });
  });
});

// update User
router.put("/:id", (req, res) => {
  User.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((updateData) => {
      if (!updateData) {
        res.status(400).json({ message: "No User found with this id" });
        return;
      }
      res.json(updateData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});


// delete user
router.delete("/:id",(req,res)=>{
    User.destroy({
        where:{
id:req.params.id,
        }
    }).then((dbUserData)=>{
        if(!dbUserData){
            res.status(400).json({message:"No User found with this id"});
return;
        }
        res.json(dbUserData);
    }).catch((err)=>{
        console.log(err);
        res.status(500).json(err);
    })
})

// log out
router.post("/logout",(req,res)=>{
    if(req.session.loggedIn){
        req.session.destroy(()=>{
            // 204 indicate request succeeded but user stays at current page
            res.status(204).end();
        })
    }else{
        res.status(404).end();
    }
})

module.exports = router;