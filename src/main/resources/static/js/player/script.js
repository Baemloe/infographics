async function load(dataId)
{
	try
	{
		let request = await fetch("/editeom/" + dataId);
		let data = await request.json();
		return await repairJSON(data)
	}
	catch(ex)
	{
		console.log(ex);
	}
}
async function repairJSON(data)
{
	let buffer = {};
	for(let i in data)
	{
	    if(i != "name" && i != "lastChange")
	    {
			buffer[i] = JSON.parse(data[i]);
	    }
		if(i == "lastChange")
		{
			localStorage.setItem("lastChange", new Date(data[i][0],data[i][1] - 1,data[i][2],data[i][3],data[i][4],data[i][5]));
		}
	}
	return buffer;
}
export {load}