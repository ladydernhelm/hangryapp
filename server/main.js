/*******************************************
*                                          *
*                HANGRY                    *
*                                          *
********************************************/

//Express init and server setup
var express = require('express');
var app = express();

var server = app.listen(3000, function() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('My cool app listening at http://%s:%s', host, port);
});

//Routing setup for index.html
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

//Routing set up for results.html 
app.get('/results', function(req, res) {
	var latField = req.query.latField;
	var lonField = req.query.lonField;
	var rating = req.query.rating; 

	//data validation with geoerror end point
	if(!latField || !lonField){
		res.status(500).sendFile(__dirname + "/geoerror.html");
	};

	//data validation with ratingerroe end point
	if(!rating){
		res.status(500).sendFile("./ratingerror.html");
	};

	//calling my YelpAPICall function
	yelpAPICall(latField, lonField, rating, function(error, chosenBusinesses){
		//Need to change this to .render0
		res.send(chosenBusinesses);
		console.log("GOOOOOOOODDDD BUZZ *******IN THE CALL*******", chosenBusinesses);

	});

});

/********************************
*        Yelp API Calls
*********************************/

//request API access: http://www.yelp.com/developers/getting_started/api_access
var yelpAPICall = function(latField, lonField, rating, callback) { 

	//Oops!! Shouldn't have this on github!
	var yelp = require("yelp").createClient({
	  consumer_key: "QBkaRGvffd9UrOoADC2xXQ", 
	  consumer_secret: "Xq0YkE6k4FNkY9Etf9jLSmySSjA",
	  token: "VvNEUY3b06gNg5NZWUcSgoMDrCmt-Ibk",
	  token_secret: "LJKvDi_W3ykgUtO6zX9qMdi8CZE"
	});
	

	/** 
	* Sorting by yelp settings. Returns 20 businesses
	* "sort: 1" will sort by nearest to furthest. 
	* "ll:" is looking for latitude + longitude" 
	* (see http://www.yelp.com/developers/documentation/v2/search_api for more params if needed)
	*/
	var query = {sort: 1, ll: latField + "," + lonField};
	


	//stoped commenting here on 1/7/14... will do more tomorrow

	var yelpSearchCallback = function(error, data) {

		if(error){
			callback(error);
			return 
		}

		console.log("ERROR",error);
	//	console.log(data);
		var chosenBusinesses =	pickBusiness(data.businesses);
		callback(null, chosenBusinesses);
	};

	yelp.search(query, yelpSearchCallback);
	
	var pickBusiness = function(bizes){
		var goodBiz = [];
		// var badBiz = [];
		for (var i = 0; i < bizes.length; i++) {
			var currentBiz = bizes[i];
			if (currentBiz.rating >= rating) {
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



