const bcrypt = require("bcryptjs");

//register
module.exports = {
  register: async (req, res) => {
    const db = req.app.get("db");
    const { username, password, isAdmin } = req.body;
    const result = await db.get_user([username]);
    const existingUser = result[0];
    if (existingUser) {
      return res.status(409).json("Username already exists");
    }
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    const registeredUser = await db.register_user([isAdmin, username, hash]); //put these as {}, would not run. Make sure to put in array
    const user = registeredUser[0];
    req.session.user = {
      isAdmin: user.is_admin, //Originally caps is_Admin, did not work.
      username: user.username,
      id: user.id,
    };
    return res.status(201).send(req.session.user); // tried just sending user, did not work.
  },
};

//login
