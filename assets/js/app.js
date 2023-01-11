var fetchButton = document.getElementById('find-activity');
var activityContainer = document.getElementById('activity-container');

const GIPHY_API_KEY = 'YZ340zDN7GxGfiO0CaEmo7tnJkwSmxA1';


function getGiphyImg(activityDesc, activityType) { 
  var encodedActivity = encodeURIComponent(activityDesc);
  var requestUrl = 'https://api.giphy.com/v1/gifs/search?api_key=' + GIPHY_API_KEY + '&q=' + encodedActivity + '&lang=en';

  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (giphyData) {
      // Get gif data and create HTML elements
      var totalGifs = giphyData['data'].length;
      var br = document.createElement('br');
      var img = document.createElement('img');

      if (totalGifs > 0) {
        // Select a gif
        var selectedGifIndex = Math.floor(Math.random() * totalGifs);
        var gif = giphyData['data'][selectedGifIndex];
        
        // Set image attributes
        img.src = gif['images']['original']['url'];
        img.alt = gif['title'];

        // Add elements to page
        activityContainer.append(br);
        activityContainer.append(img);
      } else {
        // Select a gif based on type
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
      activityContainer.textContent = activityDesc;

      // Call Giphy API
      getGiphyImg(activityDesc, activityType);
    });
}

fetchButton.addEventListener('click', getApi);