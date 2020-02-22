const express = require('express')
const router = express.Router()
const fs = require('fs')

router.get('/', (req, res, next) => {
	const page = req.query.page || 1
	const itemsOnPage = req.query.itemsOnPage || 50
	const startIndex = (page - 1) * itemsOnPage
	const endIndex = page * itemsOnPage
	const data = JSON.parse(
		fs.readFileSync('users.json', 'utf8', (err, data) => {
			if (err) throw new Error()
			try {
				const obj = JSON.parse(data)
				return data
			} catch (error) {
				console.error(error)
				res.status(500).json({
					message: 'something wrong',
					error
				})
			}
		})
	)
	const userList = data.slice(startIndex, endIndex).map(item => ({
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
		userList: userList,
		numberOfPages: data.length / itemsOnPage
	})
})

router.get('/:id', (req, res, next) => {
	const id = req.params.id
	const { startDate, endDate } = req.query
	const data = JSON.parse(
		fs.readFileSync('users.json', 'utf8', (err, data) => {
			if (err) throw new Error()
			try {
				const obj = JSON.parse(data)
				return data
			} catch (error) {
				console.error(error)
				res.status(500).json({
					message: 'something wrong',
					error
				})
			}
		})
	)
	const userInfo = data.find(item => Number(item.id) === Number(id))
	if (!userInfo) {
		res.status(500).json({
			message: 'no user found'
		})
	}
	if (startDate && endDate) {
		const userStatistic = JSON.parse(
			fs.readFileSync('users_statistic.json', 'utf8', (err, data) => {
				if (err) throw new Error()
				try {
					const obj = JSON.parse(data)
				} catch (error) {
					console.error(error)
				}
			})
		)
			.filter(item => Number(item.user_id) === Number(id))
			.filter(
				item => new Date(item.date) > new Date(startDate) && new Date(item.date) < new Date(endDate)
			)
		res.status(200).json({
			message: 'it works.',
			userInfo,
			userStatistic
		})
	} else {
		const userStatistic = JSON.parse(
			fs.readFileSync('users_statistic.json', 'utf8', (err, data) => {
				if (err) throw new Error()
				try {
					const obj = JSON.parse(data)
				} catch (error) {
					console.error(error)
				}
			})
		).filter(item => Number(item.user_id) === Number(id))
		res.status(200).json({
			message: 'it works.',
			userInfo,
			userStatistic
		})
	}
})

module.exports = router
