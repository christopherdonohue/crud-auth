module.exports = (app) => {
   const gamers = require('../Controllers/gamer.controller.js');

   app.post('/auth/register', gamers.register);

   app.post('/auth/login', gamers.login);

   //    app.get('/gamers', gamers.findAll);

   //    app.get('gamers/:gamerId', gamers.findOne);

   //    app.put('/gamers/:gamerId', gamers.update);

   //    app.delete('/gamers/:gamerId', gamers.delete);
   //
};
