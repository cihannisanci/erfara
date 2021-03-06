import firebase from '../actions/database';

const PIXABAY_KEY = "4423887-ab96e540ffbe404d644032133";

export function getPhoto(searchTerm) {
  const photoParam = searchTerm ? `&q=${searchTerm}` : ""; 
  return new Promise((resolve, reject) => {
    fetch(`https://pixabay.com/api/?key=${PIXABAY_KEY}${photoParam}&image_type=photo`).then(response => {
      if (response.ok) {
        return response.json();
      } else {
        reject(new Error(response.statusText));
      }
    }).then(json => {
      if (json && json.hits && json.hits.length > 0) {
        const url = searchTerm ? 
          json.hits[0].webformatURL : 
          json.hits[getRandomInt(0, json.hits.length)].webformatURL;
        return fetch(url);
      }
    }).then(response => {
      if (response && response.ok) {
        return response.blob();
      } else {
        reject(new Error(response.statusText));
      }
    }).then(blob => {
      resolve(blob);
    }).catch(error => {
      resolve(error);
    });
  });
}

export function uploadFile(file) {
  return new Promise((resolve, reject) => {
    var storageRef = firebase.storage().ref();
    // Create the file metadata
    var metadata = {
      contentType: 'image/jpeg'
    };

    // Upload file and metadata to the object 'images/mountains.jpg'
    var uploadTask = storageRef.child('images/' + new Date().getTime()).put(file, metadata);
    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
      snapshot => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED:
            console.log('Upload is paused');
            break;
          case firebase.storage.TaskState.RUNNING:
            console.log('Upload is running');
            break;
          default: break;
        }
      }, error => {
      switch (error.code) {
        case 'storage/unauthorized':
        case 'storage/canceled':
        case 'storage/unknown': 
        default: break;
      }
      reject(error);
    }, function() {
      resolve(uploadTask.snapshot.downloadURL);
    });
  });
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}
