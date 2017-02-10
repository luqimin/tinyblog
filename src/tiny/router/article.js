import sql from '../database'
import moment from 'moment'
import {slugify} from 'transliteration'

let infoReg = /#TINY#([\s\S]*)#TINY#/;

let article = {
    getInfo(mark) {
        mark = mark.match(infoReg)[0].replace(infoReg, '$1');
        return JSON.parse(mark);
    },
    getContent(mark) {
        return mark.replace(infoReg, '');
    },
    async creat(content, info) {
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
        return result;
    },
    async list(page, number){
        let result = await sql(`SELECT url,title,uploadtime,brief,tags FROM article
        order by id desc
        limit ${(page - 1) * number}, ${number}`);
        for (let p of result) {
            console.log(p);
            p.uploadtime = moment(p.uploadtime).startOf('hour').fromNow();
            p.tags = p.tags.split(',');
        }
        return result;
    },
    async delete(){

    }
};

export default article;