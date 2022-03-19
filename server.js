// import library modules
const path = require("path");
const express = require("express");
const exphbs = require("express-handlebars");
const session = require("express-session");

// const helpers = require("./utils/helpers");

const routes = require("./controllers");
const sequelize = require("./config/connection");

const hbs = exphbs.create();
const SequelStore = require("connect-session-sequelize")(session.Store);

const sess = {
  secret: "extreme secret",
  resave: true,
  saveUninitialized: true,
  rolling: true, // extend express-session to maxAge when user sent new request to the server
  store: new SequelStore({ db: sequelize }),
  cookie: {
    maxAge: 120000, // 2 mins
  },
};

const app = express();
const PORT = process.env.PORT || 3001;

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session(sess));
app.use(express.static(path.join(__dirname, "public")));

//turn the routes on
app.use(routes);

// enable Handlebar.js as template engine
app.engine("handlebars", hbs.engine);
app.set("veiw engine", "handlebars");

// sync part means models are handled by sequelize
// set force to false to prevent it drop and re-create all database tables each time.
// it's a better pratice to have it during the building  of the project
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () =>
    console.log("%c Now listening to port", "color:green" + PORT)
  );
});
