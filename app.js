const express = require('express')
const app = express()
const morgan = require('morgan')
const usersRoutes = require('./routes/users')


app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*')
	res.header(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept, Authorization'
	)
	if (req.method === 'OPTIONS') {
		res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
		return res.status(200).json({})
	}
	next()
})
app.use(morgan('dev'))

app.use('/users',usersRoutes)

module.exports = app
