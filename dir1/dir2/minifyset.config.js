/*
 * minifyset.config.js
 */

var _minconfig = {
	"set":[
		{
			// -- 読み込むCSSファイル
			"type": "css",
			"files":[
				"../../common/lib/highlightjs-railscasts.min.css",
				"../../common/lib/bootstrap-4.5.3.css",
				"../../common/css/common.css",
				"./assets/css/dir2.css",
			],
			"minify": "./assets/css/dir2.min.css" // minify化したCSSファイルの出力先
		},
		{
			// -- 読み込むJSファイル
			"type": "js",
			"files":[
				"../../common/lib/jquery-3.6.0.js",
				"../../common/lib/bootstrap-4.5.3.js",
				"../../common/lib/highlight.min.js",
				"../../common/lib/jquery.clone_blocks.js",
				"../../common/lib/jquery.inview.min.js",
				"./assets/js/dir2.js",
			],
			"minify": "./assets/js/dir2.min.js"	// minify化したJSファイルの出力先
		}
	]
}