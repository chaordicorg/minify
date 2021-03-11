/*
 * minifyset.loader.js
 */

var localhost = "localhost";



var host = document.domain;



// -- CSSのローダー
var appendCSS = function(URL){
	var el = document.createElement('link');
	el.href = URL;
	el.rel = 'stylesheet';
	el.type = 'text/css';
	document.getElementsByTagName('head')[0].appendChild(el);	// HEAD要素の最後に追加
}


// -- JSのローダー
var appendJS = function(URL){
	var el = document.createElement('script');
	el.src = URL;
	document.getElementsByTagName('head')[0].appendChild(el);	// HEAD要素の最後に追加
}


// -- ローダー作成
for (var i in _minconfig.set){
	var _set = _minconfig.set[i]
	var type = _set.type

	if (type == 'css'){
		if (host == localhost){
			for (var n in _set.files){
				appendCSS(_set.files[n])
			}
		}else{
			appendCSS(_set.minify)
		}

	}else if (type == 'js'){
		if (host == localhost){
			for (var n in _set.files){
				document.write('<script type="text/javascript" src="' + _set.files[n] + '"></script>');
			}
		}else{
			document.write('<script type="text/javascript" src="' + _set.minify + '"></script>');
			// appendJS(_set.minify)
		}
	}

}