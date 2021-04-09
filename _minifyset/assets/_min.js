/*
 * _min.js
 */

// パスだけ抜き出す
var getPath = function(file){
	var elem = file.split("/");
	var str = "";
	for (var i = 0; i < elem.length-1; i++) str += elem[i] + "/";
	return str;
}

if (contents_root.substr(-1, 1) == '/') contents_root = contents_root.slice(0, -1);
console.log('contents_root = ' + contents_root);

$.ajax({
	url: "./assets/get_configs.php",
	type: 'POST',
	dataType: 'json',
	data:{
		'contents_root': contents_root,
	},
	success: function(_conf) {

		for (var i in _conf){
			var base_path = getPath(_conf[i]);
			base_path = './' + base_path.replace(/\.\.\//g, "").replace(/\/$/, '');
			console.log('base_path = ' + base_path);
			var path = _conf[i].replace('../', "");
			console.log('config = ' + path);

			$.ajax({
				url: path,
				type: 'POST',
				dataType: 'text',
				base_path: base_path,
				success: function(data) {
					eval(data);
					$.ajax({
						url: './assets/_min.php',
						type: 'POST',
						dataType: 'json',
						data:{
							'contents_root': contents_root,
							'base_path': this.base_path,
							'json': _minconfig,
						},
						success: function(data) {
							console.log(data);
							$('.info').html('Minify化しました');
						},
						error: function(data) {
							console.error(data);
							$('.info').html('エラーがあります');
							$('.error-3').html(data.responseText);
						}
					});

				},
				error: function(data) {
					console.error(data);
					$('.info').html('エラーがあります');
					$('.error-2').html(data.responseText);
				}
			});

		}


	},
	error: function(data) {
		console.error(data);
		$('.info').html('エラーがあります');
		$('.error-1').html(data.responseText);
	}



});