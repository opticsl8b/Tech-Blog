const router = require("express").Router();
const{User,Post,Comment}=require("../../models");
const isLogin= require("../../utils/auth");

router.get("/",(req,res)=>{
Post.findAll({
    attributes:["id","content","title","created_at"],
    order:[["created_at","DESC"]],
    include:[
        {
            model:Comment,
            attributes:["id","comment_text","post_id","user_id","created_at"],
            include:{
                model:User,
                attributes:["username"],
            },

        },{
            model:User,
            attributes:["username"],
        }
    ]
}).then((posts)=>{
    res.json(posts)
    .catch((err)=>{
        console.log(err);
        res.status(500).json(err)
    })
})

})
