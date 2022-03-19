// file that manages API path-route

const router=require("express").Router();
const userRoutes=require("./user-routes")
const postRoutes=require("./post-routes")
const commentRoutes=require("./comment-routes")
const sessionRoutes=require("./session-routes")


router.use("/users",userRoutes)
router.use("/posts",postRoutes)
router.use("/comments",commentRoutes)
router.use("/session",sessionRoutes)

module.exports=router;