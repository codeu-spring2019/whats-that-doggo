/* Form of a Google Cloud Function URL (https://cloud.google.com/functions/docs/calling/http)
   "https://YOUR_REGION-YOUR_PROJECT_ID.cloudfunctions.net/FUNCTION_NAME"
*/
const PREDICTION_PROXY_URL =
  "https://us-central1-sp19-codeu-35-7727.cloudfunctions.net/predict"

// File input
const fileInput = document.getElementById("file-input")
fileInput.addEventListener("change", e => {
  console.log("image uploaded")
  let f = displayImage(e.target.files) //files property is a FileList object
  makePrediction(f, PREDICTION_PROXY_URL)
})

//Handling a FileList object (aka the uploaded image)

function displayImage(fileList) {
  let file = fileList[0] //Since we only allow them to upload one image
  /* sets background image to uploaded file in fileList */
  document.getElementById("image-location").style.backgroundImage =
    "url(" + URL.createObjectURL(file) + ")"
  return file
}

function makePrediction(file, url) {
  console.log("making prediction")
  let formData = new FormData()
  formData.append("image", file)

  //Calls fetch on the uploaded image
  fetch(url, {
    method: "POST",
    body: formData
  })
    .then(response => {
      console.log("successful response")
      // Path #1 from fetch call
      return response.json()
    })
    .then(data => {
      console.log(JSON.stringify(data))
      // Update (not creates, unhide if needed) the HTML elements
      // Get the breed (which is stored in the response's label)
      let breedElement = document.getElementById("dog-breed")
      breedElement.innerText = data.label

      // Get the image's confidence score (store in the response's score)
      let scoreElement = document.getElementById("prediction-score")
      scoreElement.innerText = data.score

      // Show the results
      let resultDiv = document.getElementById("prediction-results")
      resultDiv.style.display = ""
    })
    .catch(err => {
      // Path #2 from fetch call
      console.log(`prediction failed: ${err}`)
      JSON.stringify(err) //Unwraps the error object

      let errorMessage = document.getElementById("error-message")
      errorMessage.innerText = "Error: " + err.error
    })
}
