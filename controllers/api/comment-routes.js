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


// Create Comment

router.post("/",isLogin,(req,res)=>{
    Comment.create({
        comment_text:req.body.comment_text,
        user_id:req.body.user_id,
        post_id:req.body.post_id,
    }).then((createDate)=>res.json(createDate))
    .catch((err)=>{
        console.log(err);
        res.status(500).json(err);
    })
})

// Delete Comment

router.delete("/:id",isLogin,(req,res)=>{
    Comment.destroy({
        where:{
            id:req.params.id,
        }
    }).then((destroyData)=>{
        if(!destroyData){
            res.status(400).json({
                message:"No Comment Found Under This Id"
            });
            return;
        }res.json(destroyData)
    }).catch((err)=>{
        console.log(err);
        res.status(500).json(err)
    })
})

module.exports = router;