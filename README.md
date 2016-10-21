# api2stream
call an api, stream the results, when you reach the end, poll for new results, repeat

```javascript
//set your callbacks
var objConfig={
   fnEvent:function(){
     //put your stream new event call here
   }
  ,fnPoll:function(){
     var results;
     //put your api call here
     return results;
  }
};
//create an instance for each API call you need to poll
var apiPoll=new api2stream(objConfig);

//and GO!
apiPoll.fnFirstResults();

//and STOP!
apiPoll.fnStop();
``
