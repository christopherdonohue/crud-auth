require("dotenv").config();

module.exports = {
  url: `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mdwlx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
};
