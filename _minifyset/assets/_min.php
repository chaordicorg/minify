<?php
require_once './minify/src/Minify.php';
require_once './minify/src/CSS.php';
require_once './minify/src/JS.php';
require_once './minify/src/Exception.php';
require_once './minify/src/Exceptions/BasicException.php';
require_once './minify/src/Exceptions/FileImportException.php';
require_once './minify/src/Exceptions/IOException.php';
require_once './path-converter/src/ConverterInterface.php';
require_once './path-converter/src/Converter.php';

$contents_root = $_POST['contents_root'];
$_json = $_POST['json'];

chdir('../'.$contents_root);
$root_path = getcwd();

use MatthiasMullie\Minify;

	chdir($root_path);

	$base = rtrim($_json["base"], '/');
	chdir($base);

	foreach ($_json["set"] as $_){

		if ($_['type'] == 'css'){
			$minifier = new Minify\CSS();

			foreach ($_['files'] as $file){
				$minifier->add($file);
			}

			// -- * minifyファイルの出力 * --//
			$minify = $_['minify'];
			$minifier->minify($minify);

		}else if ($_['type'] == 'js'){
			$minifier = new Minify\JS();

			foreach ($_['files'] as $file){
				$minifier->add($file);
			}

			// -- * minifyファイルの出力 * --//
			$minify = $_['minify'];
			$minifier->minify($minify);

		}
	}
// }

print '{"respons": "OK"}';


?>
