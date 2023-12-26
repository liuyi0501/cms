var cheerio = require('cheerio');
var Jimp = require('jimp');
var { checkLoginResult } = require('../middleware/checkLogin.js')
exports.render = async (req, res, mob, data={})=>{
	data['isLogged'] = await checkLoginResult(req)
	res.render(mob, data);
}

exports.imageFormat = async (filePath)=>{
	var config = {//w,h
		thumb:[384, 216],
		small:500,
		medium:800,
		large:2000
	}
	return await new Promise((resolve)=>{
		Jimp.read("./public/"+filePath)
			.then(async image => {
				// Large
				const resizedLarge = image.clone().scaleToFit(config.large, config.large);
				await resizedLarge.write("./public/"+filePath+'_'+config.large+'.jpg'); // 保存为 JPG
				await resizedLarge.write("./public/"+filePath+'_'+config.large+'.webp'); // 保存为 WebP
		
				// Medium
				const resizedMedium = image.clone().scaleToFit(config.medium, config.medium);
				await resizedMedium.write("./public/"+filePath+'_'+config.medium+'.jpg'); // 保存为 JPG
				await resizedMedium.write("./public/"+filePath+'_'+config.medium+'.webp'); // 保存为 WebP
				
				// Small
				const resizedSmall = image.clone().scaleToFit(config.small, config.small);
				await resizedSmall.write("./public/"+filePath+'_'+config.small+'.jpg'); // 保存为 JPG
				await resizedSmall.write("./public/"+filePath+'_'+config.small+'.webp'); // 保存为 WebP
				
				// Thumb
				const resizedThumb = image.clone().cover(config.thumb[0], config.thumb[1]);
				await resizedThumb.write("./public/"+filePath+'_thumb.jpg'); // 保存为 JPG
				await resizedThumb.write("./public/"+filePath+'_thumb.webp'); // 保存为 WebP
				resolve([{
					url: filePath+'_thumb.jpg',
					width: config.thumb[0],
					format: 'jpg'
				},{
					url: filePath+'_'+config.large+'.jpg',
					width: config.large,
					format: 'jpg'
				},{
					url: filePath+'_'+config.medium+'.jpg',
					width: config.medium,
					format: 'jpg'
				},{
					url: filePath+'_'+config.small+'.jpg',
					width: config.small,
					format: 'jpg'
				},{
				  	url: filePath+'_'+config.large+'.webp',
				  	width: config.large,
				  	format: 'webp'
				},{
				  	url: filePath+'_'+config.medium+'.webp',
				  	width: config.medium,
				  	format: 'webp'
				},{
				  	url: filePath+'_'+config.small+'.webp',
				  	width: config.small,
				  	format: 'webp'
				},{
					url: filePath+'_thumb.webp',
					width: config.thumb[0],
					format: 'webp'
				}])
			})
			.catch(err => {
				console.error(err);
			});
	})
}
exports.format = (code, message, data)=>{
    return {
        code: code,
        message: message,
        data:data?data:undefined
    }
}
exports.getThumb = (html)=>{
	// 使用 cheerio 加载 HTML
	var $ = cheerio.load(html);
	
	// 获取第一个 <img> 标签的 src 属性
	var firstImgSrc = $('img').first().attr('src');
	
	return firstImgSrc;
}
exports.getSummary = (html)=>{
	const $ = cheerio.load(html);
	
	// 获取除去图片、视频等元素后的纯文本内容
	const textContent = $.root().text().slice(0, 120); // 截取前 120 个字符
	
	return textContent;
}