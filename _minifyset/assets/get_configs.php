<?php
$contents_root = $_POST['contents_root'];

$dir = '../'.$contents_root.'/';

$result = list_files($dir);

$_configs = [];
foreach ($result as $key => $path) {
    $file = basename($path);
    if ($file == 'minifyset.config.js'){
        $path = str_replace('\\', '/', $path);
        array_push($_configs, $path);
    }
}

header("Content-Type: text/javascript; charset=utf-8");
echo json_encode($_configs,JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES|JSON_PRETTY_PRINT);


/*
 * [PHP]多階層ディレクトリ内のファイル一覧を取得する
   https://php-archive.net/php/file-tree/
 */
function list_files($dir){
    $list = array();
    $files = scandir($dir);
    foreach($files as $file){
        if($file == '.' || $file == '..'){
            continue;
        } else if (is_file($dir . $file)){
            $list[] = $dir . $file;
        } else if( is_dir($dir . $file) ) {
            //$list[] = $dir;
            $list = array_merge($list, list_files($dir . $file . DIRECTORY_SEPARATOR));
        }
    }
    return $list;
}
?>