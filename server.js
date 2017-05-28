const express = require('express')
const app = express()
app.use( require('body-parser').json() );

const users = require('./lib/users')
users.init();

app.get('/', function (req, res) {
	res.send('This is WebTale')
})

app.post('/register', (req, res) => {
	console.log('/register');
	users.findByEmail(req.body.email, (err, user) => {
		if(err) {
			console.log('err 1');
			res.status(500).send(err)
			return
		}

		if(user){
			console.log('got user');
			res.send(user)
		}else{
			console.log('no user');
			users.add(req.body.email, (err, user) => {
				console.log('after add', err, user);
				if(err){
					res.status(500).send(err);
				}else{
					res.status(201).send(user);
				}

			})

		}
	})
})

app.listen((process.env.PORT || 3000), function () {
	console.log('app is listening')
})