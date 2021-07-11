module.exports = (app) => {
  const checkToken = (req, res, next) => {
    const header = req.headers["authorization"];
    if (typeof header !== "undefined") {
      const bearer = header.split(" ");
      const token = bearer[1];
      req.token = token;
      next();
    } else {
      //If header is undefined return Forbidden (403)
      res.sendStatus(403);
    }
  };

  const gamers = require("../Controllers/gamer.controller.js");

  app.post("/auth/register", gamers.register);

  app.post("/auth/login", gamers.login);

  app.post("/auth/create", checkToken, gamers.create);

  app.post("/auth/description", checkToken, gamers.description);

  app.get("/auth/findAll", gamers.findAll);

  app.post("/gamers/findOne", checkToken, gamers.findOne);

  app.post(
    "/gamers/uploadProfilePicture",
    checkToken,
    gamers.uploadProfilePicture
  );

  //    app.put('/gamers/:gamerId', gamers.update);

  app.post("/gamers/delete", checkToken, gamers.delete);
  //
};
