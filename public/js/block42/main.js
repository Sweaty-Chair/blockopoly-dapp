// TODO: Get info of lands from local JSON, this will be replaced by blockchain getLands() later
var landsJson = require('./Lands-auto-generated.json')
Land.init(landsJson)
