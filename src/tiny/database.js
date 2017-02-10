import mysql from 'mysql'
import CONFIG from './config';

let pool = mysql.createPool({
    connectionLimit: 10,
    host: CONFIG.database.mysql.host,
    user: CONFIG.database.mysql.user,
    password: CONFIG.database.mysql.password,
    database: CONFIG.database.mysql.database
});


let query = function (sql) {
    return new Promise((resolve, reject) => {
        console.log('> 数据库操作: ' + sql.substr(0, 200) + ' ...');
        pool.query(sql, function (err, results, fields) {

            if (err) {
                reject(err);
            } else {
                resolve(results, fields);
            }
        });
    })
};

export default query;