/* Form of a Google Cloud Function URL (https://cloud.google.com/functions/docs/calling/http)
   "https://YOUR_REGION-YOUR_PROJECT_ID.cloudfunctions.net/FUNCTION_NAME"
*/


var url = 'https://us-central1-predict.sp19-codeu-35-7727.cloudfunctions.net/predict';
var data = { } //An array within the displayImage implementation

fetch(url, {
  method: 'POST', // or 'PUT'
  body: data, // data can be `string` or {object}!
  headers:{
    'Content-Type': 'application/json'
  }
}).then(res => res.json())
.then(response => console.log(JSON.stringify(response))) //Should return the image's predicted label (aka the breed) and the score
.catch(error => console.error('Error:', error));