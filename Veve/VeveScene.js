import Scene from "../GameSDK/Scene.js";

export default class VeveScene extends Scene {
	sceneOpacity = 0;
	opacitySpeed = 0.01;

	constructor(rootContainer) {
		super(rootContainer);
		this.boundBeginSearch = this.beginSearch.bind(this);
		this.boundGoBack = this.goBack.bind(this);
		this.display();
	}

	display() {
		if (!this.displayLoop.isRunning) {
			this.displayLoop.start(60);
		}
		this.veveContainer = document.createElement("div");
		this.veveContainer.setAttribute("id", "veveContainer");
		this.veveContainer.style.opacity = this.sceneOpacity;
		this.rootContainer.insertBefore(
			this.veveContainer,
			this.rootContainer.firstChild
		);

		this.createBackButton(this.veveContainer);

		// Preloader Container
		this.preloader = document.createElement("div");
		this.preloader.setAttribute("id", "preloader");
		this.preloader.setAttribute("class", "centeredContainer");

		// Spinner
		const spinner = document.createElement("div");
		spinner.setAttribute("class", "lds-circle");
		const innerDiv = document.createElement("div");
		spinner.appendChild(innerDiv);
		this.preloader.appendChild(spinner);
		this.preloader.style.opacity = 0;

		// Preload label
		const preloadLabel = document.createElement("label");
		preloadLabel.setAttribute("id", "preloadLabel");
		preloadLabel.innerHTML = "Loading Collection...";
		this.preloader.appendChild(preloadLabel);

		this.veveContainer.appendChild(this.preloader);

		this.searchForm = document.createElement("form");
		this.searchForm.setAttribute("class", "centeredContainer");
		this.searchForm.setAttribute("id", "searchForm");
		this.searchForm.addEventListener("submit", this.boundBeginSearch);

		// Create the label
		const searchLabel = document.createElement("label");
		searchLabel.setAttribute("id", "searchLabel");
		searchLabel.innerHTML = "Veve Lens";
		this.searchForm.appendChild(searchLabel);

		// Create the text input
		this.searchInput = document.createElement("input");
		this.searchInput.setAttribute("id", "searchInput");
		this.searchInput.setAttribute("placeholder", "Veve Address");
		this.searchForm.appendChild(this.searchInput);

		// Create the error label
		this.errorLabel = document.createElement("label");
		this.errorLabel.setAttribute("id", "errorLabel");
		this.searchForm.appendChild(this.errorLabel);

		this.veveContainer.appendChild(this.searchForm);
	}

	hide() {
		if (this.sceneOpacity > 0) {
			this.sceneOpacity -= this.opacitySpeed;
			this.veveContainer.style.opacity = this.sceneOpacity;
			if (this.sceneOpacity <= 0.01) {
				this.veveContainer.style.opacity = 0;
				this.rootContainer.removeChild(this.veveContainer);
				this.destroy();
				currentScene = new MainScene(contentView);
			}
		}
	}

	render() {
		if (this.isHidding) {
			this.hide();
			return;
		}
		if (this.sceneOpacity < 1) {
			this.sceneOpacity += this.opacitySpeed;
			this.veveContainer.style.opacity = this.sceneOpacity;
		}
	}

	beginSearch(event) {
		event.preventDefault();
		event.stopPropagation();
		this.searchForm.style.opacity = 0;
		this.preloader.style.opacity = 1;
		this.errorLabel.innerHTML = "";
		this.loadCollection("", this.searchInput.value);
	}

	exportCollectionJSON() {
		const filename = "collection.json";
		const jsonStr = JSON.stringify(collection);
		let element = document.createElement("a");
		element.setAttribute(
			"href",
			"data:text/plain;charset=utf-8," + encodeURIComponent(jsonStr)
		);
		element.setAttribute("download", filename);
		element.style.display = "none";
		document.body.appendChild(element);
		element.click();
		document.body.removeChild(element);
	}

