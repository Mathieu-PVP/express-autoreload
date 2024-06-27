const chokidar = require('chokidar');
const { EventEmitter } = require('events');

/**
 * Class permettant d'initisaliser l'endpoint de rafraichissement et d'émettre les évènement de réponse
 */
class AutoReloader {
  /**
   * Intiialisation du rechargement automatique
   * @param {Object} app - L'instance d'express
   * @param {Object} [opt] - Les options à transmettre à l'instance
   * @param {string} [opt.folderPath] - Le chemin du dossier pour les fichiers à regarder
   */
  static init(app, opt) {
    opt = opt || {};
    this.eventEmitter = new EventEmitter();
    this.isReloading = false;
    this.watchFiles(opt);
    this.setupSSEEndpoint(app);
  }

  /**
   * Initialiser les fichiers à regarder
   * @param {Object} [opt] - Les options à transmettre
   * @param {string} [opt.folderPath] - Le chemin du dossier pour les fichiers à regarder
   */
  static watchFiles(opt) {
    const folderPath = opt.folderPath || process.cwd();
    const watcher = chokidar.watch(folderPath, {
      ignored: (path) => path.includes('node_modules')
    });

    let reloadTimeout = null;

    watcher.on('all', (event, filePath) => {
      if (AutoReloader.isReloading) return;

      AutoReloader.isReloading = true;
      AutoReloader.eventEmitter.emit('reload');

      reloadTimeout = setTimeout(() => {
        AutoReloader.isReloading = false;
      }, 100);
    });

    watcher.on('close', () => {
      clearTimeout(reloadTimeout);
    });
  }

  /**
   * Configureration de l'endpoint des événements à envoyer pour le client.
   * @param {Object} app - L'instance d'express
   */
  static setupSSEEndpoint(app) {
    app.get('/express-livereload', (req, res) => {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      const sendReload = () => {
        res.write('data: reload\n\n');
      };

      const reloadHandler = () => {
        sendReload();
      };

      if (AutoReloader.eventEmitter) {
        AutoReloader.eventEmitter.on('reload', reloadHandler);

        req.on('close', () => {
          AutoReloader.eventEmitter.off('reload', reloadHandler);
        });
      }
    });
  }
}

module.exports = AutoReloader;