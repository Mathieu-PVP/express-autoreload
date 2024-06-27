# Express AutoReload (express-autoreload)

[![JavaScript](https://img.shields.io/badge/--F7DF1E?logo=javascript&logoColor=000)](https://www.javascript.com/)
[![Node.js](https://img.shields.io/badge/--fff?logo=node.js&logoColor=#68a063)](https://nodejs.org/en/)
[![Minimum node.js version](https://badgen.net/npm/node/express)](https://npmjs.com/package/express)
[![GitHub license](https://img.shields.io/github/license/Mathieu-PVP/express-autoreload.svg)](https://github.com/Mathieu-PVP/express-autoreload/blob/master/LICENSE)
[![GitHub commits](https://badgen.net/github/commits/Mathieu-PVP/express-autoreload)](https://GitHub.com/Mathieu-PVP/express-autoreload/commit/)
[![GitHub latest commit](https://badgen.net/github/last-commit/Mathieu-PVP/express-autoreload)](https://GitHub.com/Mathieu-PVP/express-autoreload/commit/)
[![GitHub contributors](https://badgen.net/github/contributors/Mathieu-PVP/express-autoreload)](https://GitHub.com/Mathieu-PVP/express-autoreload/graphs/contributors/)
[![GitHub issues](https://badgen.net/github/issues/Mathieu-PVP/express-autoreload/)](https://GitHub.com/Mathieu-PVP/express-autoreload/issues/)

Middleware permettant l'intégration de l'endpoint et des fonctionnalités de rechargement automatique de la page, ainsi que la gestion des erreurs de rendu

## Fonctionnalités
- **Express AutoReload** permet d'actualiser les pages front (html, ejs...) quand on sauvegarde un fichier de votre projet [Express](https://expressjs.com/)
- Il permet également de récupérer les erreurs de votre moteur de rendu et de les afficher avec style

![Capture d'écran](https://github.com/Mathieu-PVP/express-autoreload/assets/148555771/a302f013-53c5-4ec1-b252-b9ce526145cf)

## Installation
```
npm i https://github.com/Mathieu-PVP/express-autoreload.git
```

## Exemple d'utilisation
```js
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
```

## Licence
Ce projet est sous license [MIT](https://github.com/Mathieu-PVP/express-autoreload/blob/main/LICENSE)
