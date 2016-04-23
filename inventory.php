<?php
ini_set("auto_detect_line_endings", "1");

function getList() {
	$list = array();

	$fp = fopen("inventory_db.csv", "r") or die("Can't open file 'inventory_db.csv'...");

	while (!feof($fp)) {
		$line = fgetcsv($fp, 1024);
		$list[] = array("id" => $line[0], "title" => $line[1], "file" => $line[2], "stock" => intval($line[3]), "price" => $line[4] );
	}

	fclose($fp) or die("Can't close file 'inventory_inventory.csv'...");

	return $list;
}

function getUpdates($form) {
	$updates = array();

	foreach ($form as $key => $value) { // build an array of updates
		$temp = explode("_", $key);
		$id = $temp[0];
		$type = $temp[1];
		if ($type == "stock")
			$updates[$id][$type] = intval($value);
		else
			$updates[$id][$type] = floatval($value);
	}

	return $updates;
}

function updateInventory($updates) {
	$inventory = array();

	// open the file for reading
	$fp = fopen("inventory_db.csv", "r") or die("Can't open file 'inventory_db.csv' for reading...");

	while (!feof($fp)) {
		$line = fgetcsv($fp, 1024);
		$id = $line[0];
		if ($id != null) { // check if the line is not an empty line
			$line[3] = $updates[$id]["stock"];
			$line[4] = $updates[$id]["price"];
			$inventory[] = $line;
		}
	}

	fclose($fp) or die("Can't close file 'inventory_db.csv'...");


	// open the file for writing
	$fp = fopen("inventory_db.csv", "w") or die("Can't open file 'inventory_db.csv' for writing...");

	foreach ($inventory as $value) {
		fputcsv($fp, $value); // write the updated value
	}

	fclose($fp) or die("Can't close file 'inventory_db.csv'...");
}


if (count($_POST) > 0) { // if the request's method is POST
	updateInventory(getUpdates($_POST));
	header("Location: admin.html"); // redirect the user
} else {
	echo json_encode(getList());
}

?>