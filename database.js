const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(__dirname + '/users.db');

function insertUser(email, password) {
    return new Promise((resolve, reject) => {
        db.run('INSERT INTO users (email, password) VALUES (?, ?)', [email, password], function(err) {
            if (err) reject(err);
            else resolve();
        });
    });
}

function findUserByEmail(email) {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
}

module.exports = { insertUser, findUserByEmail };