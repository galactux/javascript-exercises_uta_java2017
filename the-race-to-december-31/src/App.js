import React, { Component } from 'react';
import { SingleDatePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';
import moment from 'moment';
import './App.css';

class App extends Component {
  state = {};

  constructor() {
    super();
    this.initNewGame(false);
  }

  initNewGame(setSt) {
    this.state = {
      date: moment('1.1', 'D.M'),
      dates: [moment('1.1', 'D.M')],
      focused: true,
      theEnd: ''
    };
    if (setSt) {
      this.setState(this.state);
    }
  }

  isValidMove(date) {
    // Returns true if given date is a legal move for the user
    const currDay = this.state.date.date(),
      currMonth = this.state.date.month(),
      newDay = date.date(),
      newMonth = date.month();
    return (
      (newDay > currDay && newMonth === currMonth) ||
      (newDay === currDay && newMonth > currMonth)
    );
  }

  play(date) {
    // date: Date selected by the user
    if (date.format('DD.MM') === '31.12') {
      // User wins
      this.setState({
        date,
        dates: this.state.dates.concat([date]),
        theEnd: 'You win!'
      });
      return;
    }
    const cpuDate = this.getComputerMove(date);
    // CPU wins?
    const theEnd =
      cpuDate.format('DD.MM') === '31.12' ? 'You loose!' : this.state.theEnd;
    this.setState({
      date: cpuDate,
      dates: this.state.dates.concat([date, cpuDate]),
      theEnd
    });
  }

  getComputerMove(a) {
    const b = a.date();
    if (31 === b) return moment({ date: 31, month: 11 });
    const c = a.month(),
      d = c + 20;
    if (d < b) {
      const e = b - 20,
        f = moment({ date: b, month: e });
      return f.isValid() ? f : moment({ date: b, month: e + 1 });
    }
    return moment(d === b ? { date: b, month: c + 1 } : { date: d, month: c });
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>The Race to December 31</h2>
        </div>
        <div className="App-body">
          <table className="App-table">
            <thead>
              <tr>
                <th>Played dates:</th>
              </tr>
            </thead>
            <tbody>
              {this.state.dates.map((x, index) =>
                <tr className="App-table-tr" key={index}>
                  <td>
                    {index + 1}. {x.format('DD.MM.YYYY')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {this.state.theEnd
            ? <div>
                <h3>
                  <p>
                    {this.state.theEnd}
                  </p>
                </h3>
                <button onClick={() => this.initNewGame(true)}>
                  Start a new game!
                </button>
              </div>
            : <div className="App-datepick">
                <b>Select your date: </b>
                <SingleDatePicker
                  date={this.state.date}
                  onDateChange={date => this.play(date)}
                  focused={this.state.focused}
                  onFocusChange={({ focused }) => this.setState({ focused })}
                  displayFormat="DD.MM.YYYY"
                  isOutsideRange={date =>
                    date.year() !== this.state.date.year()}
                  isDayBlocked={date => !this.isValidMove(date)}
                />
              </div>}
        </div>
      </div>
    );
  }
}

export default App;
