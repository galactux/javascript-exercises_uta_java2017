import React from 'react';
import { Alert, Button } from 'react-bootstrap';

const Ilmoitus = ({
  _id,
  text,
  type,
  disable,
  update, // Existing doc is being updated?
  updateFunc,
  cancelUpdFunc,
  deleteFunc
}) =>
  <Alert key={_id} bsStyle={type}>
    {update
      ? <div>
          <mark>{text}</mark>
          <Button
            className="btn-primary btn-xs pull-right"
            disabled={disable}
            onClick={cancelUpdFunc}
          >
            Älä päivitä
          </Button>
        </div>
      : <div>
          {text}
          <Button
            className="btn-danger btn-xs pull-right"
            disabled={disable}
            onClick={deleteFunc}
          >
            Poista
          </Button>
          <Button
            className="btn-primary btn-xs pull-right"
            disabled={disable}
            onClick={updateFunc}
          >
            Muuta
          </Button>
        </div>}
  </Alert>;

export default Ilmoitus;
