const AutoReloader = require('./lib/autoreloader');

/**
 * Fonction permettant de formater l'html en texte
 * 
 * @param {string} html - l'HTML à convertir en texte
 * @returns {string} - La nouvelle string
 */
function escapeHTML(html) {
  return htmlString.replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/\\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;')
    .replace(/'/g, '&#x27;')
    .replace(/`/g, '&#x60;')
    .replace(/\\/g, '&#x5C;')
    .replace(/\//g, '&#x2F;')
    .replace(/\n/g, '<br>')
    .replace(/&gt;&gt;\s*\d+\s*\|/g, '<span class="strong">>></span>');
}

/**
 * Middleware permettant l'intégration de l'endpoint et des fonctionnalités de
 * rechargement automatique de la page, ainsi que la gestion des erreurs de rendu
 * 
 * @param {Object} req - Requête HTTP
 * @param {Object} res - Réponse HTTP
 * @param {Function} next - Fonction callback pour passer au middleware suivant
 */
module.exports = function (req, res, next) {
  // Initialisation de rafraichisseur automatique au démarrage d'express
  if (!req.app.locals.reloadInitialized) {
    AutoReloader.init(req.app, {
      folderPath: process.cwd()
    });
    req.app.locals.reloadInitialized = true;
  }

  // Execution du script seulement dans les pages de rendue
  if (req.path !== '/express-livereload' && req.accepts('html')) {
    const reloadListener = `<script>new EventSource('/express-livereload').onmessage=e=>e.data=='reload'&&location.reload();</script>`;

    const originalRender = res.render;

    res.render = async function (view, options, callback) {
      await originalRender.call(this, view, options, (err, html) => {
        if (err) {
          console.error('Error rendering view:', err);

          const errorTitle = err.name || 'Rendering Error';
          const errorMessage = escapeHTML(err.message) || 'Error details not available.';

          const errorHtml = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1" />
              <title>Express Rendering Error</title>
              <style>
                @import url('https://fonts.googleapis.com/css2?family=Inconsolata:wght@200..900&display=swap');
                body {
                  background-color: #f2f2f2;
                  margin: 0;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  min-height: 100vh;
                }
                @media (max-width: 1024px) {
                  body {
                    min-height: unset;
                  }
                  .error-title, .error-footer {
                    text-align: center;
                    text-wrap: balance;
                  }
                }
                .error-container {
                  max-width: 1024px;
                  width: 90%;
                  font-family: "Inconsolata", monospace;
                }
                .error-content {
                  background-color: #000;
                  color: #fff;
                  padding: 20px;
                  border-radius: 5px;
                  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                  overflow: auto;
                }
                .error-content::-webkit-scrollbar {
                  width: 8px;
                  height: 8px;
                  background-color: #555555;
                }
                .error-content::-webkit-scrollbar-track {
                  background-color: transparent;
                }
                .error-content::-webkit-scrollbar-thumb {
                  background-color: #e74c3c;
                }
                .error-title {
                  color: #e74c3c;
                  margin-bottom: 10px;
                }
                .error-name, .error-stack {
                  text-align: left;
                  margin-bottom: 15px;
                }
                .strong {
                  font-weight: bold;
                  color: #e74c3c;
                  font-size: 20px;
                }
                .error-blinking-cursor {
                  height: 15px;
                  width: 10px;
                  background-color: #ffffff;
                  animation: blinkCursor 1s infinite;
                  display: inline-block;
                  vertical-align: middle;
                  margin-left: 5px;
                }
                @keyframes blinkCursor {
                  0%, 100% { opacity: 0; }
                  50% { opacity: 1; }
                }
              </style>
            </head>
            <body>
              <div class="error-container">
                <h1 class="error-title">Express Rendering Error</h1>
                <div class="error-content">
                  <p class="error-name strong">${errorTitle}</p>
                  <p class="error-stack">
                    <pre><code></code> <span class="error-blinking-cursor"></span></pre>
                  </p>
                </div>
                <p class="error-footer">Powered by <span class="strong">express-autoreload</span> made by <span class="strong">Alibee</span></p>
              </div>
              ${reloadListener}
              <script type="text/javascript">
                document.addEventListener('DOMContentLoaded', ()=>{const t=\`${errorMessage}\`,e=document.querySelector('.error-container code');let n=0;!function o(){e.innerHTML=t.slice(0,++n),n<=t.length&&setTimeout(o,1)}()} );
              </script>
            </body>
            </html>
          `;

          res.status(500).send(errorHtml);
        } else {
          const newHtml = html.replace(/<\/body>/i, `${reloadListener}</body>`);

          if (callback && typeof callback === 'function') {
            callback(null, newHtml);
          } else {
            res.send(newHtml);
          }
        }
      });
    };
  }

  // Passage au middleware suivant
  next();
};
