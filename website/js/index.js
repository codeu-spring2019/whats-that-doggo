const fileInput = document.getElementById('file-input');
fileInput.addEventListener('change', (e) => displayImage(e.target.files));

function displayImage(fileList) {
  let file = null;

  for(let i = 0; i < fileList.length; i++) {
    //looking for image type in file list
    if(fileList[i].type.match(/^image\//)) {
      file = fileList[i];
      break;
    }
  }

  if(file !== null) {
    document.getElementById('image-location').style.backgroundImage = "url(" + URL.createObjectURL(file) + ")";
  }
}
