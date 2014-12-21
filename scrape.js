var util = require('util');
'use strict';

require('locus');

var cluster = require('cluster');
var http = require('http');
var numCPUs = require('os').cpus().length;
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var async = require("async");
var debug = require("debug");
// scrapemain();
var count =0;
// runForks()
var businessCount =0;
var mongoose = require('mongoose');
// var listingSchema = require('schemas/listing.js');
// var listingSchema = require('listing/listing');
mongoose.connect('mongodb://player1:arduino@ds053320.mongolab.com:53320/simonsays',function(error){
	if(error){
		console.log(error);
	} else{
		console.log("Database Connected");
	}
});


mongoose.model("Listing",{
	companyName: String,
	category: String,
	neighborhood:  String,
	phoneNumber: String

});

var Listing = mongoose.model("Listing")

runForks()
// scrapeListing("http://www.yelp.com/sm/los-angeles-ca-us/d/1")


function runForks(){

var worker;
if (cluster.isMaster) {
  hash = {'0': [], '1': [], '2': [], '3': [], '4': [],'5': [],'6': [], '7': []}
  
  var alphabet = ("abcdefghijklmnopqrstuvwxyz").split("");
  alphabet.push("num")
  //console.log(alphabet)
  for(var x =0; x < alphabet.length; x++){

  }

var paramsArray = [];
console.log("Number of cpus is " + numCPUs)
console.log(alphabet.length)
// var intialParamsPerWorker =alphabet.length /numCPUs;


var numWorkers = numCPUs;
var intialParamsPerWorker = parseInt(27/numWorkers);
// var paramsRemeinder = alphabet.length % numCPUs;
console.log(intialParamsPerWorker);
console.log(paramsRemeinder)
  while(alphabet.length != 0){
  	var count =0;
  	var arr = [];
  	while(count< intialParamsPerWorker && alphabet.length != 0){
  		arr.push(alphabet.pop());
  		count++;
  	}
  	paramsArray.push(arr);
  	console.log(arr);
  	//arr.push(arr);

  }

 var paramsRemeinder = (27 % numWorkers);
console.log("Remeinder is " + paramsRemeinder)
 if(paramsRemeinder != 0){
 var  remainingParams = paramsArray.pop();
 console.log(remainingParams)
 }

  for(i in remainingParams){
    paramsArray[i].push(remainingParams[i])
  }



var workers = {};
  // Fork workers.
  for (var i = 0; i < numWorkers; i++) {
  	
  	console.log("Forked")
  	count++;
  	console.log("Count is now" + count);
    worker = cluster.fork();
    // worker[worker.process.pid] = param;
    //console.log(worker)
    // var param = paramsArray.pop();
    // console.log(param)
    // worker[worker.process.pid] = param;
    worker.send(paramsArray.pop());
  }


  cluster.on('exit', function(worker, code, signal) {
    console.log('worker ' + worker.process.pid + ' died');
    // for(var x=0; x < workers[worker.process.pid].length; x++){
    // 	console.log("Lost param" + workers[worker.process.pid][x]);
    // }
  });
} else{
	console.log('Hello from Worker ' + cluster.worker.id);
	process.on('message', function(params) {
		for(var x=0; x< params.length; x++){
    scrapemain(params[x]);
  }
  });
}



// } else {


//   // Workers can share any TCP connection
//   // In this case its a HTTP server
//   http.createServer(function(req, res) {
//   	console.log("server is running")
//     res.writeHead(200);
//     res.end("hello world\n");
//   }).listen(8000);
// }
	console.log(count);
}
 function scrapemain(param){
	url = 'http://www.yelp.com/sm/los-angeles-ca-us/' + param;
	 	console.log("Scraping " + url);

	   var hrefs = [];
	   var asyncTasks = [];


	request(url, function(error, response, html){
		if(!error){
			var $ = cheerio.load(html);



			$('.listing').filter(function(){

		        var data = $(this);
		        var domArray = data.children()['1'];
		        // console.log(data)

		        for(var x=0; x < domArray.children.length; x++){
		        	if(x%2){
		        		//console.log(domArray.children[x].children[0].attribs);
		        		hrefs.push("http://www.yelp.com" + domArray.children[x].children[0].attribs.href);
		        		// console.log("http://www.yelp.com" + domArray.children[x].children[0].attribs.href)
		        	}

		        }

	        })
// // 	console.log(hrefs)
	hrefs.forEach(function(currentUrl){
  asyncTasks.push(function(callback){
    // Make async call to scrape website
    // request(currentUrl, function(error, response, html){
    	// console.log(response);
    scrapeListing(currentUrl);

      callback();
    // });
    count++;
  });
});

	async.parallel(asyncTasks, function(){

  console.log("done scraping " + url);
  // console.log(count);
});


		}
	})

}

