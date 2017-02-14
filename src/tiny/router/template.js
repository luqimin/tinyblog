import fs from 'fs'
import path from 'path'
import ejs from 'ejs'
import CONFIG from '../config'

let render = function (url, model, ctx) {
    if (url === undefined) {

    }

    let opt = {
        cache: true,
        filename: url,
    }, defaultData = {
        title: CONFIG.APPNAME,
        keywords: CONFIG.keywords,
        description: CONFIG.description
    };

    let html = fs.readFileSync(url, {encoding: 'utf8'});
    return ejs.render(html, Object.assign(defaultData, (ctx && ctx.state) || {}, model || {}), opt);

};

//注册tiny.display
tiny.display = render;

export default render;