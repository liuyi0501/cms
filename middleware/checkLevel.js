var mysql = require("../utils/mysqlDB.js")
exports.checkLevel = async (req)=>{
	/// 函数
	///
	///
	///
	return await new Promise(resolve=>{
		const tempKey = req.cookies.temp_key; // 获取 temp_key
		const userId = req.cookies.id;
		// 在数据库中验证 temp_key
		const VERIFY_TEMP_KEY_QUERY = 'SELECT * FROM users WHERE id = ? AND temp_key = ?';
		mysql.query(VERIFY_TEMP_KEY_QUERY, [userId, tempKey]).then((results) => {
		    if (results.length > 0) {
				resolve(results[0].level?results[0].level:0)
		    } else {
				resolve(0)
		    }
		});
	})
}