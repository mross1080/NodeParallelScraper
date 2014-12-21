var util = require('util');
'use strict';

require('locus');

var cluster = require('cluster');
var http = require('http');
var numCPUs = require('os').cpus().length;
var fs = require('fs');
var async = require("async");
// scrapemain();
var count =0;
// runForks()
var businessCount =0;

runForks()

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

   console.log("There are " + cluster.workers + " workers")

  cluster.on('exit', function(worker, code, signal) {
    console.log('worker ' + worker.process.pid + ' died');
    // for(var x=0; x < workers[worker.process.pid].length; x++){
    // 	console.log("Lost param" + workers[worker.process.pid][x]);
    // }
  });
} else{
    // console.log(cluster.workers);

	// console.log('I am Worker ' + cluster.worker.id);
	process.on('message', function(params) {
    console.log('I am Worker ' + cluster.worker.id + "and I scrape " + params);
    console.log(" ")
		// for(var x=0; x< params.length; x++){
  //     console.log("I scrape " + params[x] + " !!!")
  //   // scrapemain(params[x]);
  // }
  });
}
}

