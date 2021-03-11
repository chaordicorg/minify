/*
 * jquery.clone_blocks ver 0.1.6
 * Copyright © chaordic design inc Yoshiro Akizuki. all rights reserve.
 * http://www.chaordic.co.jp
 * Released under the MIT license - http://en.wikipedia.org/wiki/MIT_License

	<section id="追加するラッパー">
		<dl class="clone-template">	※クラス「clone-template」は固定
			テンプレートHTML
		</dl>
	</section>

	$(追加するラッパー).clone_blocks({
		item: [
			[ '属性',  'セレクタ', '値' ],
			[ 'html',  'セレクタ', '値' ],
			[ 'append','セレクタ', '値' ],
			[ 'addClass','セレクタ', '値' ],
			[ 'removeClass','セレクタ', '値' ],
			[ 'css’',  'セレクタ', '値' ]	例) 'font-size:18px, color:#fff'
		],
		'display': '(block/inline/inline-block)',
		'callback': function($書き出されたDOM){
			処理
		}
	});

	※セレクタは「追加するラッパー」から

	(例)

	<section id="result-wrapper">
		<dl class="clone-template">
			<dt>名前</dt>
			<dd></dd>
		</dl>
	</section>

	<section id="result-block">
		<dl class="clone-template" style="opacity: 0">
			<dt><a href="#" class="url" target="_blank"><img src="dammy.jpg" class="artwork" /></a></dt>
			<dd>
				<ul>
					<li class="name"><a href="#" class="url" target="_blank">曲名</a></li>
					<li><a href="#" class="artist" target="_blank">アーティストネーム</a></li>
				</ul>
			</dd>
		</dl>
	</section>

	// -- ブロック
	_result.forEach(function(_obj){
		$('#result-block').clone_blocks({
			'item':[
				['src',  '.artwork', _obj.artworkUrl100],
				['href', '.url', 	_obj.url],
				['html', '.name .url', _obj.name],
				['href', '.artist', _obj.artistUrl],
				['html', '.artist', _obj.artistName],
				['append', '.name', 'appendテスト'],
			],
			'display': 'block',
			'callback': function($blk){
				$blk.animate({opacity: 1}, {duration: 1000, easing: 'swing'});	
			},
			'inview': function($this, isInView){
				if (isInView){
					$this.stop().addClass('iv-fadeup');
				}else{
					//$this.stop().removeClass('iv-fadeup');
					$this.off();
				}
			}
		})
	});

	// -- クリア
	$('#result-block').clone_blocks();
 */

$(function(){
	$('.clone-template').css('display','none');
});

(function($){

	$.fn.clone_blocks = function(options){

		if (options){
			var _opt = $.extend({
				'item': [],
				'display': 'block',
				'callback': "",
				'inview': "",
				'add': "append",
			}, options);
		}

		

		

		/*
		 * main
		 */
		return this.each(function(){
			
			/*
			 * 初期設定
			 */
			var $result = $(this);
			var $block  = $('.clone-template', $result);

			if (!_opt){

				/*
				 * クリア
				 */
				var $template = $('.clone-template', $result);
				$template.attr('data-no', '0');
				$template.attr('data-maxno', '0');

				$result.empty();
				$result.append($template);

			}else{

				/*
				 * クローン
				 */

				var $clone_block = $block.clone(false);
				$clone_block.removeClass('clone-template');
				$clone_block.css('display', _opt.display);

				// -- 値の変更
				_opt.item.forEach(function(_arr){

					var attr     = _arr[0];
					var selector = _arr[1];
					var value    = _arr[2];

					var $target = $(selector, $clone_block);
					if (attr == 'html'){

						// -- HTMLを変更する
						$target.html(value);

					}else if (attr == 'append'){

						// -- HTMLに追記する
						$target.append(value);

					}else if (attr == 'css'){

						// -- CSSを変更する
						var _css = {};
						value = value.replace(/[\"\'']/g,""); // コーテーションを削除
						value.split(',').forEach(function(val){
							var _val = val.split(':');
							_val[0] = _val[0].replace(/[ ]/g,""); // スペースを削除
							_css[_val[0]] = _val[1];
						});

						$target.css(_css);

					}else if (attr == 'addClass'){

						// -- クラスを追加する
						$target.addClass(value);

					}else if (attr == 'removeClass'){

						// -- クラスを削除する
						$target.removeClass(value);

					}else{

						// -- 属性を変更する
						$target.attr(attr, value);

					}
				});

				// -- inview
				if (typeof _opt.inview == 'function'){
					$clone_block.on('inview', function(event, isInView, visiblePartX, visiblePartY) {
						_opt.inview($(this), isInView);
					});
				}

				// -- 出力
				if (_opt.add == 'prepend'){
					$result.prepend($clone_block);
				}else if (_opt.add == 'html'){
					$result.html($clone_block);
				}else{
					$result.append($clone_block);
				}
				
				// -- コールバック
				if (typeof _opt.callback == 'function'){
					$result.ready(function(){
						_opt.callback($clone_block);
					});
				}
				
			}

			

			// return maxno;
		});
	};

})( jQuery );