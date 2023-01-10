var fetchButton = document.getElementById('find-activity');
var activityContainer = document.getElementById('activity-container');

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
  console.log('Fetching activity from: ' + requestUrl);
  console.log('API URL: ' + requestUrl);

  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      activityContainer.textContent = data['activity'];
    });
}

fetchButton.addEventListener('click', getApi);