	collectionLoaded() {
		//exportCollectionJSON();

		// Clear the search UI
		this.clearSearchUI();
		// Replace the back button
		this.createBackButton(veveContainer);

		var totalCommon = 0;
		var totalUncommon = 0;
		var totalRare = 0;
		var totalUltraRare = 0;
		var totalSecretRare = 0;

		var missingMetaData = 0;
		var missingRarity = 0;
		var unknownRarity = 0;

		for (let index in this.collection) {
			let metaData = this.collection[index]["metadata"];
			if (metaData) {
				let rarity = metaData["rarity"];
				if (rarity) {
					rarity = rarity.toLowerCase();
					if (rarity === "common") {
						totalCommon += 1;
					} else if (rarity === "uncommon") {
						totalUncommon += 1;
					} else if (rarity === "rare") {
						totalRare += 1;
					} else if (rarity === "ultra rare") {
						totalUltraRare += 1;
					} else if (
						rarity === "secret rare" ||
						rarity === "secret_rare"
					) {
						totalSecretRare += 1;
					} else {
						console.log(rarity);
						unknownRarity += 1;
					}
				} else {
					let metaDataCount = Object.keys(metaData).length;
					if (metaDataCount === 0) {
						missingMetaData += 1;
					} else {
						console.log(metaData);
						missingRarity += 1;
					}
				}
			} else {
				missingMetaData += 1;
			}
		}

		var finalCount =
			totalCommon +
			totalUncommon +
			totalRare +
			totalUltraRare +
			totalSecretRare +
			missingMetaData +
			missingRarity +
			unknownRarity;

		console.log("Missing Rarity: " + missingRarity);
		console.log("Unknown Rarity: " + unknownRarity);
		console.log("Final Count: " + finalCount);

		// Preloader Container
		this.statsContainer = document.createElement("div");
		this.statsContainer.setAttribute("id", "statsContainer");
		this.veveContainer.appendChild(this.statsContainer);

		// Stats label
		const statLabel = document.createElement("label");
		statLabel.setAttribute("class", "centeredContainer");
		statLabel.innerHTML = "Collection Size: " + this.collection.length;
		statLabel.innerHTML += "<br> Total Common: " + totalCommon;
		statLabel.innerHTML += "<br> Total Uncommon: " + totalUncommon;
		statLabel.innerHTML += "<br> Total Rare: " + totalRare;
		statLabel.innerHTML += "<br> Total Ultra Rare: " + totalUltraRare;
		statLabel.innerHTML += "<br> Total Secret Rare: " + totalSecretRare;
		statLabel.innerHTML += "<br> Missing Meta Data: " + missingMetaData;
		this.statsContainer.appendChild(statLabel);
	}

	clearSearchUI() {
		// Clear the search container
		while (veveContainer.firstChild) {
			veveContainer.removeChild(veveContainer.firstChild);
		}
	}

	failedToLoadCollection(message) {
		this.searchForm.style.opacity = 1;
		this.preloader.style.opacity = 0;
		this.errorLabel.innerHTML = message;
	}

	goBack() {
		this.isHidding = true;
	}

	createBackButton(parent) {
		this.backButton = document.createElement("button");
		this.backButton.setAttribute("id", "backButton");
		this.backButton.setAttribute("type", "button");
		this.backButton.addEventListener("click", this.boundGoBack);
		parent.appendChild(this.backButton);
	}

	collection = [];
	currentAddress;
	loadCollection(cursor, address) {
		if (!address) {
			this.failedToLoadCollection("Please input an address.");
			return;
		}
		this.currentAddress = address;
		// Send the request
		var request = new XMLHttpRequest();
		request.responseType = "json";
		var veveAddress =
			"?collection=0xa7aefead2f25972d80516628417ac46b3f2604af";
		var user = "&user=" + address;
		var page = "&page_size=100";
		var cursorParam = "&cursor=" + cursor;
		var url =
			"https://api.x.immutable.com/v1/assets" + veveAddress + user + page;
		if (cursor) {
			url = url + cursorParam;
		}
		request.open("GET", url);
		request.send();

		request.onload = (e) => {
			var json = request.response;
			var results = json["result"];
			this.collection.push.apply(this.collection, results);
			let remaining = json["remaining"];
			let cursor = json["cursor"];
			if (remaining === 1 && cursor) {
				this.loadCollection(cursor, this.currentAddress);
			} else if (this.collection.length > 0) {
				this.collectionLoaded();
			} else {
				this.failedToLoadCollection("The collection loaded was empty.");
			}
		};
		request.onerror = function () {
			this.failedToLoadCollection("An unknown error was hit.");
		};
	}
}
