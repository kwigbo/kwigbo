var isVeveSceneCreated = false
function initializeVeveScene() {
	if (isVeveSceneCreated) {
		return;
	}
	veveContainer = document.createElement("div");
	veveContainer.setAttribute("id", "veveContainer");
	veveContainer.style.opacity = searchOpacity;
	contentView.insertBefore(veveContainer, contentView.firstChild);

	// Preloader Container
	preloader = document.createElement("div");
	preloader.setAttribute("id", "preloader");
	preloader.setAttribute("class", "centeredContainer");

	// Spinner
	const spinner = document.createElement("div");
	spinner.setAttribute("class", "lds-circle");
	const innerDiv = document.createElement("div");
	spinner.appendChild(innerDiv);
	preloader.appendChild(spinner);
	preloader.style.opacity = 0;

	// Preload label
	const preloadLabel = document.createElement("label");
	preloadLabel.setAttribute("id", "preloadLabel");
	preloadLabel.innerHTML = "Loading Collection...";
	preloader.appendChild(preloadLabel);

	veveContainer.appendChild(preloader);

	searchForm = document.createElement("form");
	searchForm.setAttribute("class", "centeredContainer");
	searchForm.setAttribute("id", "searchForm");
	searchForm.onsubmit = function() {
		beginSearch();
        return false;
    }

	// Create the label
	const searchLabel = document.createElement("label");
	searchLabel.setAttribute("id", "searchLabel");
	searchLabel.innerHTML = "Veve Lens";
	searchForm.appendChild(searchLabel);

	// Create the text input
	searchInput = document.createElement("input");
	searchInput.setAttribute("id", "searchInput");
	searchInput.setAttribute("placeholder", "Veve Address");
	searchForm.appendChild(searchInput);

	// Create the error label
	errorLabel = document.createElement("label");
	errorLabel.setAttribute("id", "errorLabel");
	searchForm.appendChild(errorLabel);

	veveContainer.appendChild(searchForm);
	isVeveSceneCreated = true
}

var searchOpacity = 0;

function beginSearch() {
	searchForm.style.opacity = 0;
	preloader.style.opacity = 1;
	errorLabel.innerHTML = "";
	loadCollection("", searchInput.value);
}

function exportCollectionJSON() {
	const filename = 'collection.json';
	const jsonStr = JSON.stringify(collection);
	let element = document.createElement('a');
	element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(jsonStr));
	element.setAttribute('download', filename);
	element.style.display = 'none';
	document.body.appendChild(element);
	element.click();
	document.body.removeChild(element);
}

function collectionLoaded() {
	//exportCollectionJSON();

	// Clear the search UI
	clearSearchUI();

	var totalCommon = 0;
	var totalUncommon = 0;
	var totalRare = 0;
	var totalUltraRare = 0;
	var totalSecretRare = 0;

	var missingMetaData = 0;
	var missingRarity = 0;
	var unknownRarity = 0;

	for (index in collection) {
		let metaData = collection[index]["metadata"];
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
				} else if (rarity === "secret rare" ||
					rarity === "secret_rare") {
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

	var finalCount = (totalCommon + 
		totalUncommon + 
		totalRare +
		totalUltraRare +
		totalSecretRare +
		missingMetaData +
		missingRarity +
		unknownRarity)

	console.log("Missing Rarity: " + missingRarity);
	console.log("Unknown Rarity: " + unknownRarity);
	console.log("Final Count: " + finalCount);

	// Preloader Container
	statsContainer = document.createElement("div");
	statsContainer.setAttribute("id", "statsContainer");
	veveContainer.appendChild(statsContainer);

	// Stats label
	const statLabel = document.createElement("label");
	statLabel.setAttribute("id", "statLabel");
	statLabel.innerHTML = "Collection Size: " + collection.length;
	statLabel.innerHTML += "<br><br> Total Common: " + totalCommon;
	statLabel.innerHTML += "<br><br> Total Uncommon: " + totalUncommon;
	statLabel.innerHTML += "<br><br> Total Rare: " + totalRare;
	statLabel.innerHTML += "<br><br> Total Ultra Rare: " + totalUltraRare;
	statLabel.innerHTML += "<br><br> Total Secret Rare: " + totalSecretRare;
	statLabel.innerHTML += "<br><br> Missing Meta Data: " + missingMetaData;
	statsContainer.appendChild(statLabel);
}

function clearSearchUI() {
	// Clear the search container
	while (veveContainer.firstChild) {
	  veveContainer.removeChild(veveContainer.firstChild);
	}
	isVeveSceneCreated = false;
}

function failedToLoadCollection(message) {
	searchForm.style.opacity = 1;
	preloader.style.opacity = 0;
	errorLabel.innerHTML = message;
}

function renderVeveScene() {
	const context = mainCanvas.getContext('2d');
	context.fillStyle = "#ffffff";
	context.fillRect(0, 0, mainCanvas.width, mainCanvas.height);
	if (context.globalAlpha < 1) {
		context.globalAlpha += OpacitySpeed;
	}
	if (searchOpacity < 1) {
		searchOpacity += OpacitySpeed;
		veveContainer.style.opacity = searchOpacity;
	}
}
