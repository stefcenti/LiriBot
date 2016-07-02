// Includes the FS package for reading and writing files 
function liriBot() {

	var fs = require('fs');

	if (process.argv.length != 3) {
		usage();
	}

	switch(process.argv[2]){
		case "my-tweets":
			myTweets();
			break;
		case "spotify-this-song":
			spotifyThis();
			break;
		case "movie-this":
			movieThis();
			break;
		case "do-what-it-says":
			doIt();
			break;
		default:
			usage();
	}

// Running the readFile module that's inside of fs.
// Stores the read information into the variable "data"
/*
fs.readFile("keys.js", "utf8", function(err,data){
	    
	// Break the string down by comma separation and store the contents into the output array.
	var output = data.split(',');

	// Loop Through the newly created output array 
	for (var i=0; i<output.length; i++){

		// Print each element (item) of the array/ 
		console.log(output[i]);
	}

});
*/

	function myTweets(){
		var Twitter = require('twitter');
		var keys = require('./keys.js');
		 
		var twitterKeys = keys.twitterKeys;

		var client = new Twitter({
			consumer_key: twitterKeys.consumer_key,
			consumer_secret: twitterKeys.consumer_secret,
			access_token_key: twitterKeys.access_token_key,
			access_token_secret: twitterKeys.access_token_secret
		});

		var params = {screen_name: 'stefcenti'};
		client.get('statuses/user_timeline', params, function(error, tweets, response){
			if (!error) {
				for (var i=0; i<tweets.length && i < 20; i++) {
					console.log("==========================");
					console.log("Tweet " + (i+1) + " Created At: " + tweets[i].created_at);
					console.log(tweets[i].text);
				}
				console.log("==========================");
			}
			else
			{
				console.log("Error accessing Twitter");
				console.log(error);
			}
		});
	}

	function spotifyThis(){

	}

	function movieThis(){

	}

	function doIt(){

	}

	function usage(){
		console.log("Usage: node liri.js <command>");
		console.log("Where: command is either my-tweets, spotify-this-song, movie-this or do-what-it-says");
	}
}

liriBot();
