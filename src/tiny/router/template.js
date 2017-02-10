import fs from 'fs'
import ejs from 'ejs'

let render = function (url, model, ctx) {
    let opt = {
        cache: true,
        filename: url,
    };

    let html = fs.readFileSync(url, {encoding: 'utf8'});
    return ejs.render(html, Object.assign({}, (ctx && ctx.state) || {}, model || {}), opt);

};

export default render;