class ModelBuilder {

	static buildStreet(width, height) {

		// Vertical streets
		var positions = [];
		var index = 0;

		for (var xi = 0; xi < width; xi++) {
			for (var yi = 0; yi < height + 1; yi++) {

				// Record position
				positions.push([xi * 149 + 149 + 31.5, yi * 149 + 149 - 43]);

				var objPosition = new THREE.Vector3(
					positions[index][0],
					-1,
					positions[index][1]
				);

				ObjLoaderUtils.spawnObj(
					"assets/models/road.obj",
					objPosition,
					function (object) {
						scene.add(object);
					}
				);
				index++;
			}
		}

		positions = [];
		index = 0;

		// Horizontal streets
		for (var xi = 0; xi < width + 1; xi++) {
			for (var yi = 0; yi < height; yi++) {
				// Record position
				var pos = [xi * 149 + 149 - 43, yi * 149 + 149 + 31.5];
				positions.push(pos);

				var objPosition = new THREE.Vector3(
					positions[index][0],
					-1,
					positions[index][1]
				);

				ObjLoaderUtils.spawnObj("assets/models/road.obj", objPosition, function (object) {
					object.rotateY(Math.PI / 2);
					scene.add(object);
				}
				);
				index++;
			}
		}

		// Street intersections
		positions = [];
		index = 0;
		for (var xi = 0; xi < width + 1; xi++) {
			for (var yi = 0; yi < height + 1; yi++) {
				var pos = [xi * 149 + 149 - 43, yi * 149 + 149 - 43];
				positions.push(pos);

				var objPosition = new THREE.Vector3(
					positions[index][0],
					-1,
					positions[index][1]
				);

				ObjLoaderUtils.spawnObj("assets/models/road_2.obj", objPosition, function (object) { scene.add(object) });
				index++;
			}
		}
	}

}

// Function to download data to a file
function download(data, filename, type) {
	var file = new Blob([data], { type: type });
	if (window.navigator.msSaveOrOpenBlob) // IE10+
		window.navigator.msSaveOrOpenBlob(file, filename);
	else { // Others
		var a = document.createElement("a"),
			url = URL.createObjectURL(file);
		a.href = url;
		a.download = filename;
		document.body.appendChild(a);
		a.click();
		setTimeout(function () {
			document.body.removeChild(a);
			window.URL.revokeObjectURL(url);
		}, 0);
	}
}