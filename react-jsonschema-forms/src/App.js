import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Form from 'react-jsonschema-form';
import { SingleDatePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';
import moment from 'moment';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';

const dateFinnish = 'DD.MM.YYYY';

const ReactJsonschemaFormsRouterDemo = () =>
  <Router>
    <div>
      <div className="router-header">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/add-info">Add info</Link>
          </li>
          <li>
            <Link to="/change-passwd">Change Password</Link>
          </li>
        </ul>
      </div>
      <div className="router-body">
        <Route exact path="/" component={Home} />
        <Route path="/add-info" component={AddInfo} />
        <Route path="/change-passwd" component={ChangePasswd} />
      </div>
    </div>
  </Router>;

const Home = () =>
  <div>
    <h3>Home, Sweet Home</h3>
    <p>Demonstrating:</p>
    <ul>
      <li>React Router</li>
      <li>React JSONSchema Form</li>
      <li>Airbnb React Datepicker</li>
      <li>Boostrap CSS</li>
    </ul>
  </div>;

// ----------------------------------------------------------------------------

const infoSchema = {
  title: 'Add info',
  type: 'object',
  required: ['title', 'info', 'date'],
  properties: {
    title: { type: 'string', title: 'Title', default: '' },
    info: { type: 'string', title: 'Info', default: '' },
    date: {
      type: 'string',
      title: `Publishing date (${dateFinnish})`, // Not used with ui:field!
      default: moment().format(dateFinnish)
    }
  }
};

const AddInfo = () =>
  <div>
    <Form
      schema={infoSchema}
      uiSchema={{
        info: { 'ui:widget': 'textarea' },
        date: {
          'ui:field': 'infoApp',
          'ui:help': infoSchema.properties.date.title
        }
      }}
      fields={{ infoApp: InfoApp }}
      onSubmit={({ formData }) => {
        alert(
          `Submitting\nTitle: ${formData.title}\nInfo: ${formData.info}\nDate: ${formData.date}`
        );
      }}
    />
  </div>;

class InfoApp extends Component {
  state = { date: moment(infoSchema.properties.date.default, dateFinnish) };

  render() {
    return (
      <SingleDatePicker
        date={this.state.date}
        onDateChange={date =>
          this.setState({ date }, () =>
            this.props.onChange(date.format(dateFinnish))
          )}
        focused={this.state.focused}
        onFocusChange={({ focused }) => this.setState({ focused })}
        displayFormat={dateFinnish}
      />
    );
  }
}

// ----------------------------------------------------------------------------

const passSchema = {
  title: 'Change password',
  type: 'object',
  required: ['pass1', 'pass2'],
  properties: {
    pass1: {
      type: 'string',
      title: 'New password',
      minLength: 6,
      default: ''
    },
    pass2: {
      type: 'string',
      title: 'Confirm new password',
      minLength: 6,
      default: ''
    }
  }
};

const ChangePasswd = () =>
  <Form
    schema={passSchema}
    uiSchema={{
      pass1: { 'ui:widget': 'password' },
      pass2: { 'ui:widget': 'password' }
    }}
    validate={validatePass}
    onSubmit={({ formData }) => {
      alert(`Submitting password '${formData.pass1}'`);
    }}
  />;

function validatePass(formData, errors) {
  if (formData.pass1 !== formData.pass2) {
    errors.pass2.addError("passwords don't match");
  }
  return errors;
}

// ----------------------------------------------------------------------------

export default ReactJsonschemaFormsRouterDemo;
