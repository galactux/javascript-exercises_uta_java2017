# Tehtävä
## Valmistelut

1. Tee [Create React App](https://github.com/facebookincubator/create-react-app) -työkalulla uusi React-projekti
1. Asenna oheiset riippuvuudet
    ```
    npm install --save concurrently koa koa-proxy koa-socket koa-static pouchdb pouchdb-server
    npm install --save-dev bootstrap react-bootstrap socket.io-client
    ```
1. Aseta `main`- ja `proxy`-arvot, ja lisää skriptit `package.json`:iin
    ```json
    {
      "scripts": {
        "start:db": "pouchdb-server --dir pouchdb",
        "start:server": "node .",
        "start:prod": " concurrently \"npm run start:db\" \"npm run start:server\""
      },
      "main": "server",
      "proxy": {
        "/*": {
          "target": "http://localhost:8080/"
        },
        "/socket.io/*": {
          "target": "http://localhost:8080/",
          "ws": true
        }
      }
    }
    ```

1. Lisää seuraavat tiedostot

    `server.js`:
    ```js
    const Koa = require('koa');
    const proxy = require('koa-proxy');
    const serve = require('koa-static');
    const PouchDB = require('pouchdb');
    const IO = require('koa-socket');

    const app = new Koa();
    const io = new IO();
    const dbHost = 'http://localhost:5984';
    const port = 8080;

    io.attach(app);
    // Selainsovelluksen jakaminen tuotantoversiossa build-kansiosta.
    app.use(serve('build'));
    // Pyyntöjen välitys tietokantaan.
    app.use(proxy({ host: dbHost }));

    app.listen(port);
    console.log(`listening on port ${port}`);

    app._io.on('connection', function(socket) {
      // Mapiin tallennetaan aloitetut tietokantojen kuuntelut, jotta
      // kuuntelut voidaan lopettaa kun client sulkee yhteyden (sivulta
      // poistutaan tms.).
      const changeListeners = new Map();
      // Aloita muutospyyntöjen kuuntelu. Parametrina tulee antaa
      // tietokannan nimi, jonka muutoksista halutaan tieto.
      socket.on('addListener', function(dbName) {
        if (!changeListeners.has(dbName)) {
          const db = new PouchDB(`${dbHost}${dbName}`);
          changeListeners.set(
            dbName,
            db
              .changes({ live: true, include_docs: true, since: 'now' })
              .on('change', function(change) {
                socket.emit('change', change.doc);
              })
          );
        }
      });
      socket.on('removeListener', function(dbName) {
        if (changeListeners.has(dbName)) {
          changeListeners.get(dbName).cancel();
          changeListeners.delete();
        }
      });
      socket.on('disconnect', function() {
        changeListeners.forEach(function(changes) {
          changes.cancel();
        });
        changeListeners.clear();
      });
    });
    ```

    `src/App.js`:
    ```js
    import React, { Component } from 'react';
    import io from 'socket.io-client';
    import 'bootstrap/dist/css/bootstrap.css';
    import {
      Button,
      Col,
      ControlLabel,
      FormControl,
      FormGroup,
      Grid,
      Row
    } from 'react-bootstrap';
    import Ilmoitus from './Ilmoitus';

    const socket = io();

    class App extends Component {
      state = {
        ilmoitukset: [],
        teksti: ''
      };
      componentWillMount() {
        socket.on('change', doc => {
          if (doc._deleted) {
            // Dokumentti on poistettu.
            this.setState({
              ilmoitukset: this.state.ilmoitukset.filter(
                ({ _id }) => doc._id !== _id
              )
            });
          } else {
            const index = this.state.ilmoitukset.findIndex(
              ({ _id }) => _id === doc._id
            );
            if (index === -1) {
              // Uusi dokumentti.
              this.state.ilmoitukset.push(doc);
            } else {
              // Dokumenttia muokattiin.
              this.state.ilmoitukset[index] = doc;
            }
            this.setState(this.state);
          }
        });
        socket.emit('addListener', 'ilmoitustaulu');
      }
      componentWillUnmount() {
        socket.emit('removeListener', 'ilmoitustaulu');
      }
      onSubmit = async event => {
        event.preventDefault();
        // const teksti = this.state.teksti
        const { teksti } = this.state;
        // http://docs.couchdb.org/en/latest/api/database/common.html#post--db
        await fetch('/ilmoitustaulu', {
          headers: {
            'Content-Type': 'application/json'
          },
          method: 'POST',
          body: JSON.stringify({ teksti })
        });
        // Tyhjennetään tallennettu arvo tekstikentästä.
        this.setState({ teksti: '' });
      };
      render() {
        return (
          <Grid fluid>
            <h1>Ilmoitustaulu</h1>
            <Row>
              <Col xs={12} sm={7} md={8} lg={9}>
                {this.state.ilmoitukset.map(Ilmoitus)}
              </Col>
              <Col xs={12} sm={5} md={4} lg={3}>
                <form onSubmit={this.onSubmit}>
                  <FormGroup>
                    <ControlLabel>Viesti</ControlLabel>
                    <FormControl
                      type="text"
                      placeholder="Viesti"
                      value={this.state.teksti}
                      onChange={event =>
                        this.setState({ teksti: event.target.value })}
                    />
                  </FormGroup>
                  <Button bsStyle="primary" type="submit" block>Lähetä</Button>
                </form>
              </Col>
            </Row>
          </Grid>
        );
      }
    }

    export default App;
    ```

    `src/Ilmoitus.js`:
    ```js
    import React from 'react';
    import { Alert } from 'react-bootstrap';

    const Ilmoitus = ({ _id, teksti }) => (
      <Alert key={_id}>
        {teksti}
      </Alert>
    );

    export default Ilmoitus;
    ```

1. Käynnistä tietokanta ja palvelin
    ```
    npm run start:prod
    ```

1. Toisessa terminaalissa käynnistä käyttöliittymän kehitys
    ```
    npm start
    ```

1. Avaa tietokannan hallitapaneeli [http://localhost:5984/_utils/](http://localhost:5984/_utils/)
1. Avaa sovellus ([http://localhost:3000](http://localhost:3000)) ja kokeile lisätä muutamia ilmoituksia

# Tehtävä

1. `componentWillMount`-metodissa hae nykyiset ilmoitukset [tietokannasta](http://docs.couchdb.org/en/latest/api/database/bulk-api.html#db-all-docs)
    * (Palvelin ohjaa pyynnöt tietokannalle, joten osoite on muotoa `/jotain?abc=123`)
    * Sisällytä dokumentit vastaukseen `include_docs`-parametrilla
    * Aseta dokumentit `state`:en, jotta ne näkyvät ruudulla
    ```js
    async componentWillMount() {
      const response = await fetch(/*...*/);
      const data = await response.json();
      //const ilmoitukset = ...;
      //this.setState({ ilmoitukset });

      //socket.on('change', doc => {...
    ```
1. Lisää ilmoitukselle [poista-ruksi](https://react-bootstrap.github.io/components.html#alerts-closeable)
    * Ruksia painettaessa tehdään `fetch`-pyyntö tietokantaan, jolla [poistetaan](http://docs.couchdb.org/en/latest/api/document/common.html#delete--db-docid) kyseinen ilmoitus tietokannasta
1. Ilmoitusten järjestäminen
    1. Lisää uudelle ilmoitukselle aikaleima (esimerkiksi `Date.now()`)
    1. [Järjestä](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort) ilmoitukset render-metodissa aikaleiman mukaan, uusin ylimmäksi
1. Erityyppisten ilmoitusten tallennus
    1. Lisää lomakkeelle valinta, josta voi valita ilmoituksen tyypin (`"success"`, `"warning"`, `"danger"`, `"info"`)
    1. Käytä `<Alert />`-komponentin [`bsStyle`-propertyä](https://react-bootstrap.github.io/components.html#alert-props) näyttämään erityypin ilmoitukset omilla väreillään

### Lisätehtäviä
* Estä tyhjän viestin lähetys
* Disabloi lomakkeen kentät ja "Lähetä"-painike, kun tallennus on kesken
  * (estetään vahinkolähetykset ja näytetään käyttäjälle, että toiminnon suoritus on kesken)
* Toteuta ilmoitusten muokkaus
  * Ilmoitusta klikattaessa tiedot avataan lomakkeelle ja tallennus päivittää ilmoituksen tiedot
