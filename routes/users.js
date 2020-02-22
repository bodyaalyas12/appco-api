const express = require('express')
const router = express.Router()
const fs = require('fs')

router.get('/', (req, res, next) => {
	const page = req.query.page || 1
	const itemsOnPage = req.query.itemsOnPage || 50
	const startIndex = (page - 1) * itemsOnPage
	const endIndex = page * itemsOnPage
	const userList = JSON.parse(
		fs.readFileSync('users.json', 'utf8', (err, data) => {
			if (err) throw new Error()
			try {
				console.log(data)
				const obj = JSON.parse(data)
				return data
			} catch (error) {
				console.error(error)
			}
		})
	)
		.slice(startIndex, endIndex)
		.map(item => ({
			...item,
			totalClicks: 0,
			totalViews: 0
		}))
	const userStatistics = JSON.parse(
		fs.readFileSync('users_statistic.json', 'utf8', (err, data) => {
			if (err) throw new Error()
			try {
				const obj = JSON.parse(data)
			} catch (error) {
				console.error(error)
			}
		})
	)
	const filteredStatictics = userStatistics.filter(
		item => item.user_id >= startIndex && item.user_id <= endIndex
	)
	filteredStatictics.forEach(item => {
		const elementIndex = userList.findIndex(user => user.id === item.user_id)
		if (userList[elementIndex]) {
			userList[elementIndex].totalClicks += item.clicks
			userList[elementIndex].totalViews += item.page_views
		}
	})
	res.status(200).json({
		message: 'it works.',
		userList: userList
		// filteredStatictics
	})
})

module.exports = router
