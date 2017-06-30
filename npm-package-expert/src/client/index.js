import 'bootstrap/dist/css/bootstrap.css';
import { shuffle } from 'lodash';

const states = Object.freeze({
  WAIT: 1,
  TIE: 2,
  MANWINS: 3,
  CPUWINS: 4,
  MANWON: 5,
  CPUWON: 6
});
const biggerWins = Object.freeze([
  'dependents',
  'downloadsLastMonth',
  'maintenance',
  'popularity',
  'quality',
  'releases'
]);
const smallerWins = Object.freeze([
  'dependencies',
  'openIssues',
  'openPullRequests'
]);

class App {
  constructor(root) {
    this.root = root;
    fetch('/api/top-packages.json')
      .then(response => response.json())
      .then(data => {
        this.cards = data;
        // Init new game
        this.state = states.MANWON;
        this.play();
      });
  }

  play(chosen = null) {
    // chosen: Human's choise
    const newRound = this.inState(['MANWINS', 'CPUWINS']);
    const newGame = this.inState(['MANWON', 'CPUWON']);
    if (newRound) {
      this.round++;
      if (this.inState(['MANWINS'])) {
        this.man.push(this.cpu.shift(), this.man.shift());
      } else {
        this.cpu.push(this.man.shift(), this.cpu.shift());
      }
    }
    if (newGame) {
      this.round = 1;
      const cards = shuffle(this.cards);
      this.man = cards.slice(0, cards.length / 2);
      this.cpu = cards.slice(cards.length / 2, cards.length);
    }
    if (newRound || newGame) {
      this.state = states.WAIT;
      this.chosen = [];
      this.logCards();
    } else {
      const manCard = this.man[0][chosen];
      const cpuCard = this.cpu[0][chosen];
      this.state =
        cpuCard === manCard
          ? states.TIE
          : smallerWins.includes(chosen) === cpuCard > manCard
            ? this.cpu.length > 1 ? states.MANWINS : states.MANWON
            : this.man.length > 1 ? states.CPUWINS : states.CPUWON;
      this.chosen = this.inState(['TIE'])
        ? [chosen].concat(this.chosen)
        : [chosen];
    }
    this.root.innerHTML = this.render(); // Update page
  }

  inState(stList) {
    return stList.find(st => states[st] === this.state);
  }

  logCards() {
    for (const player of ['man', 'cpu']) {
      const cards = this[player];
      console.log(`===== ${player} - Round: ${this.round}\n${cards[0].name}:`);
      for (const category of [biggerWins, smallerWins]) {
        console.log(
          `  ${category.map(attr => `${attr}: ${cards[0][attr]}`).join(', ')}`
        );
      }
      console.log(
        `${cards.length}: ${cards.map(card => card.name).join(', ')}`
      );
    }
  }

  render() {
    const manCards =
      this.man.length +
      (this.inState(['MANWINS', 'MANWON']) ? 1 : 0) -
      (this.inState(['CPUWINS', 'CPUWON']) ? 1 : 0);
    return `
      <div class="container panel panel-default">
      <h3>[[[♦] Top Trumps [♦]]]</h3>
      <div class="panel panel-default">
      Round: <b>${this.round}</b> --
      Cards: <b>${manCards}</b> - <b>${this.cards.length - manCards}</b>
      <small>(You - Computer)</small></div>
      ${this.showCard('man')}${this.showCard('cpu')}
      <div><button class="btn btn-primary"
      ${this.inState(['WAIT', 'TIE'])
        ? `
          disabled="1">${this.inState(['TIE'])
            ? 'Values are equal, choose another attribute!'
            : 'Choose an attribute!'}`
        : 'onClick="app.play()">'}
      ${this.inState(['MANWINS']) ? 'You win! - Continue to next round...' : ''}
      ${this.inState(['CPUWINS'])
        ? 'You loose! - Continue to next round...'
        : ''}
      ${this.inState(['MANWON'])
        ? 'You won the match! - Start a new game...'
        : ''}
      ${this.inState(['CPUWON'])
        ? 'Computer won the match! - Start a new game...'
        : ''}
      </button></div>
      </div>`;
  }

  showCard(player) {
    // player: 'man' or 'cpu'
    const card = this[player][0];
    const hideChoose = (thePlayer, attr) =>
      thePlayer &&
      (this.inState(['WAIT']) ||
        (this.inState(['TIE']) && !this.chosen.includes(attr)));
    return `
      <div class="card panel panel-default">
      <div class="panel-heading">
      ${player === 'man' ? 'Your' : "Computer's"} card:
      <b>${hideChoose(player === 'cpu', null) ? '???' : card.name}</b>
      </div>
      <table>
      <tr><th class="attribute">Attribute</th><th class="value">Value</th></tr>
      ${biggerWins
        .concat(smallerWins)
        .map(attr => {
          const bigger = biggerWins.includes(attr) ? 'bigger' : '';
          const chosen = attr === this.chosen[0] ? 'chosen' : '';
          return `
            <tr><td class="attribute ${bigger} ${chosen}">
            ${hideChoose(player === 'man', attr)
              ? `
                <a class="choosable"
                title="Click to choose, ${bigger || 'smaller'} value wins"
                href="#" onclick="app.play('${attr}');return false;">${attr}
                </a>`
              : attr}
            </td>
            <td class="value ${bigger} ${chosen}">
            ${hideChoose(player === 'cpu', attr) ? '?' : card[attr]}
            </td></tr>`;
        })
        .join('')}
      </table>
      </div>
    `;
  }
}

window.app = new App(document.getElementById('root'));
