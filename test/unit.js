var assert        = require("assert");
var should        = require("should");
var api2stream   = require("../api2stream");

describe('simplest test', function () {
 it('run the first api call', function (done) {
    //test
    //set your callbacks
    var objConfig={
       fnEvent:function(objEvent){
         //put your stream new event call here
         console.log('emit: ',objEvent);
       }
      ,fnCall:function(){
         var results=[];
         //put your api call here
         results.push({someKey:'someValue'},{someKey:'anotherValue'});
         return results;
      },
        pollSpeed:60, // minimum time in seconds to wait between API calls when polling
        eventSpeed:1, // number of records per second to stream
        order:'desc', // newest or oldest records first? oldest first= desc
        cache:5, //number of records to keep from the beginning and end of the result for diff comparisons
        format:'json', //format of the results
        poll:false // set to false if you only want to stream 1 set of events
    };

    //create an instance for each API call you need to poll
    var apiPoll=new api2stream(objConfig);

    //and GO!
    intResults=apiPoll.fnFirstResults();
    
    //check
    //console.log(intResults);
   (intResults).should.be.exactly(2);
   done();
 });
});