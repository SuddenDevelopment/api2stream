// DO NOT MAKE THE CALL TO API INSIDE THIS LIB, IT'S TOO SPECIFIC TO BROWSERS AND ENVIRONMENTS, PASS RESULTS INTO THIS AND LET IT PASS BACK EVENTS IN A CALLBACK

// first API Call

	//determine results format
		//1 value per line = {v:value}
		//csv get the schema from the 1st line, apply as the keys for the rest of the lines
		//json object per line requires no transform
		//json objects in an array just need to be looped
		//xml needs a bunch of work, best to use an outside conversion lib

	//keep knowledge of the data type discovered

	//stream results at a configured rate per second

	//keep the first 5 results and the last 5 results, we don't know what order the results are in, time descending hopefully

	//end of api call, start polling

//poll calls
	
	//get and convert results

	//look for the beginning and end cache results.
		//if both exist, no change. //do we want to nitfy the user of a poll with no change?
		//if only one set exists we know the order and can keep knowledge of it.
		//get the results of the other side of the cached records and stream them

var objConfig={speed:1, order:'desc', cache:5
	fnEvent:function(objEvent){ console.log(objEvent); }
};

var fnGetFormat=function(results){
	var objConfig.format='';
	return strFormat;
};

var objConversions={};
objConversions.txt=function(results){ return arrRecords; };
objConversions.csv=function(results){ return arrRecords; };
objConversions.json=function(results){ return arrRecords; };
objConversions.arrJson=function(results){ return arrRecords; };

var fnConvertData=function(results){
	fnGetFormat();
	//if the order is found to be ascending then need to reverse the array
	var arrRecords = objConversions[objConfig.format](results);
	//cache the first and last records
	objConfig.arrFirst=arrRecords.splice(0,objConfig.cache);
	objConfig.arrLast=arrRecords.splice(arrRecords.length-objConfig.cache);
	return arrRecords;
};

var fnSendEvent=function(objEvent){
	//use a given callback
	objConfig.fnEvent(objEvent);
};

var fnStreamEvents=function(arrRecords){
	var intDelay=1000/objConfig.speed;
	for(var i=arrRecords.length;i>0;i--){
		//wait the necessary time between sending events
		_.debounce(intDelay,fnSendEvent(arrRecords[i]));
	}
};

var fnGetRecordDiff=function(arrRecords){
	//first, determine if it's an exact match
		//return []
	//next see if anything was matched at all
		//return diff
	//if nothing matched, just return it all
};

//----====|| PROCESSING LOGIC ||=====----\\
var fnFirstResults=function(results){
	var arrRecords = fnConvertData(results);
	fnStreamEvents(arrRecords);
};

var fnPollResults=function(results){
	var arrRecords = fnGetRecordDiff(results);
}

