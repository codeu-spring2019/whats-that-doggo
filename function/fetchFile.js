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

//HTML input element with an accept filter that indicates you only want image files
//Didn't use capture attribute since the user can decide which type of image they want to upload
<input type="file" accept = "image/*" id = "file-input">



//Javascript
<script>

//File input
const fileInput = document.getElementById('file-input');
fileInput.addEventListener('change', (e) => displayImage(e.target.files)); //files property is a FileList object

//Handling a FileList object (aka the uploaded image)

function displayImage(fileList) {
  let file = fileList[0]; //Since we only allow them to upload one image

  /* sets background image to uploaded file in fileList */
  document.getElementById('image-location').style.backgroundImage = "url(" + URL.createObjectURL(file) + ")";
}


var url = 'https://us-central1-sp19-codeu-35-7727.cloudfunctions.net/testPredict';

function makePrediction(file,url) {
    //Calls fetch on the uploaded image
    fetch(url, {
      method: 'POST',
      body: file, // data can be `string` or {object}!
      headers:{
        'Content-Type': 'application/json'
      }
    })
    .then(function(response) { //Path #1 from fetch call
          let data = response.json();

          //Update (not creates, unhide if needed) the HTML elements

          //Get the breed (which is stored in the response's label)
          let breedElement = document.getElementById("dog-breed");
          breedElement.innerText = data.label;

          //Get the image's confidence score (store in the response's score)
          let scoreElement = document.getElementById("prediction-score");
          scoreElement.innerText = data.score

          let resultDiv = document.getElementById("prediction-results")
          resultDiv.style.display = "Breed: " + resultDiv.getElementById("dog-breed") + ", Score: " + getElementById("prediction-score");


    })
    .catch(function(err) { //Path #2 from fetch call
          JSON.stringify(err); //Unwraps the error object

          let error_message = document.getElementById("error-message");
          error_message.innerText = "Error: " + err.error;

          let errorDiv = document.getElementById("prediction-error");
          errorDiv.style.display = errorDiviv.getElementById("error-message");
    });

}
</script>
