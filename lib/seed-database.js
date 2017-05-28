var pg = require('pg');

pg.defaults.ssl = true;
pg.connect(process.env.DATABASE_URL, function(err, client) {
  if (err) throw err;
  console.log('Connected to postgres! Getting schemas...');

  client
    .query(`
	CREATE TABLE users (
		email varchar(255) primary key,
		creation_date timestamp NOT NULL,
		optout varchar(1) DEFAULT '0'
	)
    `)
    .on('row', function(row) {
      console.log(JSON.stringify(row));
    });
});