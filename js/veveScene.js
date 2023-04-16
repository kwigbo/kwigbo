//0x23Bc1374Cd373AA2260d6A1eE045f29E8cfF83f8
function initializeVeveScene() {
	veveContainer = document.createElement("div");
	veveContainer.setAttribute("id", "veveContainer");
	veveContainer.style.opacity = searchOpacity;
	contentView.insertBefore(veveContainer, contentView.firstChild);

	// Preloader Container
	preloader = document.createElement("div");
	preloader.setAttribute("id", "preloader");

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
}

var searchOpacity = 0;

function beginSearch() {
	searchForm.style.opacity = 0;
	preloader.style.opacity = 1;
	errorLabel.innerHTML = "";
	loadCollection("", searchInput.value);
}

function collectionLoaded() {
	// Clear the search container
	while (veveContainer.firstChild) {
	  veveContainer.removeChild(veveContainer.firstChild);
	}
	// Preload label
	const statLabel = document.createElement("label");
	statLabel.setAttribute("id", "statLabel");
	statLabel.innerHTML = "Collection Size: " + collection.length;
	veveContainer.appendChild(statLabel);
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
