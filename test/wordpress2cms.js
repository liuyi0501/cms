const mysql = require('../utils/mysqlDB.js')
const fs = require('fs')
var { getSummary, getThumb, render } = require("../utils/common.js")
var sql = fs.readFileSync('./test/wp_posts.json');

sql = JSON.parse(sql)

var posts = sql[2].data
console.log(posts[0])

async function runIt(i){
	item = posts[i]
	if(!item){
		await runIt(i+1);
		return;
	} else if( !item.post_status ){
		await runIt(i+1);
		return;
	} else if ( item.post_status != 'publish'){
		await runIt(i+1);
		return;
	}else {
		title = item.post_title
		content = item.post_content
		type = 'article'
		category = 'anime'
		thumb = undefined
		summary = undefined
		status = "Readable"
		author = 0
		if ( !thumb ){
			  thumb = getThumb(content);
		}
		if ( !summary ){
			  summary = getSummary(content);
		}
		const INSERT_ARTICLE = 'INSERT INTO articles (title, author, content, type, category, status, summary, thumb) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
		await mysql.query(INSERT_ARTICLE, [title, author, content, type, category, status, summary, thumb])
		console.log("导入成功")
		await runIt(i+1)
		return;
	}

}
runIt(0)