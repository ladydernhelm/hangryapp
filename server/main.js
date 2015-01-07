var express = require('express');
var app = express();
// var bodyParser = require('body-parser');	
var router = express.Router();

// app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function (req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/results', function (funTimes, res) {
			yelpAPICall(funTimes, res);
			console.log(funTimes.body.latField);

		var goodBiz;
	console.log("GOOOOOOOODDDD BUZZ *******IN THE CALL*******", goodBiz);

	}, function (funTimes, res) {
		res.sendFile(__dirname + '/results.html');
});

  
//trying to get the POST method to work
// app.use(express.bodyParser());

// app.post('/latlon', function(KendrasRequest) {
// 	yelpAPICall(funTimes, res);

//   console.log(KendrasRequest.body.latField);
//   res.json(KendrasRequest.body.latField);

// });



var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('My cool app listening at http://%s:%s', host, port);

});









/********************************
*        Yelp API Calls
*********************************/


// // Request API access: http://www.yelp.com/developers/getting_started/api_access

var yelpAPICall = function(KendrasRequest, res) { 

	var yelp = require("yelp").createClient({
	  consumer_key: "QBkaRGvffd9UrOoADC2xXQ", 
	  consumer_secret: "Xq0YkE6k4FNkY9Etf9jLSmySSjA",
	  token: "VvNEUY3b06gNg5NZWUcSgoMDrCmt-Ibk",
	  token_secret: "LJKvDi_W3ykgUtO6zX9qMdi8CZE"
	});


	var latField = KendrasRequest.query.latField;
	var lonField = KendrasRequest.query.lonField;
	var userRatingSelection = KendrasRequest.query.rating; //input from user... how do I access that?

	

	// See http://www.yelp.com/developers/documentation/v2/search_api
	yelp.search({sort: 1, ll: latField + "," + lonField}, function(error, data) {
		console.log("ERROR",error);
	//	console.log(data);
		var chosenBusinesses =	pickBusiness(data.businesses);
		// var waiter; 
		//  while(waiter === undefined) {
		//     require('deasync').runLoopOnce();
		//   };


	});
	
		


	var pickBusiness = function(bizes){
		var goodBiz = [];
		// var badBiz = [];
		for (var i = 0; i < bizes.length; i++) {
			var currentBiz = bizes[i];
			if (currentBiz.rating >= userRatingSelection) {
				goodBiz.push(
					[currentBiz.name, currentBiz.rating, currentBiz.distance]
				);
			}
			// else {
			// 	badBiz.push(
			// 		[currentBiz.name, currentBiz.rating]
			// 	);
					
			// };
		};
	 	console.log("GOOOOOOOODDDD BUZZ ********IN THE FUNCTION******", goodBiz[0]);
	 	// console.log("BAAAAAAAAAADD BUZZ &&&&&&&&&&&&&&", badBiz);
	 	return goodBiz[0]; 
	};
};



