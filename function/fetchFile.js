/* Form of a Google Cloud Function URL (https://cloud.google.com/functions/docs/calling/http)
   "https://YOUR_REGION-YOUR_PROJECT_ID.cloudfunctions.net/FUNCTION_NAME"
*/

//HTML that saves the breed and score from the returned JSON body
<div id="prediction-results" style="display: none">
<span class="label">Breed: </span><span id="dog-breed" class="score"></span> //Can access with getElementById
<span class="label">Confidence: </span><span id="prediction-score" class="score"></span> //Can access with getElementById
</div>

//HTML for the error message
<div id="prediction-error" style="display: none">
<span class="p">ErrorMessage: </span><span id="error-message" class="score"></span> //Can access with getElementById
</div>


//Javascript
var url = 'https://us-central1-sp19-codeu-35-7727.cloudfunctions.net/predict';
var data = { } //An array within the displayImage implementation

if (!data.type.match("image/*") {
    throw new Error("data is not of the type image");
}


fetch(url, {
  method: 'POST', // or 'PUT'
  body: data.type.match, // data can be `string` or {object}!
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
      //Get the breed (which is stored in the response's label)
      let breedElement = document.getElementById("dog-breed");
      breedElement.innerText = response.label;

      //Get the image's confidence score (store in the response's score)
      let scoreElement = document.getElementById("prediction-score");
      scoreElement.innerText = response.score

      let resultDiv = document.getElementById("prediction-results")
      resultDiv.style.display = "Breed: " + resultDiv.getElementById("dog-breed") + ", Score: " + getElementById("prediction-score");


    })
    .catch(function(error) {
      let error_message = document.getElementById("error-message");
      error_message.innerText = "Error: " + error.message;

      let errorDiv = document.getElementById("prediction-error");
      errorDiv.style.display = errorDiviv.getElementById("error-message");
    });


