<?php
/*
 * get-json.php
 */

$url = "https://rss.itunes.apple.com/api/v1/jp/itunes-music/top-songs/all/100/explicit.json";
$json = file_get_contents($url);
$json = mb_convert_encoding($json, 'UTF8', 'ASCII,JIS,UTF-8,EUC-JP,SJIS-WIN');

echo($json);

?>