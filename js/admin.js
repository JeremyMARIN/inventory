function init() {
	var dataContent            = document.getElementById("data");
	var svgContent             = document.getElementById("svg");
	var displayListButton      = document.getElementById("display_list");
	var displayHistogramButton = document.getElementById("display_histogram");

	displayListButton.addEventListener("click", function() {
		displayList(dataContent, svgContent);
	});

	displayHistogramButton.addEventListener("click", function() {
		displayHistogram(dataContent, svgContent);
	});

	displayList(dataContent);
}


function displayList(dataContent, svgContent) {
	var xhr = new XMLHttpRequest();
	var params = "display=list";

	xhr.open("POST", "admin.php");
	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

	xhr.addEventListener("readystatechange", function() {
		if (xhr.readyState == 4 && xhr.status == 200) {
			processListData(xhr.responseText, dataContent, svgContent);
		} else if (xhr.readyState == 4) {
			dataContent.innerHTML = "Error " + xhr.status + ".";
		}
	}, false);

	xhr.send(params);
}
function processListData(data, dataContent, svgContent) {
	var formatedData = ""; // HTML formated data

	data = JSON.parse(data);

	for (var i = 0, length = data.length; i < length; i++) {
		if (data[i].email && data[i].choice) {
			var line = "<tr><td>" + data[i].email + "</td><td>" + data[i].choice + "</td></tr>";
			formatedData += line;
		}
	}

	dataContent.innerHTML = 
		"<table>" +
			"<tr>" + 
				"<th>Email</th>" +
				"<th>Choice</th>" +
			"</tr>" +
			formatedData +
		"</table>"
	;

	if (svgContent)
		svgContent.style.display = "none";
	dataContent.style.display = "block";
}


function displayHistogram(dataContent, svgContent) {
	var xhr = new XMLHttpRequest();
	var params = "display=histogram";

	xhr.open("POST", "admin.php");
	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

	xhr.addEventListener("readystatechange", function() {
		if (xhr.readyState == 4 && xhr.status == 200) {
			processHistogramData(xhr.responseText, dataContent, svgContent);
		} else if (xhr.readyState == 4) {
			dataContent.innerHTML = "Error " + xhr.status + ".";
		}
	}, false);

	xhr.send(params);
}
function processHistogramData(data, dataContent, svgContent) {
	var width = 500, height = 200; // size of the SVG canvas
	var colors = ["red", "blue", "green", "yellow", "orange"];

	data = JSON.parse(data);
	console.log(data);

	var percentages = [data.percentages.a, data.percentages.b, data.percentages.c, data.percentages.d, data.percentages.e];
	var counts      = [data.counts.a, data.counts.b, data.counts.c, data.counts.d, data.counts.e];
	var titles      = ["a", "b", "c", "d", "e"];

	for (var i = 0, max = counts.length; i < max; i++) {
		var percentage = percentages[i] ? percentages[i] : 0;
		var count      = counts[i] ? counts[i] : 0;
		var title      = titles[i] ? titles[i] : 0;

		var rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
		rect.setAttribute("x", (width / 5) * i);
		rect.setAttribute("y", (1 - percentage) * height);
		rect.setAttribute("width", (width / 5) * 0.8);
		rect.setAttribute("height", percentage * height);
		rect.setAttribute("fill", colors[i]);
		svgContent.appendChild(rect);

		var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
		text.setAttribute("x", ( (width / 5) * i) + (width / 15) );
		text.setAttribute("y", ((1 - percentage) * height) - (height / 20) );
		text.setAttribute("font-size", height/10);
		text.setAttribute("fill", colors[i]);

		var textNode = document.createTextNode(count);
		text.appendChild(textNode);
		svgContent.appendChild(text);

		text = document.createElementNS("http://www.w3.org/2000/svg", "text");
		text.setAttribute("x", ( (width / 5) * i) + (width / 15) );
		text.setAttribute("y", height + 20);
		text.setAttribute("font-size", height/10);
		text.setAttribute("fill", "white");
		
		textNode = document.createTextNode(title);
		text.appendChild(textNode);
		svgContent.appendChild(text);
	}

	dataContent.style.display = "none";
	svgContent.style.width = width;
	svgContent.style.height = height + 20;
	svgContent.style.display = "block";
}