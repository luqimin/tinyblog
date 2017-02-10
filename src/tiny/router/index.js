import fs from 'mz/fs'
import path from 'path'
import render from './template'
import Router from 'koa-router'
import CONFIG from '../config'
import marked from 'marked'
import articleHandle from './article'

const router = Router();

marked.setOptions({
    highlight: function (code) {
        return require('highlight.js').highlightAuto(code).value;
    }
});

//首页路由
router.get('/', async ctx => {
    let data = require(path.relative(__dirname, path.join(CONFIG.homeDir + '/model.js')));

    //获取前十个文章
    data.articles = await articleHandle.list(1, 10);

    ctx.response.body = render(path.join(CONFIG.homeDir + '/' + 'index.ejs'), data, ctx);
    ctx.response.type = 'text/html';
});

//创建article路由
router.get('/article/:title', async(ctx, next) => {
    let article = path.join(CONFIG.articleDir + '/' + ctx.params.title + '.md'),
        template = path.join(CONFIG.templateDir + '/' + 'article.ejs');

    let dbArticle = await articleHandle.get({url: `= '${ctx.params.title}'`});

    if (dbArticle && dbArticle[0]) {
        console.log('> 数据库获取文章id: ' + dbArticle[0].id);
        ctx.response.body = render(template, Object.assign(dbArticle[0]), ctx);
        ctx.response.type = 'text/html';
    } else {
        if (await fs.exists(article)) {
            console.log('> 暂存文件夹获取文章: ' + article);
            let content = await fs.readFile(article, {encoding: 'utf8'});

            let articleContent = marked(articleHandle.getContent(content)),
                articleInfo = articleHandle.getInfo(content);

            articleHandle.creat(articleContent, articleInfo);

            ctx.response.body = render(template, Object.assign(articleInfo, {content: articleContent}), ctx);
            ctx.response.type = 'text/html';
            //从文章暂存文件夹删除文件
            fs.unlink(article);
        }
    }

});

//创建view路由
// fs.readdir(CONFIG.moduleDir, (err, dirs) => {
//     for (let dir of dirs) {
//         let viewDir = path.join(CONFIG.moduleDir + '/' + dir);
//         fs.readdir(viewDir, (err, files) => {
//             let data = {},
//                 url = '';
//             for (let file of files) {
//                 //获取model.js内容写入data
//                 if (file.split('.')[0] == 'model') {
//                     data = require(path.relative(__dirname, path.join(viewDir + '/' + file)));
//                 }
//                 //获取index.html内容render
//                 if (file.split('.')[1] == 'html') {
//                     url = path.join(viewDir + '/' + file);
//                 }
//             }
//             router.get('/' + dir, async ctx => {
//                 ctx.response.body = render(url, data, ctx)
//                 ctx.response.type = 'text/html';
//             });
//         });
//     }
// });

router.post('/signin', async(ctx, next) => {
    console.log(ctx.request);
    console.log(ctx.request.host);
    console.log(ctx.request.body);
    let name = ctx.request.body.name || '',
        password = ctx.request.body.password || '';
    console.log(`signin with name: ${name}, password: ${password}`);
    if (name === 'koa' && password === '12345') {
        ctx.response.body = `<h1>Welcome, ${name}!</h1>`;
    } else {
        ctx.response.body = `<h1>Login failed!</h1>
        <p><a href="/">Try again</a></p>`;
    }
});

function addMapping(router, mapping) {
    for (var url in mapping) {
        if (url.startsWith('GET ')) {
            var path = url.substring(4);
            router.get(path, mapping[url]);
            console.log(`register URL mapping: GET ${path}`);
        } else if (url.startsWith('POST ')) {
            var path = url.substring(5);
            router.post(path, mapping[url]);
            console.log(`register URL mapping: POST ${path}`);
        } else {
            console.log(`invalid URL: ${url}`);
        }
    }
}

function addControllers(router) {
    var files = fs.readdirSync('www');
    var js_files = files.filter((f) => {
        return f.endsWith('.js');
    });

    for (var f of js_files) {
        console.log(`process controller: ${f}...`);
        let mapping = require('www/' + f);
        addMapping(router, mapping);
    }
}

export default router;