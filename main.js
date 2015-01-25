/*******************************************
*                                          *
*                HANGRY                    *
*                                          *
********************************************/

//Express init and server setup
var express = require('express');
var exphbs  = require('express-handlebars');
var app = express();
var hbs = exphbs.create({ /* config */ });

//hmmm.. I don't appear to need this:
// var serveStatic = require('serve-static')

app.use(express.static(__dirname, 'public'));


app.engine('.hbs', exphbs({extname: '.hbs'}));
app.set('view engine', '.hbs');
app.set('views', __dirname + '/views');


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
		// alert("Oops! I can't seem to find your location. Double check that you enabled geolocation on the top right of this page");
		res.status(500).sendFile(__dirname + "/geoerror.html");
	};

	//set rating to 0 if they find a way around the required html form
	if(!rating){
		rating = 0;

	};

	//calling my YelpAPICall function
	yelpAPICall(latField, lonField, rating, function(error, chosenBusinesses){

		var name = chosenBusinesses[0];
		var address = chosenBusinesses[1];


	
		res.render("results", {name: name, address: address});

	});

});

/********************************
*        Yelp API Call          *
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
	
	//pulled this out of the normal yelp.search in order to include a callback 
	var yelpSearchCallback = function(error, data) {

		//stop eveything if there's an error
		if(error){
			callback(error);
			return 
		}

		var chosenBusinesses =	pickBusiness(data.businesses);
		
		/*here's the magic, this "callback" inside the yelp callback 
		 *forces the comp to catch up with the async before moving on
		 */
		callback(null, chosenBusinesses);


	};

	//and here we finally talk to Yelp
	yelp.search(query, yelpSearchCallback);
	
	//use this function to sort though and select the final destination 
	var pickBusiness = function(bizes){
		
		//defining the array for what will be the place to go
		var goodBiz = [];

		/**looping through all 20 returned bizes and pushing the ones that are 
		 *"good enough" to the goodBiz array
		 */
		for (var i = 0; i < bizes.length; i++) {
			var currentBiz = bizes[i];
			if (currentBiz.rating >= rating) {
				goodBiz.push(
					[currentBiz.name, currentBiz.location.display_address] //need to look at the docs and get address
				);
			}
		};
		//returning the first, because "sort:1" already has them sorted by distance (meters by radius)
	 	return goodBiz[0]; 
	};
};



