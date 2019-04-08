const fileInput = document.getElementById('file-input');
fileInput.addEventListener('change', (e) => displayImage(e.target.files));
fileInput.addEventListener('change', (e) => postImageToAutoML(e.target.files))

function displayImage(fileList) {
  let file = fileList[0];
  /* sets background image to uploaded file in fileList */
  document.getElementById('image-location').style.backgroundImage = "url(" + URL.createObjectURL(file) + ")";
}

function postImageToAutoML(fileList) {
  let file = fileList[0];
  fetch('https://us-central1-sp19-codeu-35-7727.cloudfunctions.net/predict', {
    method: 'POST',
    body: file
  }).then(
    response => response.json() // if the response is a JSON object
  ).then(
    success => console.log(success) // Handle the success response object
  ).catch(
    error => console.log(error) // Handle the error response object
  );
}