/*
 * minifyset.config.js
 */

var _minconfig = {
	"base": ".", //  対象ページからコンテンツ・ルートへの相対パス
	"set": [
		{
			// -- min化するCSSファイル
			"type": "css",
			"files":[
				"./common/lib/highlightjs-railscasts.min.css",
				"./common/lib/bootstrap-4.5.3.css",
				"./common/css/common.css",
				"./assets/css/top.css",
			],
			"minify": "./assets/css/top.min.css" // minify化したCSSファイルの出力先
		},
		{
			// -- min化するJSファイル
			"type": "js",
			"files":[
				"./common/lib/jquery-3.6.0.js",
				"./common/lib/bootstrap-4.5.3.js",
				"./common/lib/highlight.min.js",
				"./common/lib/jquery.clone_blocks.js",
				"./common/lib/jquery.inview.min.js",
				"assets/js/top.js",
			],
			"minify": "./assets/js/top.min.js"	// minify化したJSファイルの出力先
		}
	]
}