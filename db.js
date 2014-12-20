var mongoose = require('mongoose');

mongoose.connect('mongodb://player1:arduino@ds053320.mongolab.com:53320/simonsays',function(error){
	if(error){
		console.log(error);
	} else{
		console.log("Database Connected");
	}
});

module.exports= mongoose.connection;
