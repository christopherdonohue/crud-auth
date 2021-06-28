const express = require("express");
const bodyParser = require("body-parser");
const dbConfig = require("./Config/db.config");
const mongoose = require("mongoose");
const cors = require("cors");

mongoose.Promise = global.Promise;

mongoose
  .connect(dbConfig.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Successfully Connected to the Database");
  })
  .catch((err) => {
    console.log("Connection Failed. Terminating...", err);
    process.exit();
  });

const app = express();
app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Internet" });
});

require("./src/Routes/gamer.routes.js")(app);

app.listen(3001, () => {
  console.log("Server is listening on port 3001");
});
