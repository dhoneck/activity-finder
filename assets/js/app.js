var fetchButton = document.getElementById('find-activity');
var activityContainer = document.getElementById('activity-container');

const GIPHY_API_KEY = 'YZ340zDN7GxGfiO0CaEmo7tnJkwSmxA1';


function getGiphyImg(activity) { 
  var encodedActivity = encodeURIComponent(activity);
  var requestUrl = 'https://api.giphy.com/v1/gifs/search?api_key=' + GIPHY_API_KEY + '&q=' + encodedActivity + '&limit=10&lang=en';

  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (giphyData) {
      // Get gif data and create HTML elements
      var gif = giphyData['data'][0];
      var br = document.createElement('br');
      var img = document.createElement('img');

      // Set image attributes
      img.src = gif['images']['original']['url'];
      img.alt = gif['title'];

      // Add elements to page
      activityContainer.append(br);
      activityContainer.append(img);
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
  console.log('Total participants: ' + totalParticipants);
  if (totalParticipants > 0) {
    console.log('Participants is greater than 0');
    requestUrl += '?participants=' + totalParticipants;
  } else {
    console.log('Participants is not greater than 0');
  }
  console.log('API URL: ' + requestUrl);

  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var activity = data['activity'];  
      activityContainer.textContent = activity;

      // Call Giphy API
      getGiphyImg(activity);
    });
}

fetchButton.addEventListener('click', getApi);