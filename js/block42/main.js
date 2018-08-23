var player

window.onload = () => {
	
	ThreejsUtility.init()
	ModelBuilder.buildStreet(7, 6)
	player = new Player(camera, ControlTypeEnum.Orbit)
	player.init()

	document.getElementById("fly-control").change = () => { player.setControlType(ControlTypeEnum.Flight) }
	document.getElementById("fps-control").change = () => { player.setControlType(ControlTypeEnum.FPS) }
	document.getElementById("orbit-control").change = () => { player.setControlType(ControlTypeEnum.Orbit) }

	var lands = [
		{
			"tokenId": "0000000000000000000000000000000000000000000000000000000000000000",
			"x": 0,
			"y": 0,
			"owner": "0x3ae7e2f63991808dedc04b2d25a5c88f874a17ad",
			"name": "Block 42",
			"description": "Block 42"
		},
		{
			"tokenId": "00000000ffffffffffffffffffffffffffff0000000000000000000000000000",
			"x": -1,
			"y": 0,
			"owner": "0x3ae7e2f63991808dedc04b2d25a5c88f874a17ad",
			"name": "Sweaty Chair",
			"description": "Sweaty Chair"
		},
		{
			"tokenId": "0000000000000000000000000000000000010000000000000000000000000000",
			"x": 1,
			"y": 0,
			"owner": "0x3ae7e2f63991808dedc04b2d25a5c88f874a17ad",
			"name": "Shibuya",
			"description": "Shibuya"
		},
		{
			"tokenId": "0000000000000000000000000000000000000000000000000000000000000001",
			"x": 0,
			"y": -1,
			"owner": "0x3ae7e2f63991808dedc04b2d25a5c88f874a17ad",
			"name": "City",
			"description": "City"
		},
		{
			"tokenId": "000000000000000000000000000000000000ffffffffffffffffffffffffffff",
			"x": 0,
			"y": 1,
			"owner": "0x3ae7e2f63991808dedc04b2d25a5c88f874a17ad",
			"name": "City 2",
			"description": "City 2"
		}
	]
	// for(var i = 0; i < lands.length; i++)
	// 	ObjLoaderUtils.spawnLand(lands[i])
}

// Prevent arrow key from swapping control type
$('input[type="radio"]').keydown(function (e) {
	var arrowKeys = [37, 38, 39, 40]
	if (arrowKeys.indexOf(e.which) !== -1) {
		$(this).blur()
		return false
	}
})