const router = require("express").Router();
// collecting endpoints for homepage, dashboard, and API
const homeRoutes = require("./home-routes.js");
const dashboardRoutes = require("./dashboard-routes.js");
const apiRoutes = require("./api");

// relationshiping the path-routes
router.use("/api", apiRoutes);
router.use("/", homeRoutes);
router.use("/dashboard", dashboardRoutes);

// safety guard responding requested path doesnt exist with 404
router.use((req, res) => {
  res.status(404).json({ message: "Incorrect Route Provide" }).end();
});

module.exports = router;
