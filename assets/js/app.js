var fetchBtn = document.getElementById('find-activity');
var favoriteBtn = document.getElementById('favorite');
var activityContainer = document.getElementById('activity-container');

const GIPHY_API_KEY = 'YZ340zDN7GxGfiO0CaEmo7tnJkwSmxA1';

function getFavorites() {
  var favorites = window.localStorage.getItem('favorites');
  if (favorites) {
    return JSON.parse(favorites);
  } else {
    return [];
  }
}

function setFavorite(activity, gifURL) {
  var favorites = getFavorites();
  for (var x = 0; x < favorites.length; x++) {
    if (favorites[x].activity === activity && favorites[x].gifURL === gifURL) {
      console.log('"' + activity + '" is already in your list with that specific gif.');
      return;
    }
  }
  favorites.push(
    {
      "activity": activity,
      "gifURL": gifURL,
    }
  );
  window.localStorage.setItem('favorites', JSON.stringify(favorites));

}

function getGiphyImg(searchDesc, activityType) { 
  var encodedActivity = encodeURIComponent(searchDesc);
  var requestUrl = 'https://api.giphy.com/v1/gifs/search?api_key=' + GIPHY_API_KEY + '&q=' + encodedActivity + '&lang=en';

  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (giphyData) {
      // Get gif data and create HTML elements
      var totalGifs = giphyData['data'].length;
      var img = document.createElement('img');

      if (totalGifs > 0) {
        console.log('Found ' + totalGifs + ' results for: ' + searchDesc + ' | ' + activityType);
        // Select a gif
        var selectedGifIndex = Math.floor(Math.random() * totalGifs);
        var gif = giphyData['data'][selectedGifIndex];
        
        // Set image attributes
        img.src = gif['images']['original']['url'];
        img.alt = gif['title'];
        img.id = 'gif';

        // Add element to page
        activityContainer.append(img);
      } else {
        // Send activity type as the new search description
        console.log('Found 0 results for: ' + searchDesc + ' | ' + activityType);
      
        getGiphyImg(activityType, activityType);
      }
      
    });
}

function getApi(e) {
  e.preventDefault();
  
  var requestUrl = 'https://www.boredapi.com/api/activity/';
  var activityType = document.getElementById('type-field').value;
  var totalParticipants = document.getElementById('participants-field').value;
  if (activityType != 'all') {
    requestUrl += '?type=' + activityType;
  }

  if (totalParticipants > 0) {
    requestUrl += '?participants=' + totalParticipants;
  }

  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var activityDesc = data['activity']; 
      var activityType = data['type']; 
      var p = document.createElement('p');

      p.textContent = activityDesc;
      p.id = 'activity';

      activityContainer.innerHTML = '';
      activityContainer.append(p);

      // Call Giphy API
      getGiphyImg(activityDesc, activityType);
    });
}

fetchBtn.addEventListener('click', getApi);
favoriteBtn.addEventListener('click', function () {
  var activity = document.getElementById('activity').textContent;
  var gif = document.getElementById('gif').src;

  setFavorite(activity, gif);
})