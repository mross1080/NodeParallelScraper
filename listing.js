var mongoose = require('mongoose');

module.exports = mongoose.model("Listing",{
	companyName: String,
	category: String,
	neighborhood:  String,
	phoneNumber: String

});