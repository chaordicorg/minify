/*
 * _min.js
 */

if (contents_root.substr(-1, 1) == '/') contents_root = contents_root.slice(0, -1);
console.log(contents_root);

$.ajax({
	url: "./assets/get_configs.php",
	type: 'POST',
	dataType: 'json',
	data:{
		'contents_root': contents_root,
	},
	success: function(_conf) {

		for (var i in _conf){
			var path = _conf[i].replace(/..\//, "");
			console.log(path);

			$.ajax({
				url: path,
				type: 'POST',
				dataType: 'text',
				success: function(data) {
					eval(data);

					$.ajax({
						url: './assets/_min.php',
						type: 'POST',
						dataType: 'json',
						data:{
							'contents_root': contents_root,
							'json': _minconfig,
						},
						success: function(html) {
							console.log(html);
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