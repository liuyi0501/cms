var express = require('express');
var router = express.Router();
var { websiteData } = require("../config/data.js");
var mysql = require("../utils/mysqlDB.js")
var { checkLogin } = require('../middleware/checkLogin.js');
var { checkLevel } = require('../middleware/checkLevel.js');
var { getSummary, getThumb, render } = require("../utils/common.js")
// 显示所有文章
router.get('/', (req, res) => {
	const ITEMS_PER_PAGE = 10; // 每页显示的文章数

	const page = req.query.page || 1; // 从 URL 参数中获取当前页码，默认为第一页
	
	  // 查询文章总数
	mysql.query('SELECT COUNT(*) AS total FROM articles WHERE status = "Readable"').then((countResult) => {

	      const totalArticles = countResult[0].total;
	      const totalPages = Math.ceil(totalArticles / ITEMS_PER_PAGE); // 总页数
	
	      // 计算起始索引
	      const startIndex = (page - 1) * ITEMS_PER_PAGE;
	
	      // 查询当前页的符合条件的文章
	      mysql.query('SELECT * FROM articles WHERE status = "Readable" ORDER BY id DESC LIMIT ?, ?',[startIndex, ITEMS_PER_PAGE]).then((results) => {
			  render(req, res, 'articles', {
	            articles: results,
	            currentPage: page,
	            totalPages: totalPages
	          })
	        }
	      );
	    }
	  );
	
	
  // const SELECT_ALL_ARTICLES = 'SELECT * FROM articles ORDER BY id DESC';
  // mysql.query(SELECT_ALL_ARTICLES).then((results) => {
  //   res.render('articles', { articles: results }); // 渲染包含所有文章的页面
  // });
});

// 显示单篇文章
router.get('/:id(\\d+)', (req, res) => {
  const articleId = req.params.id;
  const SELECT_ARTICLE_BY_ID = 'SELECT * FROM articles WHERE id = ?';
  mysql.query(SELECT_ARTICLE_BY_ID, [articleId]).then((results) => {

    render(req, res, 'articleDetail', { article: results[0] }); // 渲染单篇文章的页面
  });
});

// 创建文章页面
router.get('/create', [checkLogin], (req, res) => {
	render(req, res, "createArticle");
});

// 创建文章
router.post('/create', [checkLogin], async (req, res) => {
  var { title, content, type, category, thumb, summary} = req.body;
  if ( !thumb ){
	  thumb = getThumb(content);
  }
  if ( !summary ){
	  summary = getSummary(content);
  }
  if( await checkLevel(req) > 5 ){
	  status = "Readable"
  } else {
	  status = "UnderReview"
  }
  var author = req.cookies.id;
  const INSERT_ARTICLE = 'INSERT INTO articles (title, author, content, type, category, status, summary, thumb) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
  mysql.query(INSERT_ARTICLE, [title, author, content, type, category, status, summary, thumb]).then((results) => {
    res.redirect('/articles'); // 创建成功后重定向到文章列表
  });
});

// 删除文章
router.post('/delete/:id', [checkLogin], (req, res) => {
  const articleId = req.params.id;
  const DELETE_ARTICLE = 'UPDATE articles SET status = ? WHERE id = ?';
  mysql.query(DELETE_ARTICLE, ["Deleted", articleId]).then((results) => {
    res.redirect('/articles'); // 删除成功后重定向到文章列表
  });
});

// 编辑文章页面
router.get('/edit/:id', [checkLogin], (req, res) => {
  const articleId = req.params.id;
  const SELECT_ARTICLE_BY_ID = 'SELECT * FROM articles WHERE id = ?';
  mysql.query(SELECT_ARTICLE_BY_ID, [articleId]).then((results) => {
    render(req, res, 'editArticle', { article: results[0] }); // 渲染编辑文章的页面
  });
});

// 更新文章
// 更新文章
router.post('/edit/:id', [checkLogin], (req, res) => {
  const articleId = req.params.id;
  var { title, content, type, category, thumb, summary} = req.body;
  if ( !thumb ){
  	  thumb = getThumb(content);
  }
  if ( !summary ){
  	  summary = getSummary(content);
  }
  const UPDATE_ARTICLE = 'UPDATE articles SET title = ?, content = ?, type = ?, category = ?, summary = ?, thumb = ? WHERE id = ?';
  mysql.query(UPDATE_ARTICLE, [title, content, type, category, summary, thumb, articleId]).then((results) => {
    res.redirect(`/articles/${articleId}`); // 更新成功后重定向到单篇文章页面
  });
});

module.exports = router;