function scrapeListing(url){
	// console.log("Scraping " + url)
	   var hrefs = [];
	   var asyncTasks = [];


	request(url, function(error, response, html){
		if(!error){
			var $ = cheerio.load(html);



     //  console.log("Loaded HTML page")
			$('.sitemap-biz-by-letter').filter(function(){
	
        var str= "";
        var address = "";
        var data = $(this);
        //console.log(data.children()['1'].children[1].children[1].children);
        var domArray = data.children()['1'].children[1].children[1];
        var companyInfoArray = domArray.children[71];
        var companyName;
        var phoneNumber = "";
        var count =0;
	    	for(var x =0; x< domArray.children.length; x++){

	    		if(domArray.children[x].type == "tag" ){
	    			companyName = domArray.children[x].children[1].children[1].children[0].data;
	    			var phoneNumber = "";
	    			for(child in domArray.children[x].children){
	    				if(domArray.children[x].children[child].type == "tag" ){
	    					// console.log(domArray.children[x].children[child]);
	    					if(domArray.children[x].children[child].attribs.class == 'biz-info' ){

	    						bizInfo = domArray.children[x].children[child];
	    						for(i in bizInfo.children){
	    							if(bizInfo.children[i].type == "tag"){
	    								if(bizInfo.children[i].name == "address"){
	    									addressArray = bizInfo.children[i];

	    								for(var z=0; z< addressArray.children.length-1; z++){
	    									//Every other element has the correct data
	    								if(z %2 == 0){

	    								address += addressArray.children[z].data.trim()
	    							}
	    						}
	    							var phoneNumberLocation =addressArray.children[addressArray.children.length-1].data;
	    							if (phoneNumberLocation != "") 	{
	    								// console.log("Phone number should be " + phoneNumberLocation.trim());
	    								phoneNumber = phoneNumberLocation.trim();
	    							}
	    							}
	    							}
	    						 }
	    						 // console.log(companyName);
	    						// console.log(address);

	    						address = "";
	    			 		 } else if (domArray.children[x].children[child].name == 'dl'){
	    			 		 	var detailsArray = domArray.children[x].children[child].children;
	    			 		 	var category = "";
	    			 		 	var neighborhood = "";
	    			 		 	for(index in detailsArray){
	    			 		 		if(detailsArray[index].type == 'tag'){
											// console.log(detailsArray[index].children[0].data);
											if(detailsArray[index].children[0].data.trim() == 'Neighborhood:'){
												 // console.log("Neighborhood is " + detailsArray[index].next.next.children[0].data.trim());
												 neighborhood = detailsArray[index].next.next.children[0].data.trim();
											} else if (detailsArray[index].children[0].data.trim() == 'Category:'){
												// console.log("Category is " + detailsArray[index].next.next.children[0].data)
												category = detailsArray[index].next.next.children[0].data.trim();
											}
	    			 		 		}
	    			 		 		
	    			 		 	}

	    			 		 }
	    			  }	
	    			}
	    			// console.log(companyName);
	    			Listing({
					  	companyName: companyName.substring(3, companyName.length).trim(),
							category: category,
							neighborhood:  neighborhood,
							phoneNumber: phoneNumber,
							letter: 
					  	
					  }).save( function( err, listing, count ){
					  	if(err){
					  		console.log(err);
					  	} else{
					  	// console.log(listing);
					  	// console.log("listing saved");
					    }
					  });
	    		}
	    	}

	        })
// 	console.log(hrefs


		}
	})
// console.log("Info on " + url "+ Saved to DB")

}
