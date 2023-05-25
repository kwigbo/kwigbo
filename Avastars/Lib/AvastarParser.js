/// Class used to parse an on chain Avastar SVG
export default class AvastarParser {
	/// Initialize a parser
	///
	/// - Parameters:
	///		- svgString: The SVG string to create the parse with
	///		- displaySize: The size the SVG parser should setup for display in
	constructor(svgString, displaySize) {
		this.svgString = svgString;
		this.displaySize = displaySize;
	}

	/// Trigger the parser of the loaded SVG string
	parse() {
		const parser = new DOMParser();
		const dom = parser.parseFromString(this.svgString, "text/xml");

		this.styles = [];
		this.patterns = [];
		this.gradients = [];

		this.backgroundObjects = [];
		this.paths = {};

		const svgChildren = dom.children[0].children;
		for (const index in svgChildren) {
			const child = svgChildren[index];
			const isNode = child.getAttribute !== undefined;
			if (child.tagName === "style") {
				this.styles.push(child);
			} else if (this.objectIsBackground(child)) {
				this.backgroundObjects.push(child);
			} else if (child.tagName === "pattern") {
				this.patterns.push(child);
			} else if (child.tagName === "linearGradient") {
				this.gradients.push(child);
			} else if (child.tagName === "clipPath") {
				console.log(child);
			} else if (isNode) {
				//console.log(child);
				this.paths[index] = child;
			}
		}

		this.skinPaths = [];
		this.hairPaths = [];
		this.eyePaths = [];
		let lastPath = this.skinPaths;
		const keys = Object.keys(this.paths);
		for (const index in keys) {
			const key = keys[index];
			const item = this.paths[key];
			if (this.objectIsSkin(item)) {
				this.skinPaths.push(item);
				lastPath = this.skinPaths;
			} else if (this.objectIsHair(item)) {
				this.hairPaths.push(item);
				lastPath = this.hairPaths;
			} else if (this.objectIsEye(item)) {
				this.eyePaths.push(item);
				lastPath = this.eyePaths;
			} else {
				lastPath.push(item);
			}
		}

		this.renderPaths = [];
		this.renderPaths = this.renderPaths.concat(this.skinPaths);
		this.renderPaths = this.renderPaths.concat(this.hairPaths);
		this.renderPaths = this.renderPaths.concat(this.eyePaths);

		this.layers = [];
		for (const index in this.renderPaths) {
			const path = this.renderPaths[index];
			this.layers.push(this.pathsToLayer([path]));
		}

		this.backgroundLayer = this.pathsToLayer(this.backgroundObjects, true);

		const cssParser = new cssjs();
		this.styleObjects = [];
		for (const index in this.styles) {
			const style = this.styles[index].innerHTML;
			const parsed = cssParser.parseCSS(style);
			this.styleObjects.push(parsed);
		}
		this.setSVGStyles();
	}

	/// Check if an object has any background identifying markers
	///
	/// - Parameter object: The object to check
	/// - Returns: true if the object has identifying markers
	objectIsBackground(object) {
		return this.objectHasKeys(object, ["bg_", "backdrop"]);
	}

	/// Check if an object has any skin identifying markers
	///
	/// - Parameter object: The object to check
	/// - Returns: true if the object has identifying markers
	objectIsSkin(object) {
		return this.objectHasKeys(object, [
			"skin",
			"ear",
			"mouth",
			"nose",
			"face",
		]);
	}

	/// Check if an object has any eye identifying markers
	///
	/// - Parameter object: The object to check
	/// - Returns: true if the object has identifying markers
	objectIsEye(object) {
		return this.objectHasKeys(object, ["eye"]);
	}

	/// Check if an object has any hair identifying markers
	///
	/// - Parameter object: The object to check
	/// - Returns: true if the ob ject has identifying markers
	objectIsHair(object) {
		return this.objectHasKeys(object, ["hair"]);
	}

