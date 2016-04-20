<?php
ini_set("auto_detect_line_endings", "1");

function getList() {
	$list = array();

	$fp = fopen("inventory_db.csv", "r") or die("Can't open file 'inventory_db.csv'...");

	while (!feof($fp)) {
		$line = fgetcsv($fp, 1024);
		$list[] = array("title" => $line[0], "file" => $line[1], "stock" => intval($line[2]), "price" => $line[3] );
	}

	fclose($fp) or die("Can't close file 'inventory_db.csv'...");

	return $list;
}

echo json_encode(getList());

?>