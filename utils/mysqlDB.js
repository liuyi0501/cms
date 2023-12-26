let mysql = require('mysql');

const {mysqlConfig} = require("../config/db")

const mysql_client = mysql.createConnection(mysqlConfig);

// 连接到数据库
mysql_client.connect((error) => {
  if (error) {
    console.error('无法连接到数据库:', error);
  } else {
    console.log('已成功连接到数据库');
  }
});

mysql = {}

mysql.query = (query, params = []) => {
  return new Promise((resolve) => {
    mysql_client.query(query, params, (error, results) => {
      resolve(results);
    });
  });
}


/*
Table
	
    CREATE TABLE IF NOT EXISTS images (
      id INT PRIMARY KEY AUTO_INCREMENT,
      prompt TEXT NOT NULL,
      steps INT NOT NULL,
      width INT NOT NULL,
      height INT NOT NULL,
      sampler VARCHAR(255) NOT NULL,
      cfg_scale FLOAT NOT NULL,
      url VARCHAR(255) NOT NULL,
      seed VARCHAR(20) NOT NULL,
      subseed VARCHAR(20) NOT NULL,
      author VARCHAR(255) NOT NULL,
      ckpt VARCHAR(255) NOT NULL,
      controlnet TEXT NOT NULL,
      share BOOLEAN NOT NULL,
      type VARCHAR(255) NOT NULL,
      negative_prompt TEXT,
      conclusionType VARCHAR(255),
      status BOOLEAN,
      ip VARCHAR(255) NOT NULL,
      INDEX (status)
    )
    
    CREATE TABLE users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255) NOT NULL,
      password VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      temp_key VARCHAR(255)
    );
	
	
	CREATE TABLE articles (
	  id INT AUTO_INCREMENT PRIMARY KEY,
	  title VARCHAR(255) NOT NULL,
	  content TEXT,
	  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	);
*/


module.exports = mysql;
