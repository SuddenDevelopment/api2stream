# api2stream
call an api, stream the results, when you reach the end, poll for new results, repeat

```javascript
//set your callbacks
var objConfig={
   fnEvent:function(){
     //put your stream new event call here
   }
  ,fnCall:function(){
     var results;
     //put your api call here
     return results;
  }
};

//other config options
{
	pollSpeed:60, // minimum time in seconds to wait between API calls when polling
	eventSpeed:1, // number of records per second to stream
	order:'desc', // newest or oldest records first? oldest first= desc
	cache:5, //number of records to keep from the beginning and end of the result for diff comparisons
	format:'json', //format of the results
	poll:true, // set to false if you only want to stream 1 set of events
}

//create an instance for each API call you need to poll
var apiPoll=new api2stream(objConfig);

//and GO!
apiPoll.fnFirstResults();

//and STOP!
apiPoll.fnStop();

//and Resume
apiPoll.fnGo();
``
