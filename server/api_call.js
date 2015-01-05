// Request API access: http://www.yelp.com/developers/getting_started/api_access
yelpAPICall();

var yelpAPICall = function() { 

	var yelp = require("yelp").createClient({
	  consumer_key: "QBkaRGvffd9UrOoADC2xXQ", 
	  consumer_secret: "Xq0YkE6k4FNkY9Etf9jLSmySSjA",
	  token: "VvNEUY3b06gNg5NZWUcSgoMDrCmt-Ibk",
	  token_secret: "LJKvDi_W3ykgUtO6zX9qMdi8CZE"
	});
	var latField = $_GET('latField');
	var lonField = $_GET('lonField');
	var latField = cordX;
	var lonField = cordY;
	// See http://www.yelp.com/developers/documentation/v2/search_api
	yelp.search({sort: 1, ll: cordX + "," + cordY}, function(error, data) {
		console.log("ERROR",error);
	//	console.log(data);
		var chosenBusinesses = pickBusiness(data.businesses);
	 	
	});

	var userRatingSelection = 4.5; //input from user... how do I access that?

	var pickBusiness = function(bizes){
		var goodBiz = [];
		var badBiz = [];
		for (var i = 0; i < bizes.length; i++) {
			var currentBiz = bizes[i];
			if (currentBiz.rating >= userRatingSelection) {
				goodBiz.push(
					[currentBiz.name, currentBiz.rating, currentBiz.distance]
				);
			}
			else {
				badBiz.push(
					[currentBiz.name, currentBiz.rating]
				);
			}
		}
	 	console.log("GOOOOOOOODDDD BUZZ **************", goodBiz[0]);
	 	console.log("BAAAAAAAAAADD BUZZ &&&&&&&&&&&&&&", badBiz);

	 	// return goodBiz[0]; 
	 	 

	};
};
