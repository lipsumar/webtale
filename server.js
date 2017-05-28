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
		if(err) return res.send(err)
		if(user){
			res.send(user)
		}else{
			res.send('we don’t have that')
		}
	})
})

app.listen(80, function () {
	console.log('Example app listening on port 3000!')
})