require("dotenv").config();
const express = require("express");
const massive = require("massive");
const session = require("express-session");
const authCtrl = require("../controllers/authController");
const app = express();
const { CONNECTION_STRING, SESSION_SECRET } = process.env;
const PORT = 4000;
app.use(express.json());
app.use(
  session({
    resave: true,
    saveUninitialized: false,
    secret: SESSION_SECRET,
  })
);

massive({
  connectionString: CONNECTION_STRING,
  ssl: { rejectUnauthorized: false },
})
  .then((dbInstance) => {
    app.set("db", dbInstance);
    console.log("Database Running!");

    app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`));
  })
  .catch((err) => console.log(err));

app.post("/auth/register", authCtrl.register);
