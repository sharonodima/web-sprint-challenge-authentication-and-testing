const jwt = require("jsonwebtoken");
const knex = require("../../data/dbConfig");

module.exports = async (req, res, next) => {
  /*
    IMPLEMENT

    1- On valid token in the Authorization header, call next.

    2- On missing token in the Authorization header,
      the response body should include a string exactly as follows: "token required".

    3- On invalid or expired token in the Authorization header,
      the response body should include a string exactly as follows: "token invalid".
  */
  const token = req.get("Authorization");
  if (!token) {
    return res.send("token required");
  }
  try {
    const decodedToken = jwt.verify(token, "secret");
    console.log(decodedToken);
    const existingUser = await knex("users").select().where({
      id: decodedToken.id
    });
    if (existingUser.length === 0) {
      return res.send("token invalid");
    }
  } catch (error) {
    return res.send("token invalid");
  }
  next();
};
