var express = require('express');
var router = express.Router();
var { websiteData } = require("../config/data.js");
var mysql = require("../utils/mysqlDB.js")
var uuid = require('uuid');
var { render } = require("../utils/common.js")
/* GET home page. */
router.get('/', function(req, res, next) {
  render(req, res, 'index', { title: websiteData.title });
});
router.get('/login', (req, res)=>{
	var redirect = req.query.redirect;
	var error = req.query.error?req.query.error:0;
	
	errorList = [
		0, // 0
		"Invailed Username or Password", // 1
	]
	
	render(req, res, 'login', { 
		title: websiteData.title,
		error: errorList[error],
		redirect: redirect?redirect:'/'
	});
})

router.get('/register', (req, res)=>{
	var redirect = req.query.redirect;
	render(req, res, 'register', { 
		title: websiteData.title,
		error: 0,
		redirect: redirect?redirect:'/'
	});
})

router.get('/logout', (req, res) => {
  res.clearCookie('id');
  res.clearCookie('temp_key');
 // 可以添加其他清除操作，比如将用户从数据库登出
  res.redirect('/'); // 重定向到登录页或其他页面
});

router.post('/login', (req, res)=>{
	
	var { username, password, redirect} = req.body;
	if(!username || !password){
		render(req, res, 'login', { 
			title: websiteData.title,
			error: 1
		});
		return;
	}
	if( !redirect ){
		redirect = '/'
	}
	// 查询数据库中是否有匹配的用户名和密码
	const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
	mysql.query(query, [username, password]).then((results) => {
	    if (results.length == 1) {
			// 登录成功
			const tempKey = uuid.v4();
			const userId = results[0].id;
			const INSERT_TEMP_KEY_QUERY = 'UPDATE users SET temp_key = ? WHERE id = ?';
			mysql.query(INSERT_TEMP_KEY_QUERY, [tempKey, userId]).then((results) => {
				// 将临时密钥作为 Cookie 返回给用户
				res.cookie('id', userId, { httpOnly: true });
				res.cookie('temp_key', tempKey, { httpOnly: true });
				res.redirect(redirect);
			});
	    } else {
			res.redirect(req.originalUrl+"?error=1&"+"redirect="+encodeURIComponent(redirect));
		}
	}).catch(console.error)
})
router.post('/register', (req, res)=>{
	var { username, password, email, redirect} = req.body;
	if(!username || !password || !email){
		render(req, res, 'register', { 
			title: websiteData.title,
			error: 1
		});
		return;
	}
	if( !redirect ){
		redirect = '/'
	}
	// 在这里执行向数据库插入数据的操作
	const INSERT_USER_QUERY = 'INSERT INTO users (username, password, email) VALUES (?, ?, ?)';
	mysql.query(INSERT_USER_QUERY, [username, password, email]).then((results) => {
		const tempKey = uuid.v4();
	    const userId = results.insertId;
	    const INSERT_TEMP_KEY_QUERY = 'UPDATE users SET temp_key = ? WHERE id = ?';
	    mysql.query(INSERT_TEMP_KEY_QUERY, [tempKey, userId]).then((results) => {
	    	// 将临时密钥作为 Cookie 返回给用户
	    	res.cookie('id', userId, { httpOnly: true });
	    	res.cookie('temp_key', tempKey, { httpOnly: true });
	    	res.redirect(redirect);
	    });
	});
})
module.exports = router;