	/// Check if an object has any identifying markers
	///
	/// - Parameters:
	///		- object: The object to check
	///		- keys: The keys to look for when identifying markers
	/// - Returns: true if the ob ject has identifying markers
	objectHasKeys(object, keys) {
		const isNode = object.getAttribute !== undefined;
		if (isNode && typeof object.getAttribute === "function") {
			const classString = object.getAttribute("class");
			const fillString = object.getAttribute("fill");
			const idString = object.getAttribute("id");
			const pathString = object.getAttribute("path");
			const hrefString = object.getAttribute("xlink:href");
			const clipPathString = object.getAttribute("clip-path");

			for (const index in keys) {
				const key = keys[index];
				if (classString && classString.includes(key)) {
					return true;
				}
				if (fillString && fillString.includes(key)) {
					return true;
				}
				if (idString && idString.includes(key)) {
					return true;
				}
				if (pathString && pathString.includes(key)) {
					return true;
				}
				if (hrefString && hrefString.includes(key)) {
					return true;
				}
				if (clipPathString && clipPathString.includes(key)) {
					return true;
				}
			}
			for (const index in object.children) {
				const child = object.children[index];
				const hasKeys = this.objectHasKeys(child, keys);
				if (hasKeys) {
					return true;
				}
			}
		}
		return false;
	}

	/// Used to get the string contents of a node
	///
	/// - Parameter object: The object to get the value for
	/// - Returns: The string value of the given object or empty string.
	nodeContents(object) {
		const isNode = object.getAttribute !== undefined;
		if (isNode && typeof object.getAttribute === "function") {
			var tmp = document.createElement("div");
			tmp.appendChild(object);
			return tmp.innerHTML;
		}
		return "";
	}

	/// Used to get the string of an array of nodes
	///
	/// - Parameter nodes: The nodes to get the string value of
	/// - Returns: The string value of the given nodes or empty string.
	nodeArrayToString(nodes) {
		let string = "";
		for (const index in nodes) {
			const node = nodes[index];
			string += this.nodeContents(node);
		}
		return string;
	}

	/// Converts an array of paths to a new SVG file for rendering
	///
	/// - Parameters:
	///		- paths: Array of paths to convert to new SVG files
	///		- isBackground: Is this a background layer?
	///			Background layers are rendered differently to stretch and fill
	///	- Returns: The image object created from the paths.
	pathsToLayer(paths, isBackground) {
		let svg = this.createHeader(isBackground);
		svg += this.nodeArrayToString(this.styles);
		svg += this.nodeArrayToString(this.gradients);
		svg += this.nodeArrayToString(this.patterns);
		for (const index in paths) {
			const path = paths[index];
			svg += this.nodeContents(path);
		}
		svg += "</svg>";
		let blob = new Blob([svg], { type: "image/svg+xml" });
		let url = URL.createObjectURL(blob);
		let image = new Image();
		image.src = url;
		image.addEventListener("load", () => URL.revokeObjectURL(url), {
			once: true,
		});
		return image;
	}

	/// Creates an SVG header based on depth of rendered layers
	///
	///		- isBackground: Is this a background layer?
	///			Background layers are rendered differently to stretch and fill
	///	- Returns: The string value for the SVG header.
	createHeader(isBackground) {
		const svgXMLNS = `xmlns="http://www.w3.org/2000/svg"`;
		const xlinkXMLNS = `xmlns:xlink="http://www.w3.org/1999/xlink"`;
		const svgVersion = `version="1.1"`;
		if (isBackground) {
			const xmin = 0;
			const ymin = 0;
			const boxWidth = 1000;
			const boxHeight = 1000;
			const portWidth = "100%";
			const portHeight = "100%";

			const aspect = `preserveAspectRatio="xMidYMid meet"`;
			const viewPort = `width="${portWidth}" height="${portHeight}"`;
			const viewBox = `viewBox="${xmin} ${ymin} ${boxWidth} ${boxHeight}"`;
			return `<svg ${aspect} ${svgXMLNS} ${xlinkXMLNS} ${svgVersion} ${viewPort} ${viewBox}>`;
		} else {
			const aspect = `preserveAspectRatio="xMidYMid meet"`;
			const viewPort = `width="${this.displaySize.width}" height="${this.displaySize.height}"`;
			const viewBox = `viewBox="0 0 1000 1000"`;
			return `<svg ${aspect} ${svgXMLNS} ${xlinkXMLNS} ${svgVersion} ${viewPort} ${viewBox}>`;
		}
	}

	/// Grab the styles from the SVG file and set any needed for displaye
	setSVGStyles() {
		for (const index in this.styleObjects) {
			const styleObject = this.styleObjects[index];
			for (const styleIndex in styleObject) {
				const prop = styleObject[styleIndex];
				if (prop["selector"] === ".bg_color") {
					const rules = prop["rules"];
					for (const ruleIndex in rules) {
						const rule = rules[ruleIndex];
						if (rule["directive"] === "fill") {
							this.backgroundColor = rule["value"];
						}
					}
				}
			}
		}
	}
}
