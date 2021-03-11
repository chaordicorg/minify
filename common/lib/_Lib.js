/*
 * _Lib
 */

var ua  = window.navigator.userAgent.toLowerCase();
var ver = window.navigator.appVersion.toLowerCase();



var _Lib = {

	/*
	 * versioin
	 */
	libversion : function(){
		return {libversion: '0.1.10'};
	},


	
	/*
	 * JSONの検索
	 */
	json_search : function(_json, key, word, flag){

		if (!Array.isArray(word)){

			// wordが変数だったら
			var _tmp = _json.filter(function(item, index){
				var skey = key.replace(/[^A-Za-z0-9_.]/g, '');
				if (!flag){
					if (item[skey] == word) return true;
				}else{
					if (item[skey].indexOf(word) >= 0) return true;
				}
			});
			return _tmp;

		}else{

			// wordが配列だったら
			var _pack = [];
			if (word.length){

				var reg_txt = word[0];
				for(var k=1; k < word.length; k++) reg_txt += '|' + word[k];
				var reg = new RegExp(reg_txt, 'i');

				var _tmp = _json.filter(function(item, index){
					if (reg.test(item[key])) return true;
				});
				_pack = _pack.concat(_tmp);

				return _pack;

			}else{

				return _json;

			}
		}
	},

	json_search2 : function(_json, key, word, flag){
		var _tmp = _json.filter(function(item, index){
			var skey = key.replace(/[^A-Za-z0-9_.]/g, '');
			if (!flag){
				if (item[skey] == word) return true;
			}else{
				if (item[skey].indexOf(word) >= 0) return true;
			}
		});
		return _tmp;
	},




	/*
	 * URLにパラメータを追加
	 */
	setUrlParam : function(arg){
		history.pushState('','',arg);
	},

	/*
	 * URLのパラメータを取得
	 */
	getUrlParam : function(arg){
		var _arg  = new Object;
		var pair = location.search.substring(1).split('&');
		for(var i=0;pair[i];i++) {
			var kv = pair[i].split('=');
			_arg[kv[0]]=kv[1];
		}

		if (arg){
			var val = decodeURIComponent(_arg[arg]);
			if (val == 'undefined') val = "";
			return val;
		}else{
			for (key in _arg){
				_arg[key] = decodeURIComponent(_arg[key]); // URLデコード
			}
			return _arg;
		}
	},

	/*
	 * 指定した引数のURLのパラメータを削除する
		_Lib.sukkiriUrl({
			arg1 : true,
			arg2 : true,
			arg3 : true
		});
	 */
	sukkiriUrl : function(args){

		/* 
		 * hisotry APIをサポートしているブラウザでのみ実行
		 */

		if (window.history && window.history.replaceState) {

			console.log('hisotry API');
			do_replaceState = false;   						// replaceStateするかどうかのフラグ
			var url,query_string,hash,matches,domain,path;	// 各種処理変数
			var queries = [];         						// replaceState時に使うquery string

			/*
			 * document.locationを使わずに自力でURL解析
			 */

			url = document.location.toString();
			if (matches = url.match(/(.+?)#(.+)/)) {
				url=matches[1];  hash=matches[2];
			}
			if (matches = url.match(/(.+?)\?(.+)/)) {
				url=matches[1];  query_string=matches[2];
			}

			/*
			 * URLにquery stringがあれば、utm系の存在をチェック
			 */

			if (query_string) {
				query_string = query_string.split(/&/);
				for (var i =0; i < query_string.length; i++) {
					var param = query_string[i].split(/=/);
					if (typeof args[param[0]] != 'undefined') {
						// argsのが1つでもあればreplaceStateフラグをオンに
						do_replaceState = true;
					}
					else {
						// argsになければreplaceState後のURLにも必要
						queries.push(query_string[i]);
					}
				}
			}

			/*
			 * argsのパラメータがあれば、それを除いたURLにreplaceState
			 */ 
			if (do_replaceState) {
				// replaceState先の指定
				if (queries.length) url += '?' + queries.join("&");
				if (hash) 			url += '#' + hash;
				
				// replaceState
				history.replaceState('', '', url);
			}

		}
	},

	/*
	 * 最低限のサニタイズ
	 * 「<」「>」「&」「'」「"」をサニタイズ。
	 */ 
	sanitaize_enc : function(str){
		if (str) return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
	},

	sanitaize_dec : function(str){
		if (str) return str.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, '\'').replace(/&amp;/g, '&');
	},


	
	/*
	 * 相対パスから絶対パスに変換
	 */
	absolutePath : function(path) {
		var e = document.createElement('span');
		e.insertAdjacentHTML('beforeend', '<a href="' + path + '" />');
		var aurl = e.firstChild.href;
		// aurl = aurl.replace(location.protocol + '//' + location.host, "");
		return aurl;
	},



	/*
	 * JSONで簡単なテンプレート
	 */
	jtpl : function(_json,selector) {
		for (var key in _json){
			$(selector + ' [data-jtpl=' + key + ']').html(_json[key]);
		}
	},



	/*
	 * スクロール
	 */
	scrollTgt : function(speed, tgt, offset){
		if (!offset) offset = 0;
		var position = $(tgt).offset().top + offset;
		// console.log('tgt = ' + tgt + ' : position = ' + position);
		$("html, body").animate({scrollTop:position}, speed, "swing");
		return false;
	},



	/*
	 * デバイスの情報をまとめる
	 */
	get_ua : function(){

		var startTime = new Date();

		/*
		 * isAndroidBrowser
		 */
		var isAndroidBrowser = function(ua){
			var androidBrowser = false;
			if (/android/.test(ua) && /linux; u;/.test(ua) && !/chrome/.test(ua)) {
				androidBrowser = true
			}
			return androidBrowser;
		}

		var uaset = {
			browser:false,
			ver:false,
			dev:'pc',
			sw:window.screen.width,
			sh:window.screen.height,
			ua:ua,
			exectime:0
		}

		/*
		 * 一般的なブラウザ判定
		 */

		if 		(ua.indexOf('msie')		 != -1){ uaset.browser = 'ie';		}
		else if (ua.indexOf('opr')	 	 != -1){ uaset.browser = 'opera';	}
		else if (ua.indexOf('chrome')	 != -1){ uaset.browser = 'chrome';	}
		else if (ua.indexOf('firefox')	 != -1){ uaset.browser = 'firefox';	}
		else if (ua.indexOf('safari')	 != -1){ uaset.browser = 'safari';	}
		else if (ua.indexOf('trident/7') != -1){ uaset.browser = 'ie'; uaset.ver = 11; }
		else if (ua.indexOf('edge')		 != -1){ uaset.browser = 'edge';	}

		// chromeのバージョン
		if (uaset.browser == 'chrome'){
			cutSt = ua.indexOf("chrome");
			cutEd = ua.indexOf(" ", cutSt);
			uaset.ver = ua.substring(cutSt + 7, cutEd);

		// safariのバージョン
		}else if (uaset.browser == 'safari'){
			cutSt = ua.indexOf("version");
			cutEd = ua.indexOf(" ", cutSt);
			uaset.ver = ua.substring(cutSt + 8, cutEd);

		// IEのバージョン
		}else if (uaset.browser == 'ie'){
			if 		(ver.indexOf("msie 6.")  != -1){ uaset.ver = 6;  }
			else if (ver.indexOf("msie 7.")  != -1){ uaset.ver = 7;  }
			else if (ver.indexOf("msie 8.")  != -1){ uaset.ver = 8;  }
			else if (ver.indexOf("msie 9.")  != -1){ uaset.ver = 9;  }
			else if (ver.indexOf("msie 10.") != -1){ uaset.ver = 10; }

		// Firefoxのバージョン
		}else if (uaset.browser == 'firefox'){
			cutSt = ua.indexOf("firefox");
			cutEd = ua.length;
			uaset.ver = ua.substring(cutSt + 8, cutEd);

		// Operaのバージョン
		}else if (uaset.browser == 'opera'){
			cutSt = ua.indexOf("opr");
			cutEd = ua.length;
			uaset.ver = ua.substring(cutSt + 4, cutEd);
		}

		if (isAndroidBrowser(ua)) uaset.browser = 'androidbrowser';

		/*
		 * デバイスを判別
		 */
		// console.log(ua);
		if (ua.indexOf('iphone') > 0 || ua.indexOf('ipod') > 0 || ua.indexOf('android') > 0 && ua.indexOf('mobile') > 0){
			uaset.dev = 'sp';
		}else if (ua.indexOf('ipad') > 0 || ua.indexOf('android') > 0){
			uaset.dev = 'tab';
		}

		/*
		 * OSを特定
		 */

		if 		(ua.match(/win(dows )?nt 10\.0/)) 		{ uaset.os = "Windows 10"; }
		else if (ua.match(/win(dows )?nt 6\.3/)) 		{ uaset.os = "Windows 8.1"; }
		else if (ua.match(/win(dows )?nt 6\.2/)) 		{ uaset.os = "Windows 8"; }
		else if (ua.match(/win(dows )?nt 6\.1/)) 		{ uaset.os = "Windows 7"; }
		else if (ua.match(/win(dows )?nt 6\.0/)) 		{ uaset.os = "Windows Vista"; }
		else if (ua.match(/win(dows )?nt 5\.2/))		{ uaset.os = "Windows Server 2003"; }
		else if (ua.match(/win(dows )?(nt 5\.1|XP)/)) 	{ uaset.os = "Windows XP"; }
		else if (ua.match(/win(dows)? (9x 4\.90|ME)/)) 	{ uaset.os = "Windows ME"; }
		else if (ua.match(/win(dows )?(nt 5\.0|2000)/)) { uaset.os = "Windows 2000"; }
		else if (ua.match(/win(dows )?98/)) 			{ uaset.os = "Windows 98"; }
		else if (ua.match(/win(dows )?nt( 4\.0)?/)) 	{ uaset.os = "Windows NT"; }
		else if (ua.match(/win(dows )?95/)) 			{ uaset.os = "Windows 95"; }
		else if (ua.match(/iphone|ipad/)){

			uaset.os = "iOS";
			if (ua.match(/(iphone|cpu) os ([\d_]+)/)) {
				uaset.os = "iOS " + RegExp.$2;
				uaset.os = uaset.os.replace(/_/g, ".");
			}

		}else if (ua.match(/mac|ppc/)) {
			uaset.os = "Mac OS";
			if (ua.match(/os x|msie 5\.2/)) {
				if (ua.match(/mac os X ([\.\d_]+)/)) {
					uaset.os = "Mac OS X " + RegExp.$1;
					uaset.os = uaset.os.replace(/_/g, ".");
				}else {
					uaset.os = "Mac OS X";
				}
			}else {
				uaset.os = "Mac OS";
			}

		}
		else if (ua.match(/android ([\.\d]+)/)) 	{uaset.os = "Android " + RegExp.$1;}
		else if (ua.match(/linux/)) 			 	{uaset.os = "Linux";}
		else if (ua.match(/^.*\s([A-Za-z]+BSD)/)) 	{uaset.os = RegExp.$1;	}
		else if (ua.match(/sunos/)) 				{uaset.os = "Solaris";}
		else { uaset.os = "N/A";}

		/*
		 * 実行時間
		 */
		var endTime = new Date();
		uaset.exectime = (endTime - startTime) + 'msec';

		return uaset;
	},



	/*
	 * 指定の画像のすべてが読み込まれたら
	 *
	(例)
		_Lib.imageReady({
			"selector":"img.image-ready",
			"all_loaded": function(){
				alert('all_loaded!')
			}
		})
	*/
	
	imageReady : function(_opt){
		var $imgs = $("img");
		if (_opt.selector) $imgs = $(_opt.selector);
		var imgs_count = $imgs.length;
		var comp_count = 0;

		for(var i=0; i < imgs_count; i++){
			$imgs[i].originSrc = $imgs[i].src;
			$imgs[i].src = "";

			$($imgs[i]).bind("load", function(){
				comp_count ++;
				if (imgs_count == comp_count){
					_opt.all_loaded();
				}
			});

			$imgs[i].src = $imgs[i].originSrc;
		}
	},

	/*
	 * 電話番号/メール/URLをリンクに変換
	 */
	convert2link : function(str){
		// 電話番号だと思われる文字列を抽出
		var phone_array = str.match( /\+?[0-9]+[\-\x20]?[0-9]+[\-\x20]?[0-9]+[\-\x20]?[0-9]+/g );
		var cursor = 0;
		for (var i=0; phone_array != null && i < phone_array.length; i++){

			// ハイフンとスペースを削除
			var tmp = phone_array[i];
			tmp = tmp.replace( /[\-\x20]/g, '' );
			if (tmp.length < 10){
				// 10桁未満は電話番号とみなさない
				continue;
			}

			// aタグ文字列を生成
			var tag_a = '<a href="tel:' + tmp + '">' + phone_array[i] + '</a>';

			// 置換する電話番号の出現位置を取得
			var start = str.indexOf( phone_array[i], cursor );

			// 出現した電話番号を置換
			str = str.slice( 0, start ) + tag_a + str.slice( start + phone_array[i].length );
			cursor = start + tag_a.length;
		}

		var re_url = /((ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?)/gi;
		var re_mail = /((?:\w+\.?)*\w+@(?:\w+\.)+\w+)/gi;

		str = str.replace(re_url, '<a href="$1" target="_blank" target="_blank">$1</a>' );
		str = str.replace(re_mail, '<a href="mailto:$1">$1</a>');

		return str;
	},


	/*
	 * テキストカーソルの位置にテキストを挿入
	 */
	insertText_textarea: function(textarea, word){
		var textarea = document.querySelector('textarea');
		var sentence = textarea.value;
		var len      = sentence.length;
		var pos      = textarea.selectionStart;
		var before   = sentence.substr(0, pos);
		var after    = sentence.substr(pos, len);

		textarea.value = before + word + after;
	},


	 /*
	  * URLから拡張子を得る
	  */
	get_ext : function(url){
		// console.log('url = ' + url);
		return url.split(/\#\|\?/)[0].split('.').pop().trim();
	},






	/*
	 * -- svgをインラインに変換
	 */
	img2svg: function(selector){
		$(selector).each(function(){
			var $img = $(this);
			var imgID = $img.attr('id');
			var imgClass = $img.attr('class');
			var imgURL = $img.attr('src');

			$.get(imgURL, function(data) {
				// Get the SVG tag, ignore the rest
				var $svg = $(data).find('svg');

				// Add replaced image's ID to the new SVG
				if(typeof imgID !== 'undefined') {
					$svg = $svg.attr('id', imgID);
				}
				// Add replaced image's classes to the new SVG
				if(typeof imgClass !== 'undefined') {
					$svg = $svg.attr('class', imgClass+' replaced-svg');
				}

				// Remove any invalid XML tags as per http://validator.w3.org
				$svg = $svg.removeAttr('xmlns:a');

				// Check if the viewport is set, if the viewport is not set the SVG wont't scale.
				if(!$svg.attr('viewBox') && $svg.attr('height') && $svg.attr('width')) {
					$svg.attr('viewBox', '0 0 ' + $svg.attr('height') + ' ' + $svg.attr('width'))
				}

				// Replace image with new SVG
				$img.replaceWith($svg);

			}, 'xml');

		});
	},


	/**
	* jQueryを使わずにJSONを読み込む
	*/
	requestJSON: function(path, callback){
		var httpRequest = new XMLHttpRequest();
		httpRequest.overrideMimeType('text/xml');

		// キャッシュ対策
		path += "?" + Math.random();

		httpRequest.open('GET', path, true);
		httpRequest.onreadystatechange = function (e){
			var httpRequest = e.target;
			if(httpRequest.readyState == 4) {
				if(httpRequest.status == 200 || httpRequest.status == 201) {
					var json = httpRequest.responseText;
					var obj = JSON.parse(json);//<-目的のオブジェクト
					callback(obj);
				} else {
					console.error("通信エラー");
				}
			}
		};
		httpRequest.send(null);
	},

	/*
	 * 外部アセットをロードする
	 */
	load_assets : function(_assets){

		for (var i in _assets.css){
			var href = _assets.css[i];
			document.write('<link rel="stylesheet" media="screen" href="' + href + '">');
		}

		// -- js
		for (var i in _assets.js){
			var src = _assets.js[i];
			document.write('<script type="text/javascript" src="' + src + '"></script>');
		}


	},

	/*
	 * assetsをインクルード
	 */
	include_assets : function(jsonfile){

		var host = document.domain;

		_Lib.requestJSON(jsonfile, function(_set){
			if (host == _set[0].host){
				_Lib.load_assets(_set[0].files);
			}else if (host == _set[1].host){
				_Lib.load_assets(_set[1].files);
			}
		});

	},




}