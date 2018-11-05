// Initialize Firebase
var config = {
  apiKey: "AIzaSyCSPAKIZBY7lSEdCMKNxF9BouPiCu-B3Rk",
  authDomain: "whoville-train-schedule.firebaseapp.com",
  databaseURL: "https://whoville-train-schedule.firebaseio.com",
  projectId: "whoville-train-schedule",
  storageBucket: "",
  messagingSenderId: "672841641423"
};
firebase.initializeApp(config);

var database = firebase.database();

// Create variables 
var Name = "";
var Destination = "";
var FirstTrainTime = "";
var Frequency = "";

$("#submit").on("click", function () {
  Name = $("#trainName").val().trim();
  Destination = $('#destination').val().trim();
  First = moment($('#firstTrain').val().trim(), "HH:mm:ss").format("X");
  Frequency = $('#frequency').val().trim();

  if (Name != "" && Destination != "" && First != "" && Frequency != "") {
    database.ref().push({
      name: Name,
      dest: Destination,
      first: First,
      freq: Frequency,
    });
  }

  $('#trainName').val("");
  $('#destination').val("");
  $('#firstTrain').val("");
  $('#frequency').val("");

  return false;
});

database.ref().on("child_added", function (snapshot) {

  var name = snapshot.val().name;
  var destination = snapshot.val().dest;
  var trainFirst = snapshot.val().first;
  var trainFrequency = snapshot.val().freq;
  var currentTime = moment();
  var timeConverted = moment(currentTime).format("X");
  var firstTimeResult = moment(trainFirst, "X").subtract(1, "days");
  var diffTime = moment(timeConverted, "X").diff(moment(firstTimeResult, "X"), "minutes");
  var trainLogic = diffTime % trainFrequency;
  var trainMinutes = trainFrequency - trainLogic;

  var nextTrain = moment().add(trainMinutes, "minutes");
  if (timeConverted > trainFirst) {
    $("#table > tbody").append("<tr><td>" + name + "</td><td>"
      + destination + "</td><td>"
      + trainFrequency + "</td><td>"
      + moment(nextTrain).format("hh:mm A") + "</td><td>"
      + trainMinutes + "</td></tr>");

  } 
  
  else {
    $("#table > tbody").append("<tr><td>" + name + "</td><td>"
      + destination + "</td><td>"
      + trainFrequency + "</td><td>"
      + moment(trainFirst, "X").format("hh:mm A") + "</td><td>"
      + trainMinutes + "</td></tr>");
  }
}, function (errorObject) {

  console.log("Errors handled: " + errorObject.code)
})



