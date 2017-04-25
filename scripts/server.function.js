function fn = {
	this.result: function (str, status, msg) {
		socket.emit('loginStatus', {
			status: 0,
			msg: '登录成功啦!~ 开始聊天吧!~'
		})
	}
}

module.exports = fn