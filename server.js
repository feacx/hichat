const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const fs = require('fs');

app.use(express.static('static'));

app.get('/', function (req, res) {
	res.sendFile(__dirname + '/views/index.html')
})

let users = []

io.on('connection', function (socket) {
	// 收到用户发来的登录请求
	socket.on('disconnect', function () {
		// 如果用户名不为空, 为后面缓存做准备
		if (socket.uName != null) {
			io.emit('leaveRoom', socket.uName)
			fnGlobal.removeByValue(users, socket.uName);
		}
	})
	// 登录事件
	socket.on('login', (n) => {
		// 若用户名已经存着
		if (users.indexOf(n) != -1) {
			socket.emit('loginStatus', {
				status: 1
			})
		} else {
			socket.uName = n
			socket.uIndex = users.push(n)
			socket.emit('loginStatus', {
				status: 0
			})
			// 通知所有用户
			io.emit('system', n)
		}
		// 显示所有用户列表
		console.log(users)
	})
	socket.on('newMessage', (data) => {
		io.emit('getMessage', {
			msg: data,
			name: socket.uName
		})
	})
})

var fnGlobal = {
	removeByValue: (arr, val) => {
		for(var i=0; i<arr.length; i++) {
			if(arr[i] == val) {
				arr.splice(i, 1);
				break;
			}
		}
	}
}

http.listen(9999, function (e) {
	console.log('listening on *:9999')
})