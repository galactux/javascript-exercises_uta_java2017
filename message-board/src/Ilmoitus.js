import React from 'react';
import { Alert } from 'react-bootstrap';

const Ilmoitus = ({ _id, teksti }) =>
  <Alert key={_id}>
    {teksti}
  </Alert>;

export default Ilmoitus;
