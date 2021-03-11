$(function(){
	/*
	 * json読み込み
	 */

	$.ajax({
		url: './assets/php/get-json.php',
		type: 'POST',
		dataType: 'json'

	}).done(function(_json){
		_result = JSON.parse(JSON.stringify(_json.feed.results));

		// -- ブロック
		var count = 0;
		_result.forEach(function(_obj){
			_obj.genre = "";
			_obj.genres.forEach(function(_genre){
				_obj.genre  += '<a href="'
							+ _genre.url
							+ '" target="_blank" class="btn btn-warning btn-sm small">'
							+ _genre.name
							+ '</a>' + "\n";
			});
			count++;

			$('#result-block').clone_blocks({
				'item':[
					['src',  '.artwork',  _obj.artworkUrl100],
					['href', '.url', 	  _obj.url],
					['html', '.music a',  _obj.name],
					['href', '.artist a', _obj.artistUrl],
					['html', '.artist a', _obj.artistName],
					['html', '.genre',    _obj.genre],
					['html', '.count',    count]
				],
				'display': 'block',
				'callback': function($blk){
					$blk.animate({opacity: 1}, {duration: 1000, easing: 'swing'});
				}
			})
		});

	}).fail(function(data){
		console.error(data);
	});


});