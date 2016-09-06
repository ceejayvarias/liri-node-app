var Twitter = require('twitter');

var keys = require('./keys.js');
var keyList = keys.twitterKeys; //extracting twitter keys

var response = process.argv[2]; //initiali responses
var media = process.argv[3];

//do what it says command
var fs = require('fs');

if (response === 'do-what-it-says') {
	var data = fs.readFileSync('random.txt', 'utf-8');
	var command = data.trim().split('"');
	response = command[0].trim();
	media = command[1];
};

var client = new Twitter({
  consumer_key: keyList.consumer_key,
  consumer_secret: keyList.consumer_secret,
  access_token_key: keyList.access_token_key,
  access_token_secret: keyList.access_token_secret
});

function formateDate (arr) {
	return arr.replace('+0000 ', '');
	// return arr[0] + arr[1] + arr[2] + arr[5] + arr[3];
}

//check if response is asking for my tweets
if (response === 'my-tweets') {
	var params = {screen_name: 'ceejayvarias'};
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
	  if (!error) {
	  	for (var i = 0; i < 20; i++) {
	  		console.log(formateDate(tweets[i].created_at) + ': ' + tweets[i].text);
	  	}
	  }
	});
}

//searching for song in spotify
var spotify = require('spotify');
var num; //default to set for the search object

if (response === 'spotify-this-song') {
	if (media) {
		num = 0;
	}
	else{
		media = "the sign";
		num = 4;
	} 

	spotify.search({ type: 'track', query: media }, function(err, data) {
	    if ( err ) {
	        console.log('Error occurred: ' + err);
	        return;
	    }
	    console.log("Artist: " + data.tracks.items[num].artists[0].name);
	    console.log("Song title: " + data.tracks.items[num].name);
	    console.log("Preview link: " + data.tracks.items[num].preview_url);
	    console.log("Album: " + data.tracks.items[num].album.name);
	});
}

//searching for movies using request
var request = require('request');

if (response === 'movie-this') {
	if (media) {
		num = 0;
	}
	else{
		media = "mr nobody";
		num = 4;
	} 

	request('http://www.omdbapi.com/?t=' + media + '&tomatoes=true&y=&plot=short&r=json', function (error, response, body) {

		// If the request was successful...
		if (!error && response.statusCode == 200) {
			var mov = JSON.parse(body);
			console.log('Title: ' + mov.Title);
			console.log('Year: ' + mov.Year);
			console.log('IMDB Rating: ' + mov.imdbRating);
			console.log('Country: ' + mov.Country);
			console.log('Language: ' + mov.Language);
			console.log('Plot: ' + mov.Plot);
			console.log('Actors: ' + mov.Actors);
			console.log('Rotten Tomato Rating: ' + mov.tomatoRating);
			console.log('Rotten Tomato URL: ' + mov.tomatoURL);
		}
	});
};


