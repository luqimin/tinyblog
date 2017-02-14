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
    let data = require(path.relative(__dirname, path.join(CONFIG.productionDir, CONFIG.homeDir, CONFIG.modelFile)));
console.log(tiny);
    //获取前十个文章
    data.articles = await articleHandle.list(1, 10);

    ctx.response.body = render(path.join(CONFIG.developmentDir, CONFIG.homeDir, CONFIG.viewFile), data, ctx);
    ctx.response.type = 'text/html';
});

//创建article路由
router.get('/article/:title', async(ctx, next) => {
    let article = path.join(CONFIG.articleDir, ctx.params.title + '.md'),
        templateDir = path.join(CONFIG.templateDir, 'article.ejs');

    let dbArticle = await articleHandle.get({url: `= '${ctx.params.title}'`});

    if (dbArticle) {
        console.log('> 数据库获取文章id: ' + dbArticle.id);
        ctx.response.body = render(templateDir, Object.assign(dbArticle), ctx);
        ctx.response.type = 'text/html';
    } else {
        if (await fs.exists(article)) {
            console.log('> 暂存文件夹获取文章: ' + article);
            let content = await fs.readFile(article, {encoding: 'utf8'});

            let articleContent = marked(articleHandle.getContent(content)),
                articleInfo = articleHandle.getInfo(content);

            //文章入库
            articleHandle.insert(articleContent, articleInfo);

            ctx.response.body = render(templateDir, Object.assign(articleInfo, {content: articleContent}), ctx);
            ctx.response.type = 'text/html';
            //从文章暂存文件夹删除文件
            // fs.unlink(article);
        }
    }
});

//创建模块路由
router.get('/:module', async(ctx, next) => {
    let moduleDir = path.join(CONFIG.moduleDir, ctx.params.module),
        viewDir = path.join(CONFIG.developmentDir, moduleDir, CONFIG.viewFile),
        modelDir = path.join(CONFIG.productionDir, moduleDir, CONFIG.modelFile);

    let model = {};

    if (await fs.exists(modelDir)) {
        model = require(path.relative(__dirname, modelDir));
        if (model.hasOwnProperty('default')) {
            model = model.default;
        }
    }
    if (await fs.exists(viewDir)) {
        ctx.response.body = render(viewDir, model, ctx);
        ctx.response.type = 'text/html';
    }
});

//创建控制器路由
function registerRouter(action, module) {
    console.log(`Process CONTROLLER: ${module}...`);
    for (let act in action) {
        if (action.hasOwnProperty(act)) {
            let dir = `/${module}/${act}`;
            router.get(dir, action[act]);
            router.post(dir, action[act]);
        }
    }
}

function addControllers() {
    let files = fs.readdirSync(path.join(CONFIG.productionDir, CONFIG.moduleDir));
    for (let f of files) {
        let dir = path.join(CONFIG.productionDir, CONFIG.moduleDir, f),
            controllerDir = path.join(dir, CONFIG.controllerFile);
        if (fs.existsSync(controllerDir)) {
            let action = require(path.relative(__dirname, controllerDir));
            if (action.hasOwnProperty('default')) {
                action = action.default;
            }
            action && registerRouter(action, f);
        }
    }
}

addControllers();

export default router;