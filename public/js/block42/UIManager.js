
// TODO: Use React.js for this
function showInfoBox(land)
{
	if(typeof land === "undefined")
	{
		$("#land-info").hide();
		$("#plotname").text("N/A");
	}else{
		$("#land-info").show();
		$("#plotname").text(land.name);
		$("#fileName").val(land.tokenId);
	}
}
