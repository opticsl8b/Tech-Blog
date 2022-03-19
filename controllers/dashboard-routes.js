const router = require("express").Router();
const { Post, User, Comment } = require("../models");
const isLogin = require("../utils/auth");


// display all posts on dashboard main page
router.get("/",isLogin,(req,res)=>{
    Post.findAll({
        where:{
            user_id:req.session.user_id
        },
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
    }).then((postsData)=>{
        // create an array of posts from data
       // use plain true to retrive the data as a plain object
        const posts= postsData.map((post)=>post.get({plain:true}))
// send the objects to mvc engine on dashboard page
res.render("dashboard",{post,loggedIn:true})

    })
    .catch((err)=>{
        console.log(err);
        res.status(500).json(err)
    })


})

