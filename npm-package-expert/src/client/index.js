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
