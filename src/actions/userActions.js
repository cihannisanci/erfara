import React from "react";
import firebase from "firebase";

const PLACEHOLDER_PHOTO = "https://s-media-cache-ak0.pinimg.com/originals/96/bb/de/96bbdef0373c7e8e7899c01ae11aee91.jpg";

export function getUser(uuid) {
  return dispatch => {
    return firebase.database().ref('/users/' + uuid).once('value', snap => {
      const user = snap.val();
      dispatch({type: "GET_USER_SUCCESS", user});
    })
    .catch((error) => {
      console.log(error);
    });
  }
}

export function getUsers() {
  return dispatch => {
    return firebase.database().ref('/users').once('value', snap => {
      const users = snap.val();
      dispatch({type: "GET_USERS_SUCCESS", users});
    })
    .catch((error) => {
      console.log(error);
    });
  }
}

export function addUser(user) {
  return dispatch => {
    let updates = {};
    updates["users/" + user.uid + "/name"] = user.name;
    updates["users/" + user.uid + "/uid"] = user.uid;
    updates["users/" + user.uid + "/email"] = user.email;
    updates["users/" + user.uid + "/photo"] = user.photo;
    updates["users/" + user.uid + "/coverPhoto"] = PLACEHOLDER_PHOTO;
    updates["users/" + user.uid + "/buddies/7hJGDkRieEfhPiMnu1HGDF8w59V2"] = true;
    updates["users/7hJGDkRieEfhPiMnu1HGDF8w59V2/buddies/" + user.uid] = true;
    fetch(`https://pixabay.com/api/?key=4423887-ab96e540ffbe404d644032133&image_type=photo`).then(function(response) {
      if (response.ok) {
        return response.json();
      } else {
        return doAddUser(dispatch, user, updates);
      }
    }).then(function(json) {
      if (json && json.hits && json.hits.length > 0) {
        const index = getRandomInt(0, json.hits.length);
        updates["users/" + user.uid + "/coverPhoto"] = json.hits[index].webformatURL;
      }
      doAddUser(dispatch, user, updates);
    }).catch(function(error) {
      console.log("UH OH SHIT FUCKED UP: ", error);
    });
  }
}

function doAddUser(dispatch, userData, updates) {
  return firebase.database().ref().update(updates).then(snap => {
    dispatch({ type: "ADD_AUTHED_USER_SUCCESS", user: userData });
  });
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}
