var mysql = require("../utils/mysqlDB.js")
exports.checkLogin = (req, res, next)=>{
	const tempKey = req.cookies.temp_key; // 获取 temp_key
	const userId = req.cookies.id;
	// 在数据库中验证 temp_key
	const VERIFY_TEMP_KEY_QUERY = 'SELECT * FROM users WHERE id = ? AND temp_key = ?';
	mysql.query(VERIFY_TEMP_KEY_QUERY, [userId, tempKey]).then((results) => {
	    if (results.length > 0) {
			res.locals.isLogged = true
			next();
	    } else {
			res.locals.isLogged = false
			console.log("重定向到"+req.originalUrl);
			res.redirect('/login?redirect='+encodeURIComponent(req.originalUrl));
	    }
	  });
}

exports.checkLoginResult = async (req)=>{
	return await new Promise(resolve=>{
		const tempKey = req.cookies.temp_key; // 获取 temp_key
		const userId = req.cookies.id;
		// 在数据库中验证 temp_key
		const VERIFY_TEMP_KEY_QUERY = 'SELECT * FROM users WHERE id = ? AND temp_key = ?';
		mysql.query(VERIFY_TEMP_KEY_QUERY, [userId, tempKey]).then((results) => {
		    if (results.length > 0) {
				resolve(true)
		    } else {
				resolve(false)
		    }
		});
	})
}