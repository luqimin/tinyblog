import fs from 'fs'
import ejs from 'ejs'
import moment from 'moment'

let render = function (url, model, ctx) {
    let opt = {
        cache: true,
        filename: url,
    };

    if (typeof model.tags == 'string') {
        model.tags = model.tags.split(',');
    }
    if (model.uploadtime) {
        model.uploadtime = moment(model.uploadtime).startOf('hour').fromNow();
    }

    let html = fs.readFileSync(url, {encoding: 'utf8'});
    return ejs.render(html, Object.assign({}, (ctx && ctx.state) || {}, model || {}), opt);

};

export default render;