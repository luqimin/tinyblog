import sql from '../database'
import moment from 'moment'
import {slugify} from 'transliteration'

let infoReg = /#TINY#([\s\S]*)#TINY#/;

//处理文章info
let postHandle = function (info) {
    if (Array.isArray(info)) {
        info = info[0];
    } else if (typeof info == 'string') {
        info = JSON.parse(info);
    }

    if (!info) {
        return info;
    }

    let article = {
        id: info.id || '',
        title: info.title || "The title OF TINYBLOG's article",
        url: info.url || '#' + info.id,
        brief: info.brief || '暂无简介',
        content: info.content || '',
    };

    //处理上传时间
    article.uploadtime = moment(info.uploadtime).startOf('hour').fromNow();

    //格式化tags为数组
    if (Array.isArray(info.tags)) {
        article.tags = info.tags;
    } else if (typeof info.tags == 'string') {
        if (info.tags.indexOf(',') != -1) {
            article.tags = info.tags.split(',');
        } else {
            article.tags = [info.tags];
        }
    } else {
        article.tags = [];
    }

    return article;
};

let article = {

    //从md文件获取文章info
    getInfo(mark) {
        mark = mark.match(infoReg)[0].replace(infoReg, '$1');
        return postHandle(mark);
    },

    //从md文件获取文章content
    getContent(mark) {
        return mark.replace(infoReg, '');
    },

    async insert(content, info) {
        let date = moment().format('YYYY-MM-DD HH:mm:ss');

        info.url = info.url || slugify(info.title);
        let result = await sql(`INSERT INTO article (url, title, brief, tags, content, uploadtime) 
        VALUES ('${info.url}', '${info.title}', '${info.brief}', '${info.tags}', '${content}', '${date}')`);

        console.log(`> 入库文章id: ${result.insertId}`);
        return result;
    },

    async get(info){
        let query = '';
        for (let p in info) {
            query += `${p} ${info[p]} AND `;
        }
        query = query.substr(0, query.length - 5);

        let result = await sql(`SELECT * FROM article WHERE ${query}`);
        return postHandle(result);
    },

    async list(page, number){
        let result = await sql(`SELECT url,title,uploadtime,brief,tags FROM article
        order by id desc
        limit ${(page - 1) * number}, ${number}`),
            list = [];

        for (let p of result) {
            list.push(postHandle(p));
        }

        return list;
    },

    async delete(){

    }
};

export default article;