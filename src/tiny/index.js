import Koa from 'koa'
import './global'
import bodyParser from 'koa-bodyparser'
import router from './router'
import staticServer from 'koa-static'
import CONFIG from './config'

const app = new Koa();

// log request URL:
app.use(async(ctx, next) => {
    console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
    let start = new Date().getTime(),
        execTime;
    await next();
    execTime = new Date().getTime() - start;
    ctx.response.set('X-Response-Time', `${execTime}ms`);
});

app.use(staticServer(CONFIG.staticDir));
app.use(bodyParser());
app.use(router.routes());

app.listen(CONFIG.serverPort);

console.log(`${CONFIG.APPNAME} started at port ${CONFIG.serverPort}...`);