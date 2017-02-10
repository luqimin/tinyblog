import Koa from 'koa'
import bodyParser from './bodyparse'
import router from './router'
import staticServer from './static'
import CONFIG from './config'

const app = new Koa();

// log request URL:
app.use(async(ctx, next) => {
    console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
    await next();
});

app.use(staticServer(CONFIG.staticDir));
app.use(bodyParser());
app.use(router.routes());
app.listen(CONFIG.serverPort);

console.log(`${CONFIG.APPNAME} started at port ${CONFIG.serverPort}...`);