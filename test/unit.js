var assert        = require("assert");
var should        = require("should");
var api2stream   = require("../api2stream");

describe('functions test', function () {
 this.timeout(6000);
 it('run the first api call', function (done) {
    this.timeout(6000);
    setTimeout(done, 5000);
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
        pollSpeed:1, // minimum time in seconds to wait between API calls when polling
        eventSpeed:1, // number of records per second to stream
        order:'desc', // newest or oldest records first? oldest first= desc
        cache:5, //number of records to keep from the beginning and end of the result for diff comparisons
        format:'json', //format of the results
        poll:1 // set to a number of times to poll or true for indefinte
    };

    //create an instance for each API call you need to poll
    var apiPoll=new api2stream(objConfig);

    //and GO!
    intResults=apiPoll.fnFirstResults();
    
    //check
    //console.log(intResults);
   (intResults).should.be.exactly(2);
   //done();
 });
});

describe('functions test', function () {
 this.timeout(6000);
 it('try some data conversion', function (done) {
    this.timeout(6000);
    setTimeout(done, 5000);
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
         results='one \n two \n three';
         return results;
      },
        pollSpeed:1, // minimum time in seconds to wait between API calls when polling
        eventSpeed:1, // number of records per second to stream
        order:'desc', // newest or oldest records first? oldest first= desc
        cache:5, //number of records to keep from the beginning and end of the result for diff comparisons
        format:'txt', //format of the results
        poll:1 // set to a number of times to poll or true for indefinte
    };

    //create an instance for each API call you need to poll
    var apiPoll=new api2stream(objConfig);

    //and GO!
    intResults=apiPoll.fnFirstResults();
    
    //check
    //console.log(intResults);
   (intResults).should.be.exactly(3);
   //done();
 });
});