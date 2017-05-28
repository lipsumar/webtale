const express = require('express')
const app = express()
app.use( require('body-parser').json() );

const users = require('./lib/users')
users.init();

app.get('/', function (req, res) {
	res.send('This is WebTale')
})

app.post('/register', (req, res) => {
	users.findByEmail(req.body.email, (err, user) => {
		if(err) {
			res.status(500).send(err)
			return
		}

		if(user){
			res.send(user)
		}else{
			users.add(req.body.email, (err, user) => {
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