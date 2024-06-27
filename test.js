const express = require('express');
const expressAutoReload = require('express-autoreload');

const app = express();
const port = 3000;

// Configuration d'express-autoreload
if (app.get('env') === 'development') {
  app.use(expressAutoReload);
}

// Route d'exemple
app.get('/', (req, res) => {
  res.send('<h1>Hello, world!</h1>');
});

// Démarrage du serveur
app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});