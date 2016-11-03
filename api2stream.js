
// first API Call

	//determine results format
		//1 value per line = {v:value}
		//csv get the schema from the 1st line, apply as the keys for the rest of the lines
		//key value pairs space separated, = between key and value
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
//only do the require thing in node, browser needs to include files individually
if (typeof window === 'undefined'){}
var api2stream = function(objConfig){
if(typeof objConfig === 'undefined'){
	var objConfig={pollSpeed:60,eventSpeed:1, order:'desc', cache:5, format:'json', poll:true,
	fnEvent:function(objEvent){ console.log('Override fnEvent with a defined callback: ',objEvent); },
	fnCall:function(){ console.log('need to pass in the API call as a callback function to override this message'); }
	};
};

//used for timing the polls
var tsUpdated=Date.now();


var fnSetFormat=function(results){
	var arrKeys=Object.keys(objFormatTest);
	var fFound=false;
	for(var i=0;i<arrKeys.length;i++){
		if(fFound===false){
			fFound=objFormatTest[arrKeys[i]]();
		}
	}
	return;
};

var objFormatTest={};
objFormatTest.txt=function(){ return true; }
objFormatTest.csv=function(){ return true; }
objFormatTest.kv=function(){ return true; }
objFormatTest.json=function(){ return true; }
objFormatTest.arrJson=function(){ return true; }

var objConversions={};
objConversions.txt=function(results){ 
	var arrRecords=[];
	return arrRecords; 
};
objConversions.csv=function(results){ return arrRecords; };
objConversions.kv=function(results){ return arrRecords; };
objConversions.json=function(results){ 
	//console.log(results);
	return results; 
};
objConversions.arrJson=function(results){ return arrRecords; };

var fnConvertData=function(results){
	//if the order is found to be ascending then need to reverse the array
	var arrRecords = objConversions[objConfig.format](results);
	//cache the first and last records
	objConfig.arrFirst=arrRecords.slice(0,objConfig.cache+1);
	objConfig.arrLast=arrRecords.slice(arrRecords.length-objConfig.cache);
	return arrRecords;
};

var fnValue=function(varValue){
	//this if ro individual values, not full records
	//convert numbers
	//unquote strings
	return varValue;
}

var fnSendRecord=function(objRecord){
	//console.log('send: ',objRecord);
	//use a given callback
	objConfig.fnEvent(objRecord);
};

var fnStreamRecords=function(arrRecords){
	//console.log(arrRecords);
	var intDelay=1000/objConfig.eventSpeed;
	for(var i=arrRecords.length-1;i>0;i--){
		//wait the necessary time between sending events
		console.log(arrRecords[i]);
		setTimeout(fnSendRecord(arrRecords[i]), intDelay);
	}
	//approximate timing to do the api poll at the right time and avoid the mess of it firing asynchronously from the deboucne loop
	var intWait = intDelay*arrRecords.length;
	if(intWait < objConfig.pollSpeed*1000){ intWait=objConfig.pollSpeed*1000; }
	setTimeout(fnPollResults(), intWait);
};

var fnGetRecordDiff=function(arrRecords,newResults){
	//first, determine if it's an exact match
		//return []
	//next see if anything was matched at all
		//return diff
	//if nothing matched, just return it all
};

this.fnStop=function(){
	objConfig.poll=false;
};

this.fnGo=function(){
	objConfig.poll=true;
	fnPollResults();
};

//----====|| PROCESSING LOGIC ||=====----\\
this.fnFirstResults=function(){
	var varResults = objConfig.fnCall();
	//console.log(varResults);
	fnSetFormat(varResults);
	var arrRecords = fnConvertData(varResults);
	//console.log(arrRecords);
	fnStreamRecords(arrRecords);
	return arrRecords.length;
};

//should not be called directly, called by fnFirstResults if polling is set to true
var fnPollResults=function(arrResults){
	if(objConfig.poll===true){
		var newResults = fnConvertData(objConfig.fnCall());
		var arrRecords = fnGetRecordDiff(arrResults,newResults);
		fnStreamRecords(arrRecords);
	}
}
}

if (typeof module !== 'undefined' && module.exports){module.exports = api2stream;}