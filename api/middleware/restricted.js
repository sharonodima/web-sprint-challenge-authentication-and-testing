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
    return res.status(400).send("token required");
  }
  try {
    const decodedToken = jwt.verify(token, "secret");
  
    const existingUser = await knex("users").select().where({
      id: decodedToken.id
    });
    if (existingUser.length === 0) {
      return res.status(403).send("token invalid");
    }
  } catch (error) {
    return res.status(403).send("token invalid");
  }
  next();
};
