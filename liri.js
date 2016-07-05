// Includes the FS package for reading and writing files 
function liriBot() {

	// Set up logging to the console and to a file
var util = require('util');
var fs = require('fs');

// Use the 'a' flag to append to the file instead of overwrite it.
var ws = fs.createWriteStream('./log.txt', {flags: 'a'});
var through = require('through2');

// Create through stream.
var t = new through();

// Pipe its data to both stdout and our file write stream.
t.pipe(process.stdout);
t.pipe(ws);

// Monkey patch the console.log function to write to our through
// stream instead of stdout like default.
console.log = function () {
  t.write(util.format.apply(this, arguments) + '\n');
};
//	var fs = require('fs');
	var commandLine = true;

	liri(process.argv[2], process.argv.splice(3, process.argv.length - 3));

	function liri(appName, argString){
		switch(appName){
			case "my-tweets":
				if (argString.length > 0) {
					usage(appName, argString);
					break;
				}
				myTweets();
				break;
			case "spotify-this-song":
				spotifyThis(argString);
				break;
			case "movie-this":
				movieThis(argString);
				break;
			case "do-what-it-says":
				if (argString.length > 0) {
					usage(appName, argString);
					break;
				}
				doIt();
				break;
			default:
				usage(appName, argString);
		}
	}

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
				if (!commandLine) {
					console.log("============== my-tweets ==============");
				}

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

	function spotifyThis(songName){
        var spotify = require('spotify');
        var printf = require('printf');

        var song = songName.length ? songName : "Whats my age again";

        spotify.search({ type: 'track', query: song }, function(err, data) {
			if ( err ) {
				console.log('Error occurred: ' + err);
				return;
			}

			if (!commandLine) {
				console.log("============== spotify-this-song " + songName + " ==============");
			}

			var items = data.tracks.items;
			var col1 = "";
			var col2 = "";
			var col3 = "";
			var col4 = "";
			var col5 = "";

			console.log("\tArtist\t\t\tSong Name\t\t\t\t\tSpotify Link\t\t\tAlbum\t\t\t\tTrack Number");

   			 for (var i=0; i<items.length; i++) {
   			 	col1 = JSON.stringify(items[i].artists[0].name, null, 2);
   			 	col2 = JSON.stringify(items[i].name, null, 2);
				col3 = JSON.stringify(items[i].uri, null, 2);
				col4 = JSON.stringify(items[i].album.name, null, 2);
				col5 = JSON.stringify(items[i].track_number, null, 2);

				console.log(printf("%-25s %-40s %-40s %-30s\t    %-3d", 
					(col1.replace(/"/g, ' ')).substr(0,25), 
					(col2.replace(/"/g, ' ')).substr(0,40), 
					(col3.replace(/"/g, ' ')).substr(0,40), 
					(col4.replace(/"/g, ' ')).substr(0,30), 
					(col5.replace(/"/g, ' ')).substr(0,3)));
   			 }
		});
    }

	// This function takes an array of words making the movie name
	function movieThis(movieName){
		var request = require('request');

		// Run a request to the OMDB API with the movie specified
		// If no movie is specified use Mr. Nobody.  Since each word
		// of the movie name is separated in the movieName array, it
		// needs to be joined together with "+" between each word.
		var movie = movieName.length ? movieName : "Mr. Nobody";

		request('http://www.omdbapi.com/?t=' + movie + '&y=&plot=short&tomatoes=true&r=json', 
			function (error, response, body) {
				if (!error && 
					response.statusCode == 200 &&
					JSON.parse(body)["Response"] == "True") {

					if (!commandLine) {
						console.log("============== movie-this " + movieName + " ==============");
					}

					console.log("Title: " + JSON.parse(body)["Title"]);
					console.log("Year: " + JSON.parse(body)["Year"]);
					console.log("IMDB Rating: " + JSON.parse(body)["imdbRating"]);
					console.log("Country: " + JSON.parse(body)["Country"]);
					console.log("Language: " + JSON.parse(body)["Language"]);
					console.log("Plot: " + JSON.parse(body)["Plot"]);
					console.log("Actors: " + JSON.parse(body)["Actors"]);
					console.log("Rotten Tomatoes Rating: " + JSON.parse(body)["tomatoRating"]);
					console.log("Rotton Tomatoes URL: " + JSON.parse(body)["tomatoURL"]);
				}
				else if (!error && response.statusCode == 200) {
					console.log(JSON.parse(body)["Error"]);
				}
				else {
					console.log(error);
				}
			});
	}

	function doIt(){

		commandLine = false;

    	// We will read the random.txt file
    	fs.readFile('random.txt', "utf8", function(err, data){

        	// Create an argument object to send to liri
        	var dataArray = data.split('\n'); // split each line in the file into an array

        	// For each line in the file execute the appropriate command.
        	// Note that there will be one emp line in the file so use length-1
        	for (var i=0; i<dataArray.length-1; i++) {
//       	for (var i=0; i<1; i++) {  // Just do once for now. The calls to 2 apis gets out of sync.
        		var args = dataArray[i].split(','); // split the line into an array of args
				if (args.length == 1) args.push("");
        		liri(args[0], args[1]);
        	}

        });
	}

	function usage(appName, argString){
		console.log("Warning: " + appName + " " + argString);
		console.log("Usage: node liri.js <command>");
		console.log("Where: command is one of the following:");
		console.log("    my-tweets");
		console.log("    spotify-this-song <song name here>");
		console.log("    movie-this <movie name here>");
		console.log("    do-what-it-says");
	}
}

liriBot();
