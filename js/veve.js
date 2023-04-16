var collection = []
var currentAddress;
function loadCollection(cursor, address) {
	if (!address) {
		failedToLoadCollection("Please input an address.");
		return
	}
	currentAddress = address;
	// Send the request
	var request = new XMLHttpRequest();
	request.responseType = 'json';
	var veveAddress = "?collection=0xa7aefead2f25972d80516628417ac46b3f2604af";
	var user = "&user=" + address;
	var page = "&page_size=100";
	var cursorParam = "&cursor=" + cursor;
	var url='https://api.x.immutable.com/v1/assets' + veveAddress + user + page;
	if (cursor) {
		url = url + cursorParam
	}
	request.open("GET", url);
	request.send();

	request.onload = (e) => {
		var json = request.response;
		var results = json["result"];
		collection.push.apply(collection, results);
		let remaining = json["remaining"];
		let cursor = json["cursor"];
		if (remaining === 1 && cursor) {
			loadCollection(cursor, currentAddress)
		} else if (collection.length > 0) {
			collectionLoaded();
		} else {
			failedToLoadCollection("The collection loaded was empty.");
		}
	}
	request.onerror = function () {
		failedToLoadCollection("An unknown error was hit.");
	};
}