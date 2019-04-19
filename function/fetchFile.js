/* Form of a Google Cloud Function URL (https://cloud.google.com/functions/docs/calling/http)
   "https://YOUR_REGION-YOUR_PROJECT_ID.cloudfunctions.net/FUNCTION_NAME"
*/


var url = 'https://us-central1-sp19-codeu-35-7727.cloudfunctions.net/predict';
var data = { } //An array within the displayImage implementation


//Handling the JSON body returned
var myList = document.querySelector('ul'); //Will contain dog breed on one line and score one the next

fetch(url, {
  method: 'POST', // or 'PUT'
  body: data, // data can be `string` or {object}!
  headers:{
    'Content-Type': 'application/json'
  }
})
.then(function(response) {
      if (!response.ok) {
        throw new Error("HTTP error, status = " + response.status);
      }
      return response.json();
    })
    .then(function(json) {
      var breed = document.createElement('li');
      breed.innerHTML = "Breed: " + response.label;
      myList.appendChild(breed);

      var score = document.createElement('li');
      score.innerHTML = "Score: " + response.score;
      myList.appendChild(score);
    })
    .catch(function(error) {
      var p = document.createElement('p');
      p.appendChild(
        document.createTextNode('Error: ' + error.message)
      );
      document.body.insertBefore(p, myList);
    });


