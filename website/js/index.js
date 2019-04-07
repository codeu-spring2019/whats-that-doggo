const fileInput = document.getElementById('file-input');
fileInput.addEventListener('change', (e) => displayImage(e.target.files));

function displayImage(fileList) {
  let file = fileList[0];
  /* sets background image to uploaded file in fileList */
  document.getElementById('image-location').style.backgroundImage = "url(" + URL.createObjectURL(file) + ")";
}
