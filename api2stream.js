// first API Call

	//determine results format
		//1 value per line = {v:value}
		//csv get the schema from the 1st line, apply as the keys for the rest of the lines
		//json object per line requires no transform
		//json objects in an array just need to be looped
		//xml needs a bunch of work, best to use an outside conversion lib

	//keep knowledge of the data type discovered

	//stream results at a configured rate per second

	//keep the first 5 results and the last 5 results, we don't know what order the results are in

	//end of api call, start polling

//poll calls
	
	//get and convert results

	//look for the beginning and end cache results.
		//if both exist, no change. //do we want to nitfy the user of a poll with no change?
		//if only one set exists we know the order and can keep knowledge of it.
		//get the results of the other side of the cached records and stream them