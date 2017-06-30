import serve from 'koa-static';
import Koa from 'koa';

const app = new Koa();

app.use(serve('.'));

app.listen(3000);

console.log('listening on port 3000');
