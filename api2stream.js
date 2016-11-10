
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

//TODO if the strFirst and strLast comparisons are done at the point of data conversion might not have to convert the whole result

//only do the require thing in node, browser needs to include files individually
if (typeof window === 'undefined'){}
var api2stream = function(objConfig){ 'use strict';
var self=this;
if(typeof objConfig === 'undefined'){
	//set all defaults
	var objConfig={pollSpeed:60,eventSpeed:1, order:'desc', format:'json', poll:false,
	fnEvent:function(objEvent){ console.log('Override fnEvent with a defined callback: ',objEvent); },
	fnCall:function(){ console.log('need to pass in the API call as a callback function to override this message'); }
	};
}else{
//set some defaults
	if(!objConfig.hasOwnProperty('pollSpeed')){objConfig.pollSpeed=60;}
	if(!objConfig.hasOwnProperty('eventSpeed')){objConfig.eventSpeed=1;}
	if(!objConfig.hasOwnProperty('order')){objConfig.order='desc';}
	if(!objConfig.hasOwnProperty('format')){objConfig.format='json';}
	if(!objConfig.hasOwnProperty('poll')){objConfig.poll=false;}
};
objConfig.stream=true;

//used for timing the polls
var tsUpdated=Date.now();
var objThrottle;
var fnSetFormat=function(results){
	if(!objConfig.hasOwnProperty('format') || objConfig.format ===''){
		var arrKeys=Object.keys(objFormatTest);
		var fFound=false;
		for(var i=0;i<arrKeys.length;i++){
			if(fFound===false){
				fFound=objFormatTest[arrKeys[i]]();
			}
		}
		return;
	}
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
	var arrResults=results.split('\n');	
	//assumes one value per line
	for(var i=0; i<arrResults.length; i++){ arrRecords.push({v:arrResults[i]}); }
	return arrRecords; 
};
objConversions.csv=function(results){ 
	var arrRecords=[]; var arrRecord=[]; var arrKeys=[]; var tmpRecord={};
	var arrResults=results.split('\n');	
	for(var i=0; i<arrResults.length; i++){
		arrRecord=arrResults[i].split(',');
		//I hope the 1st record has the field names
		if(i===0){arrKeys=arrRecord;}else{
			for(var ii=0;ii<arrKeys.length;i++){ tmpRecord[arrKeys[ii]]=arrRecord[ii]; }
			arrRecords.push({tmpRecord});
		}
		//record loop
		arrRecords
	}
	return arrRecords;
};
objConversions.kv=function(results){ return arrRecords; };
objConversions.json=function(results){ 
	//console.log(results);
	return results; 
};

var fnConvertData=function(results){
	//if the order is found to be ascending then need to reverse the array
	var arrRecords = objConversions[objConfig.format](results);
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
	if(objConfig.stream===true){
		objConfig.fnEvent(objRecord);
	}
};

var fnStreamRecords=function(arrRecords){
	//console.log(arrRecords);
	var intDelay=1000/objConfig.eventSpeed;
	if( typeof arrRecords !== 'undefined' && arrRecords.length > 0){
		var intRecords=arrRecords.length; var intIndex=0;
		//for(var i=intRecords;i>=0;i--){
			//wait the necessary time between sending events
			//console.log(arrRecords[i]);
			objThrottle=setInterval(function(){
				fnSendRecord(arrRecords[intIndex]);
				if(intIndex===intRecords-1){ clearInterval(objThrottle); }
				else{ intIndex++; }
			}, intDelay);
		//}
		//approximate timing to do the api poll at the right time and avoid the mess of it firing asynchronously from the deboucne loop
	}
	var intWait = intDelay*(intRecords+1);
	if(intWait < objConfig.pollSpeed*1000){ intWait=objConfig.pollSpeed*1000; }
	//console.log('wait: ',intWait);
	if(objConfig.poll===true || objConfig.poll > 0){
		setTimeout(function(){fnPollResults(arrRecords)}, intWait);
	}
};

var fnGetRecordDiff=function(arrRecords,newResults){
	var strFirst=JSON.stringify(arrRecords[0]);
	var strLast=JSON.stringify(arrRecords[0].lenghth-1);
	var strCurrent='';
	//no changes //first, determine if it's an exact match
	if(arrRecords.length===newResults.length 
		&& JSON.stringify(arrRecords[0])===JSON.stringify(newResults[0]) 
		&& JSON.stringify(arrRecords[arrRecords.length-1])===JSON.stringify(newResults[newResults.length-1]))
		{ return []; }
	//need to loop through to try and find matches, if found can exit the loop. If it's newest 1st, it shouldnt loop through much
	for(var i=0;i<newResults.length;i++){
		strCurrent=JSON.stringify(newResults[i]);
		if(strCurrent===strFirst){
			//found a match, to first record in previous set, so newest records must be first
			return newResults.slice(0,i+1);
		}else if(strCurrent===strLast){
			//weird, looks like this api appends records to the end, whatevs.
			return newResults.slice(i);
		}
	}	
};

this.fnStop=function(){
	objConfig.poll=false;
	objConfig.stream=false;
};

this.fnGo=function(){
	objConfig.poll=true;
	self.fnPollResults();
};

//----====|| PROCESSING LOGIC ||=====----\\
this.fnFirstResults=function(){
	var varResults = objConfig.fnCall();
	//fnSetFormat(varResults);
};
this.process=function(results){
	var arrRecords = fnConvertData(results);
	fnStreamRecords(arrRecords);
	if(arrRecords !== undefined && arrRecords.length>0){
		return arrRecords.length;
	}
}
//should not be called directly, called by fnFirstResults if polling is set to true
var fnPollResults=function(arrResults){
	if(objConfig.poll===true || objConfig.poll > 0){
		if(objConfig.poll>0){ objConfig.poll--; }
		var newResults = fnConvertData(objConfig.fnCall());
		var arrRecords = fnGetRecordDiff(arrResults,newResults);
		fnStreamRecords(arrRecords);
	}
}
}

if (typeof module !== 'undefined' && module.exports){module.exports = api2stream;}