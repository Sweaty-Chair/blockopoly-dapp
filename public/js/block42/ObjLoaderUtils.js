class ObjLoaderUtils {

	static spawnObj(objPath, position, onComplete) {

		//Create an instance of our toon material to apply to our object
		if (typeof objTexture === 'undefined') {
			var objTexture = new THREE.TextureLoader().load('./assets/color.png');
			objTexture.wrapS = objTexture.wrapT = THREE.RepeatWrapping;
			objTexture.anistropy = 16;

			var objMaterial = new THREE.MeshLambertMaterial({
				map: objTexture,
				color: 0xffffff
			});
		}

		//Create our Mesh and add to scene with the newly created material
		new THREE.OBJLoader()
			.load(objPath, function (object) {
				object.traverse(function (child) {   //Go through each child and find our mesh component, and change our material
					if (child instanceof THREE.Mesh) {
						child.material = objMaterial
					}
				})
				//Then we need to set our objects position
				object.position.x = position.x
				object.position.y = position.y
				object.position.z = position.z
				if (onComplete)
					onComplete(object)
			})
	}

	static spawnLand(land, onComplete) {
		if (land.owner === undefined || land.owner == "")
			ObjLoaderUtils.spawnLandVox('./assets/models/land_empty.vox', land, onComplete)
		else
			ObjLoaderUtils.spawnLandVox('./assets/models/' + land.tokenId + '.vox', land, onComplete)
	}

	static spawnEmptyLand(land, onComplete) {
		ObjLoaderUtils.spawnLandVox('./assets/models/land_empty.vox', land, onComplete)
	}

	static spawnLandVox(voxPath, land, onComplete) {

		var parser = new vox.Parser();
		parser.parse(voxPath).then((voxelData) => {

			var size = voxelData.size;
			var points = new Int32Array(size.x * size.y * size.z);
			for (var i = voxelData.voxels.length - 1; i >= 0; i--) {
				var v = voxelData.voxels[i];
				points[(size.x - v.x) + v.y * size.x * size.z + v.z * size.y] = v.colorIndex;
			}

			var result = MonotoneMesh(points, [size.x, size.z, size.y]);
			var geometry = new THREE.Geometry();
			geometry.vertices.length = 0;
			geometry.faces.length = 0;

			for (var i = 0; i < result.vertices.length; ++i) {
				var q = result.vertices[i];
				geometry.vertices.push(new THREE.Vector3(q[0], q[1], q[2]));
			}
			for (var i = 0; i < result.faces.length; ++i) {
				var q = result.faces[i];
				var f = new THREE.Face3(q[0], q[1], q[2]);
				var faceColor = voxelData.palette[q[3]];
				f.color = new THREE.Color(faceColor.r / 255, faceColor.g / 255, faceColor.b / 255);
				geometry.faces.push(f);
			}

			geometry.computeFaceNormals();
			geometry.computeVertexNormals();
			geometry.verticesNeedUpdate = true;
			geometry.elementsNeedUpdate = true;
			geometry.normalsNeedUpdate = true;

			// Create surface mesh
			var material = new THREE.MeshLambertMaterial({
				vertexColors: true
			});
			var surfacemesh = new THREE.Mesh(geometry, material);
			surfacemesh.doubleSided = true;

			scene.add(surfacemesh);
			surfacemesh.position.set(land.x * 149 + 596 - 31.5, 0, land.y * 149 + 596 - 31.5); // Hardcode position and offset
			surfacemesh.userData.land = land;

			if (onComplete)
				onComplete(geometry)
		});
	}
}