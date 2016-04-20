function init() {
	var listContent = document.getElementById("list");
	displayList(listContent);
}

function displayList(listContent) {
	var xhr = new XMLHttpRequest();

	xhr.open("GET", "inventory.php");

	xhr.addEventListener("readystatechange", function() {
		if (xhr.readyState == 4 && xhr.status == 200) {
			processListData(xhr.responseText, listContent);
		} else if (xhr.readyState == 4) {
			listContent.innerHTML = "Error " + xhr.status + ".";
		}
	}, false);

	xhr.send();
}
function processListData(data, listContent) {
	var formatedData = ""; // HTML formated data

	data = JSON.parse(data);

	for (var i = 0, length = data.length; i < length; i++) {
		console.log(data[i]);
		if (data[i].title != null && data[i].file != null && data[i].stock != null && data[i].price != null) {
			var line = "";
			if (i % 4 == 0) // every 4 games, start a new row
				line += "<div class=\"row\">";

			line += "<div class=\"game\">";
			line += "<div class=\"picture\" style=\"background-image: url('img/" + data[i].file + "');\"></div>";
			line += "<div class=\"information radius\">";
			line += "<h4 class=\"title\">" + data[i].title + "</h4>";
			line += "Stock: " + data[i].stock + "</br >";
			line += "Price: $" + data[i].price + "</div>";
			line += "</div>";

			if (i % 4 == 3) // close the row
				line += "</div>";

			formatedData += line;
		} else {
			console.log("Problem with: " + data[i].title);
		}
	}

	listContent.innerHTML = formatedData;
}