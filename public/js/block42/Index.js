var player;

var area;
var content;
var mytimer;

class Index {

	static init()
	{
		ThreejsUtility.init();
		//ModelBuilder.build();
		ModelBuilder.buildFromData(Land.lands)
		player = new Player(camera,ControlTypeEnum.Flight);
		player.Initialize();

		document.getElementById("fly-control").change = () => {player.SetControlType(ControlTypeEnum.Flight)};
		document.getElementById("fps-control").change = () => {player.SetControlType(ControlTypeEnum.FPS)};
		document.getElementById("orbit-control").change = () => {player.SetControlType(ControlTypeEnum.Orbit)};
		Index.initUI();
	}

	static initVox()
	{
		ThreejsUtility.init();

		ModelBuilder.buildFromVox(Land.lands)
		player = new Player(camera,ControlTypeEnum.Orbit);
		player.Initialize();
		
		Index.initUI();
	}


	static initUI()
	{	//prevent arrow key from swaping control type
		// $('input[type="radio"]').keydown(function(e)
		// {
		// 	var arrowKeys = [37, 38, 39, 40];
		// 	if (arrowKeys.indexOf(e.which) !== -1)
		// 	{
		// 		$(this).blur();
		// 		return false;
		// 	}
		// });
	}
}
