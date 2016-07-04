// Includes the FS package for reading and writing files 
function liriBot() {

	var fs = require('fs');


	switch(process.argv[2]){
		case "my-tweets":
			if (process.argv.length != 3) {
				usage();
				break;
			}
			myTweets();
			break;
		case "spotify-this-song":
			spotifyThis(process.argv.splice(3, process.argv.length - 3));
			break;
		case "movie-this":
			movieThis(process.argv.splice(3, process.argv.length - 3));
			break;
		case "do-what-it-says":
			if (process.argv.length != 3) {
				usage();
				break;
			}
			doIt();
			break;
		default:
			usage();
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

        var song = songName.length ? songName.join('+'): "Whats+my+age+again";

        spotify.search({ type: 'track', query: song }, function(err, data) {
			if ( err ) {
				console.log('Error occurred: ' + err);
				return;
			}

			//console.log(JSON.stringify(data.tracks, null, 2);

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
		var movie = movieName.length ? movieName.join('+') : "Mr.+Nobody";

		request('http://www.omdbapi.com/?t=' + movie + '&y=&plot=short&tomatoes=true&r=json', 
			function (error, response, body) {
				if (!error && 
					response.statusCode == 200 &&
					JSON.parse(body)["Response"] == "True") {
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

	}

	function usage(){
		console.log("Usage: node liri.js <command>");
		console.log("Where: command is one of the following:");
		console.log("    my-tweets");
		console.log("    spotify-this-song <song name here>");
		console.log("    movie-this <movie name here>");
		console.log("    do-what-it-says");
	}
}

liriBot();
