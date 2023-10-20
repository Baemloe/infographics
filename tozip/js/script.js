async function load()
{
	try
	{
		let request = await fetch("./data.json");
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
	    if(i != "name")
	    {
		//data[i] = data[i].replaceAll("\\\\\"", "\"");
		buffer[i] = JSON.parse(data[i]);
	    }
	}
	return buffer;
}
export {load}