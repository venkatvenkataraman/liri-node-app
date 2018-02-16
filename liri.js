// liri.js can take in one of the following commands
// my-tweets
// spotify-this-song
// movie-this
// do-what-it-says

require("dotenv").config();
var keys=require("./keys.js");

var Twitter = require('twitter');
var client = new Twitter(keys.twitter);

var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);

//Following required for OMDB movie search
var request = require('request');

function processMyTweets(){
  console.log("MY TWEETS");
  // var params = {screen_name: 'nodejs'};
  var params = {screen_name: 'surven1060'};
  client.get('statuses/user_timeline', params, function(error, tweets, response) {
    if (!error) {
      maxTweets = tweets.length;
      if (tweets.length > 20){
        maxTweets = 20;
      }
      for (let index = 0; index < maxTweets; index++) {
         console.log("My Last Tweet #"+(index+1)+": " + tweets[index].text);
         console.log("Created At: " + tweets[index].user.created_at);
         console.log("======================================================")

      }
    }
  });
}

function spotifyThisSong(songToSearch){
  console.log("SPOTIFY THIS SONG");
  //This will show the following information about the song in your 
  //terminal/bash window
  // Artist(s)
  // The song's name
  // A preview link of the song from Spotify
  // The album that the song is from
  // If no song is provided then your program will default to "The Sign" by Ace of Base.

  console.log("Searching for this song: " + songToSearch);
  console.log("===================================");
  spotify.search({ type: 'track', query: songToSearch, limit:10 })
  .then(function(response) {
    // console.log(response);
    // console.log(response.tracks.items);
    // console.log(response.tracks);
    for (let index = 0; index < response.tracks.items.length; index++) {
      // console.log(response.tracks.items[index]);
      var artists = [];
      for (let artistCount = 0;artistCount<response.tracks.items[index].album.artists.length;
        artistCount++){
          artists.push(response.tracks.items[index].album.artists[artistCount].name);
        }
      console.log("#"+(index+1));
      console.log("Artists: "+ JSON.stringify(artists));
      console.log("Song Name: "+response.tracks.items[index].name);
      if (response.tracks.items[index].album.preview_url !== null){
        console.log("Preview URL: "+response.tracks.items[index].album.preview_url);
      }
      console.log("Album Song is from: "+response.tracks.items[index].album.name);
      console.log("==============================================================");
    }
  })
  .catch(function(err) {
    console.log('Error occurred: '+err);
  }); 
  
  // function(err, data) {
  //   if (err) {
  //     return console.log('Error occurred: ' + err);
  //   }
  // console.log(data); 
  // });
}

function processMovie(movieName){
  console.log("LET'S FIND THIS MOVIE");
  console.log("===================================");
  // * Title of the movie.
  // * Year the movie came out.
  // * IMDB Rating of the movie.
  // * Rotten Tomatoes Rating of the movie.
  // * Country where the movie was produced.
  // * Language of the movie.
  // * Plot of the movie.
  // * Actors in the movie.
  var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
  // console.log(queryUrl);
  request(queryUrl, function(error, response, body) {
  // If the request is successful
  // console.log(body);
    if (!error && response.statusCode === 200) {
    // Parse the body of the site and recover just the imdbRating
    // (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it).
        console.log("Movie Title: " + JSON.parse(body).Title);      
        console.log("Release Year: " + JSON.parse(body).Year);
        console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
        // console.log("Rotten Tomatoes: " + JSON.parse(body).Ratings);
        console.log("Country: " + JSON.parse(body).Country);
        console.log("Language: " + JSON.parse(body).Language);
        console.log("Plot: " + JSON.parse(body).Plot);
        console.log("Actors: " + JSON.parse(body).Actors);
    }
  });

}

if (process.argv[2] === "my-tweets") {
   processMyTweets();
}
else if (process.argv[2] === "spotify-this-song"){
    var songToSearch = "What's my age again";
    if (process.argv[3] != null){
      songToSearch = process.argv[3];
    }
    spotifyThisSong(songToSearch);
}
else if (process.argv[2] === "movie-this"){
    var movieName = process.argv[3];
    processMovie(movieName);
}
else if (process.argv[2] === "do-what-it-says"){
  console.log("DOING WHAT YOU SAID");
  console.log("===================================");
  //Using the fs Node package, LIRI will take the text inside of random.txt
  //and then use it to call one of LIRI's commands.
  //It should run spotify-this-song for "I Want it That Way," as follows the
  //text in random.txt.
  //Feel free to change the text in that document to test out the feature for other commands.
  var fs = require("fs");

  fs.readFile("random.txt", "utf8", function(error, data) {
      console.log(data);
      var command = data.split(",")[0];
      var arg = data.split(",")[1];
      if (command === "my-tweets"){
        processMyTweets();
      }
      else if (command === "spotify-this-song"){
        spotifyThisSong(arg);
      }
      else if (command === "movie-this"){
        spotifyThisSong(arg);
      }
  });
}




 



// request('http://www.google.com', function (error, response, body) {
//   console.log('error:', error); // Print the error if one occurred
//   console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
//   console.log('body:', body); // Print the HTML for the Google homepage.
// });






