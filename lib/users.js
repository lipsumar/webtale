var pg = require('pg');
pg.defaults.ssl = true;

var client;

module.exports = {
    init: function(){
        pg.connect(process.env.DATABASE_URL, function(err, cli) {
          if (err) throw err;
          client = cli;
          console.log('Connected to postgres!');
        });
    },

    findByEmail: function(email, cb){
        client.query(`SELECT * FROM users WHERE email LIKE $1::text LIMIT 1`, [email], (err, result) => {
            if(err) cb(err)
            if(result.rows && result.rows[0]){
                cb(null, result.rows[0])
            }else{
                cb(null, null);
            }
        })

    },

    add: function(email, cb){
        client.query(`INSERT INTO users SET email=$1::text, creation_date=$2`, [email, new Date()], (err, result) => {
            if(err) cb(err)
            findByEmail(email, cb);

        })
    }
};


