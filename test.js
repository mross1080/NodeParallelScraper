var util = require('util');
var Twit = require('twit');

var cluster = require('cluster');
var http = require('http');
var numCPUs = require('os').cpus().length;
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var async = require("async");

// scrapemain();
var count =0;
runForks()
var businessCount =0;


function runForks(){

var worker;
if (cluster.isMaster) {
  console.log(cluster.workers);
  hash = {'0': [], '1': [], '2': [], '3': [], '4': [],'5': [],'6': [], '7': []}
  
  var alphabet = ("abcdefghijklmnopqrstuvwxyz").split("");
  alphabet.push("num")
  //console.log(alphabet)
  for(var x =0; x < alphabet.length; x++){

  }

var paramsArray = [];
  while(alphabet.length != 0){
  	var count =0;
  	var arr = [];
  	while(count< 3 && alphabet.length != 0){
  		arr.push(alphabet.pop());
  		count++;
  	}
  	paramsArray.push(arr);
  	console.log(arr);
  	//arr.push(arr);

  }


var workers = {};
  // Fork workers.
  for (var i = 0; i < numCPUs; i++) {
  	
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

   console.log(cluster.workers.length)

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

		        for(var x=0; x < domArray.children.length; x++){
		        	if(x%2){
		        		//console.log(domArray.children[x].children[0].attribs);
		        		hrefs.push("http://www.yelp.com" + domArray.children[x].children[0].attribs.href);
		        	}

		        }

	        })
// 	console.log(hrefs)
	hrefs.forEach(function(currentUrl){
  asyncTasks.push(function(callback){
    // Make async call to scrape website
    request(currentUrl, function(error, response, html){
    scrapeListing(currentUrl);

      callback();
    });
    count++;
  });
});

	async.parallel(asyncTasks, function(){

  console.log("woo that worked");
  console.log(count);
});


		}
	})

}

function scrapeListing(url){
	console.log("Scraping " + url)
	   var hrefs = [];
	   var asyncTasks = [];


	request(url, function(error, response, html){
		if(!error){
			var $ = cheerio.load(html);



     //  console.log("Loaded HTML page")
			$('.sitemap-biz-by-letter').filter(function(){
		
         var str= "";
		        var data = $(this);
		        //console.log(data.children()['1'].children[1].children[1].children);
		        var domArray = data.children()['1'].children[1].children[1];
		       //  console.log(domArray.children[5].children[0].name)
		       // // console.log(data.children()['1'].children[5].children);
		       //console.log(domArray.children.length)
		        for(var x=0; x < domArray.children.length; x++){
		        	  if(domArray.children[x].name == 'li'){

		        		str = domArray.children[x].children[1].children[1].children[0].data;
		        		count++;
		        		//console.log(str.substring(3))
		        		//console.log("http://www.yelp.com" + domArray.children[x].children[0].attribs.href);
		        	 }
		        	//console.log(domArray.children[x].children[0]);
		        	// if(domArray[x].children.name == 'a'){
		        	// 	console.log(domArray[x].attribs);
		        	// }
		        }


		       // console.log("http://www.yelp.com" + data.children()._root['0'].parent.attribs.href);
		       // hrefs.push("http://www.yelp.com" + data.children()._root['0'].parent.attribs.href);

	        })
// 	console.log(hrefs


		}
	})


}
