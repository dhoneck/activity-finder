// Grab HTML Elements
var fetchBtn = document.getElementById('find-activity');
var favoriteBtn = document.getElementById('favorite');
var activityContainer = document.getElementById('activity-container');
var modalContainer = document.getElementById('favorites-modal');
var viewFavorites = document.getElementById('view-favorites');
var closeFavorites = document.getElementById('close-favorites');
var modalBackground = document.getElementById('modal-background');
var favoritesContainer = document.getElementById('favorites-container');

const GIPHY_API_KEY = 'YZ340zDN7GxGfiO0CaEmo7tnJkwSmxA1';

// Gets favorite activities from local storage
function getFavorites() {
  var favorites = window.localStorage.getItem('favorites');
  if (favorites) {
    return JSON.parse(favorites);
  } else {
    return [];
  }
}

// Sets an activity as a favorite in local storage
function setFavorite(activity, gifURL) {
  var favorites = getFavorites();
  for (var x = 0; x < favorites.length; x++) {
    if (favorites[x].activity === activity && favorites[x].gifURL === gifURL) {
      console.log('"' + activity + '" is already in your list with that specific gif');
      return;
    }
  }
  favorites.push(
    {
      "activity": activity,
      "gifURL": gifURL,
    }
  );
  console.log('Adding "' + activity + '" to favorites');
  window.localStorage.setItem('favorites', JSON.stringify(favorites));
}

// Display favorites list to modal
function displayFavorites() {
  favoritesContainer.innerHTML = '';
  var favorites = getFavorites();

  var h2 = document.createElement('h2');
  h2.textContent = 'Favorites';
  h2.classList = 'is-size-2'
  favoritesContainer.append(h2)

  if (favorites.length > 0) {
    for (var x = 0; x < favorites.length; x++) {
      // Create elements
      var div = document.createElement('div');
      var h4 = document.createElement('h4');
      var img = document.createElement('img');

      // Add content and attributes to element
      div.classList.add('my-5');
      h4.textContent = favorites[x]['activity'];
      h4.classList = 'is-size-4 mb-2';
      img.src = favorites[x]['gifURL'];
      img.alt = favorites[x]['activity'];

      // Append objects
      div.append(h4);
      div.append(img);
      
      favoritesContainer.append(div);
    }
  } else {
    var p  = document.createElement('p');
    favoritesContainer.append(p);
  }
}

// Get a gif from Giphy API based on activity description
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

// Get activity from Bored API
function getActivity(e) {
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

// Event Listeners
// Displays an activity and gif when button is clicked
fetchBtn.addEventListener('click', getActivity);

// Adds current activity and gif to favorites when clicked
favoriteBtn.addEventListener('click', function (e) {
  e.preventDefault();
  try {
    var activity = document.getElementById('activity').textContent;
    var gif = document.getElementById('gif').src;
    setFavorite(activity, gif);
  } catch {
    console.log('No activity or gif to favorite');
  }
})

// Shows favorite activities and gifs on click
viewFavorites.addEventListener('click', function (e) {
  e.preventDefault();
  modalContainer.classList.add('is-active');
  displayFavorites();
})

// Closes favorites modal on modal button click
closeFavorites.addEventListener('click', function (e) {
  e.preventDefault();
  modalContainer.classList.remove('is-active');
})

// Closes favorites modal on modal background click
modalBackground.addEventListener('click', function (e) {
  e.preventDefault();
  modalContainer.classList.remove('is-active');
})
