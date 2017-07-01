import React, { Component } from 'react';
import io from 'socket.io-client';
import 'bootstrap/dist/css/bootstrap.css';
import {
  Button,
  ButtonToolbar,
  Col,
  ControlLabel,
  FormControl,
  FormGroup,
  Grid,
  Row
} from 'react-bootstrap';
import Ilmoitus from './Ilmoitus';

const socket = io();
const dBase = 'ilmoitustaulu'; // Pouch database name
const delay = 2000; // Extra db delay in milliseconds for testing purposes!

// http://docs.couchdb.org/en/latest/api/

class App extends Component {
  state = {
    ilmoitukset: [], // All the documents from db
    text: '', // Document message text
    type: 'success', // Document type (success/warning/danger/info)
    _id: '', // Document db id, has value only when an existing doc (stored in db) is being updated
    _rev: '', // Document db revision, use only if _id is set
    disable: false // "Disable" UI? True during an ongoing db operation
  };

  async componentWillMount() {
    const data = await this.requestDB('/_all_docs?include_docs=true');
    const ilmoitukset = data.rows.map(i => i.doc);
    this.setState({ ilmoitukset });

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
    socket.emit('addListener', dBase);
  }

  componentWillUnmount() {
    socket.emit('removeListener', dBase);
  }

  onSubmit = event => {
    event.preventDefault();
    const { text, type, _id, _rev } = this.state;
    if (!_id) {
      // Create new doc
      this.requestDB('', 'POST', { text, type, time: Date.now() });
    } else {
      // Update existing doc, keep original timestamp
      this.requestDB(`/${_id}?rev=${_rev}`, 'PUT', {
        text,
        type,
        time: this.state.ilmoitukset.find(
          ({ _id, _rev }) => _id === this.state._id && _rev === this.state._rev
        ).time
      });
    }
  };

  async requestDB(url, method = 'GET', data = undefined) {
    this.setState({ disable: true }); // "Lock" UI
    // Wait for response headers
    let resp = await fetch(
      `/${dBase}${url}`,
      Object.assign(
        {
          headers: {
            'Content-Type': 'application/json'
          },
          method: method
        },
        data ? { body: JSON.stringify(data) } : {}
      )
    );
    // Don't care about status code, just wait for response JSON object
    resp = await resp.json();
    setTimeout(() => {
      this.setState({ text: '', _id: '', disable: false }); // "Release" UI
    }, delay);
    return resp;
  }

  render() {
    return (
      <Grid fluid>
        <h1>Ilmoitustaulu</h1>
        <Row>
          <Col xs={12} sm={7} md={8} lg={9}>
            {this.state.ilmoitukset.sort((a, b) => a.time - b.time).map(i => {
              const { text, type, _id, _rev } = i;
              const update = _id === this.state._id;
              return Ilmoitus(
                Object.assign({}, i, {
                  disable: this.state.disable || (!!this.state._id && !update),
                  update,
                  updateFunc: () => this.setState({ text, type, _id, _rev }),
                  cancelUpdFunc: () => this.setState({ text: '', _id: '' }),
                  deleteFunc: () =>
                    this.requestDB(`/${_id}?rev=${_rev}`, 'DELETE')
                })
              );
            })}
          </Col>
          <Col xs={12} sm={5} md={4} lg={3}>
            <form onSubmit={this.onSubmit}>
              <FormGroup>
                <ControlLabel>Viesti</ControlLabel>
                <FormControl
                  type="text"
                  placeholder="Viesti"
                  value={this.state.text}
                  disabled={this.state.disable}
                  onChange={event =>
                    this.setState({ text: event.target.value })}
                />
                <ControlLabel>Tyyppi</ControlLabel>
                <ButtonToolbar>
                  {[
                    ['success', 'OK'],
                    ['warning', 'Varoitus'],
                    ['danger', 'Vaara'],
                    ['info', 'Info']
                  ].map((t, k) =>
                    <Button
                      key={k}
                      active={t[0] === this.state.type}
                      bsSize={t[0] === this.state.type ? 'small' : 'xsmall'}
                      bsStyle={t[0]}
                      disabled={this.state.disable}
                      onClick={() => this.setState({ type: t[0] })}
                    >
                      {t[1]}
                    </Button>
                  )}
                </ButtonToolbar>
              </FormGroup>
              <Button
                className="btn-primary btn-block"
                disabled={this.state.disable || !this.state.text}
                type="submit"
              >
                {this.state._id ? 'Päivitä' : 'Lähetä'}
              </Button>
            </form>
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default App;
