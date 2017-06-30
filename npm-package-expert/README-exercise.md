# PART 1/2
---
# Tehtävä
## Valmistelut

1. Asenna [Node.js](https://nodejs.org/)
1. Asenna editoriisi [Prettier](https://github.com/prettier/prettier#editor-integration)
   * Laita asetuksista koodimuotoilu päälle aina kun tiedosto tallennetaan
   * Atom-editorissa
     * Asennus:
       * *File > Settings > Install > "autosave" & "prettier"*
     * Asetukset:
       * *File > Settings > Packages > "autosave" > Settings > :ballot_box_with_check: Enabled*
       * *File > Settings > Packages > "prettier" > Settings > :ballot_box_with_check: Format Files on Save*
1. Tee uusi projekti
    ```sh
    mkdir npm-package-expert
    cd npm-package-expert
    npm init -y
    ```
1. Asenna projektin riippuvuudeksi Babel, Env preset ja Stage 2 preset, sekä Koa -palvelin-framework
    ```sh
    npm install --save-dev babel-cli babel-preset-env babel-preset-stage-2 koa koa-static
    ```
1. Korvaa `package.json`-tiedoston `main`- ja `scripts`-kentät näillä määrityksillä ja lisää `private`-määritys
    ```json
    {
      "main": "lib/server",
      "scripts": {
        "build": "babel src --out-dir lib --source-maps",
        "dev": "npm run build -- --watch",
        "start": "node ."
      },
      "private": true
    }
    ```
    * `scripts`-kenttään määritetään muun muassa paketin julkaisuun liittyviä skriptejä, sekä omavalintaisia komentoja
    * Yllä mainitut skriptit ovat omavalintaisia ja niitä voi kutsua skriptin nimellä (`npm run <skriptin nimi>`), esimerkiksi: `npm run build`
      * Poikkeuksena `start`, jota kutsutaan `npm start`
      * [Lisätietoa package.json -tiedostosta](https://docs.npmjs.com/files/package.json)
1. Lisää projektikansioon seuraavat tiedostot

    `api/top-packages.json`:
    ```json
    [
      {
        "name": "babel-cli",
        "version": "6.24.1",
        "releases": 63,
        "dependencies": 15,
        "dependents": 1726,
        "downloadsLastMonth": 1988789,
        "openIssues": 294,
        "openPullRequests": 109,
        "quality": 87,
        "popularity": 75,
        "maintenance": 99
      },
      {
        "name": "lodash",
        "version": "4.17.4",
        "releases": 100,
        "dependencies": 0,
        "dependents": 46210,
        "downloadsLastMonth": 44562576,
        "openIssues": 0,
        "openPullRequests": 0,
        "quality": 76,
        "popularity": 97,
        "maintenance": 100
      },
      {
        "name": "react",
        "version": "15.5.4",
        "releases": 119,
        "dependencies": 4,
        "dependents": 12679,
        "downloadsLastMonth": 4446041,
        "openIssues": 608,
        "openPullRequests": 118,
        "quality": 94,
        "popularity": 90,
        "maintenance": 95
      },
      {
        "name": "webpack",
        "version": "2.6.1",
        "releases": 451,
        "dependencies": 21,
        "dependents": 4055,
        "downloadsLastMonth": 6718003,
        "openIssues": 691,
        "openPullRequests": 45,
        "quality": 93,
        "popularity": 88,
        "maintenance": 78
      },
      {
        "name": "@angular/common",
        "version": "4.1.3",
        "releases": 82,
        "dependencies": 0,
        "dependents": 2296,
        "downloadsLastMonth": 1369818,
        "openIssues": 1423,
        "openPullRequests": 221,
        "quality": 84,
        "popularity": 76,
        "maintenance": 100
      },
      {
        "name": "rimraf",
        "version": "2.6.1",
        "releases": 44,
        "dependencies": 1,
        "dependents": 3996,
        "downloadsLastMonth": 20235792,
        "openIssues": 21,
        "openPullRequests": 6,
        "quality": 96,
        "popularity": 80,
        "maintenance": 86
      },
      {
        "name": "yargs",
        "version": "8.0.1",
        "releases": 138,
        "dependencies": 13,
        "dependents": 5849,
        "downloadsLastMonth": 28522602,
        "openIssues": 108,
        "openPullRequests": 3,
        "quality": 100,
        "popularity": 86,
        "maintenance": 99
      },
      {
        "name": "express",
        "version": "4.15.3",
        "releases": 252,
        "dependencies": 28,
        "dependents": 17385,
        "downloadsLastMonth": 12895865,
        "openIssues": 103,
        "openPullRequests": 45,
        "quality": 99,
        "popularity": 95,
        "maintenance": 97
      },
      {
        "name": "koa",
        "version": "2.2.0",
        "releases": 64,
        "dependencies": 24,
        "dependents": 1278,
        "downloadsLastMonth": 289573,
        "openIssues": 19,
        "openPullRequests": 9,
        "quality": 93,
        "popularity": 62,
        "maintenance": 100
      },
      {
        "name": "bootstrap",
        "version": "3.3.7",
        "releases": 16,
        "dependencies": 0,
        "dependents": 1912,
        "downloadsLastMonth": 1290099,
        "openIssues": 227,
        "openPullRequests": 62,
        "quality": 94,
        "popularity": 76,
        "maintenance": 98
      },
      {
        "name": "moment",
        "version": "2.18.1",
        "releases": 49,
        "dependencies": 0,
        "dependents": 13206,
        "downloadsLastMonth": 9319919,
        "openIssues": 192,
        "openPullRequests": 58,
        "quality": 100,
        "popularity": 92,
        "maintenance": 98
      },
      {
        "name": "chokidar",
        "version": "1.7.0",
        "releases": 71,
        "dependencies": 9,
        "dependents": 1934,
        "downloadsLastMonth": 9851092,
        "openIssues": 62,
        "openPullRequests": 5,
        "quality": 93,
        "popularity": 77,
        "maintenance": 97
      }
    ]
    ```

    `src/client/.babelrc`:
    ```json
    {
     "presets": [
       ["env", {
         "targets": {
           "browsers": ["last 2 versions", "safari >= 7"]
         }
       }],
       "stage-2"
     ]
    }
    ```

    `src/client/index.js`:
    ```js
    const button = (onClick, children) =>
      `<button onClick="${onClick}">${children}</button>`;

    const h1 = children => `<h1>${children}</h1>`;

    class App {
      constructor(root) {
        this.root = root;
        this.counter = 0;
        this.update();
      }
      update() {
        this.root.innerHTML = this.render();
      }
      increase() {
        this.counter++;
        this.update();
      }
      decrease() {
        this.counter--;
        this.update();
      }
      render() {
        return `
          ${h1('Counter')}
          <div>${this.counter}</div>
          ${button('app.decrease()', '-')}
          ${button('app.increase()', '+')}
        `;
      }
    }

    const app = new App(document.getElementById('root'));
    ```

    `src/server/.babelrc`:
    ```json
    {
     "presets": [
       ["env", {
         "targets": {
           "node": "current"
         }
       }],
       "stage-2"
     ]
    }
    ```

    `src/server/index.js`:
    ```js
    import serve from 'koa-static';
    import Koa from 'koa';

    const app = new Koa();

    app.use(serve('.'));

    app.listen(3000);

    console.log('listening on port 3000');
    ```

    `.gitignore`:
    ```
    /node_modules/
    /lib/
    ```

    `index.html`:
    ```html
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>npm Package Expert</title>
      <body>
        <div id="root"></div>
        <script type="text/javascript" src="/lib/client/index.js"></script>
      </body>
    </html>
    ```

# Tehtävä

1. Käynnistä Babel käännös watch-moodissa (komento jää auki terminaaliin)

    `npm run dev`
1. Käynnistä palvelin (toisessa terminaalissa)

    `npm start`
1. Muokkaa `src/client/index.js`-tiedostoa
    1. Hae palvelimelta `/api/top-packages.json`-tiedosto
    1. Toteuta sivulle "Top Trumps" -peli
      * Muokkaa `App`-luokkaa
      * Lisää `button` ja `h1` kaltaisia apufunktioita, jotka palauttavat HTML:ää

### Pelin säännöt
 * Kortit (tiedostossa oleva taulukko) sekoitetaan ja jaetaan 2 pakkaan
 * Pelaajalle näytetään oman pakan ylin kortti
 * Pelaajan tehtävä on veikata kortista tietoa, joka on parempi kuin vastapelaajan (tietokoneen) kortissa
   * Suurempi arvo on parempi näissä kentissä
     * `dependents`
     * `downloadsLastMonth`
     * `maintenance`
     * `popularity`
     * `quality`
     * `releases`
   * Pienempi arvo on parempi näissä kentissä
     * `dependencies`
     * `openIssues`
     * `openPullRequests`
 * Kun pelaaja on klikkaa valitsemaansa tietoa
   * Jos arvot ovat yhtäsuuret
     * Näytetään ilmoitus
     * Pelaaja veikkaa uudelleen
   * Jos arvot ovat erisuuret
      * Ohjelma näyttää molemmat kortit, kumpi pelaaja voitti kierroksen ja "Jatka"- / "Aloita alusta"-painikkeen
 * Kun pelaaja klikkaa "Jatka"-painiketta, molemmat kortit menevät voittaneen pelaajan pakan pohjalle
 * Jos molemmilla pelaajilla on kortteja jäljellä, pelataan uusi kierros
 * Peli päättyy kun toiselta pelaajalta loppuvat kortit
---
# PART 2/2
---
# Tehtävä

1. Asenna edellisen tehtävän projektiin Webpack, babel-polyfill, sekä seuraavat konfigurointiin ja kehitykseen liittyvät paketit
    ```
    npm install --save-dev webpack babel-loader babel-polyfill cross-env extract-text-webpack-plugin webpack-livereload-plugin css-loader file-loader style-loader url-loader
    ```
1. Lisää `webpack.config.js`:
    ```js
    const join = require('path').join;
    const ExtractTextPlugin = require('extract-text-webpack-plugin');
    const LiveReloadPlugin = require('webpack-livereload-plugin');

    const production = process.env.NODE_ENV === 'production';
    const plugins = [new ExtractTextPlugin('bundle.css')];
    if (!production) {
      plugins.push(
        new LiveReloadPlugin({
          appendScriptTag: true
        })
      );
    }

    module.exports = {
      devtool: production ? 'source-map' : 'eval-source-map',
      entry: {
        app: './src/client'
      },
      output: {
        path: join(process.cwd(), 'build'),
        filename: 'bundle.js',
        publicPath: '/build/'
      },
      module: {
        rules: [
          {
            test: /\.js$/,
            use: ['babel-loader'],
            include: join(process.cwd(), 'src')
          },
          {
            test: /\.css$/,
            use: ExtractTextPlugin.extract({
              fallback: 'style-loader',
              use: 'css-loader'
            })
          },
          {
            test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
            use: {
              loader: 'url-loader',
              options: { limit: 10000, mimetype: 'application/font-woff' }
            }
          },
          {
            test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
            use: {
              loader: 'url-loader',
              options: {
                limit: 10000,
                mimetype: 'application/octet-stream'
              }
            }
          },
          { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, use: 'file-loader' },
          {
            test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
            use: {
              loader: 'url-loader',
              options: { limit: 10000, mimetype: 'image/svg+xml' }
            }
          }
        ]
      },
      plugins
    };
    ```

1. Muokkaa `package.json`-tiedoston `script`-kenttiä seuraavasti
    ```json
    {
      "build": "babel src --out-dir lib --source-maps --ignore /client/",
      "bundle": "cross-env NODE_ENV=production webpack -p --progress",
      "dev": "npm run build && cross-env NODE_ENV=development webpack --progress --watch",
      "start": "node ."
    }
    ```

1. Vaihda `index.html`-tiedostossa JS-koodin sijainti URL uuteen `bundle.js`-tiedostoon ja lisää `head`:iin `bundle.css`-tiedoston lataus
    ```html
    <link href="/build/bundle.css" rel="stylesheet">
    <!-- -->
    <script type="text/javascript" src="/build/bundle.js"></script>
    ```

1. Tee `src/client/index.js`-tiedostossa `app`-muuttujasta globaali, jotta HTML-koodin `onclick`:eissä voidaan viitata siihen
    ```js
    // Moduulitiedoston sisällä muuttujat eivät ole globaaleja. Asetetaan
    // globaali `app`-muuttuja, jotta HTML-koodista voidaan kutsua sen
    // metodeja.
    window.app = new App(document.getElementById('root'));
    // const app = new App(document.getElementById('root'));
    ```

1. Käynnistä palvelin (`npm start`) ja sovelluksen kehitys (`npm run dev`)
1. Asenna [Boostrap-CSS-kirjasto](https://www.npmjs.com/package/bootstrap) npm:stä kuten aiemmatkin paketit
1. Ota `src/client/index.js`-tiedostossa Bootsrapin tyylitiedosto mukaan sovellukseen
    ```js
    import 'bootstrap/dist/css/bootstrap.css';
    /* ... */
    ```

1. Tee pelistä kivemman näköinen Bootsrapin tyyleillä. Esimerkiksi:
    ```html
    <button class="btn btn-primary">...</button>
    ```

1. Jaottele pelin koodeja omiin moduuleihin, jottei kaikki ole yhdessä pitkässä tiedostossa. Esimerkiksi:

    `src/client/card.js`:
    ```js
    export default ({ name, version, ...statistics }) => `
      <h3>${name}@${version}</h3>
      <ul>
        ${Object.entries(statistics)
          .map(([prop, value]) => `<li>${prop}: ${value}</li>`)
          .join('')}
      </ul>
    `;
    ```

    `src/client/index.js`:
    ```js
    import card from './card';
    /* ... */
    ```

1. Ota käyttöön ulkopuolisia JavaScript-kirjastoja, esimerkiksi [Lodash](https://lodash.com/)
    ```
    npm install --save-dev lodash
    ```

    ```js
    import { shuffle } from 'lodash';
    /* ... */
    this.cards = shuffle(this.cards);
    ```
