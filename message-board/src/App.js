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
              <Button bsStyle="primary" type="submit" block>
                Lähetä
              </Button>
            </form>
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default App;
