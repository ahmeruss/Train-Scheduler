// Initialize Firebase
var config = {
  apiKey: "AIzaSyC0PsdA3V5Wa2X_uayYCE6mnS7EJeBOhWk",
  authDomain: "train-scheduler-4eada.firebaseapp.com",
  databaseURL: "https://train-scheduler-4eada.firebaseio.com",
  storageBucket: "train-scheduler-4eada.appspot.com",
  messagingSenderId: "792707784329"
};
firebase.initializeApp(config);

var database = firebase.database();

// Initial Values
var trainName = "";
var destination = "";
var firstTrainTime = "";
var frequency = 0;
var nextArrival = null;
var minutesAway = null;
var currentTime = moment();

// Show current time
var datetime = null,
date = null;

var update = function () {
  date = moment(new Date())
  datetime.html(date.format('dddd, MMMM Do YYYY, h:mm:ss a'));
};

$(document).ready(function(){
  datetime = $('#current-status')
  update();
  setInterval(update, 1000);
});


// Capture Button Click
$("#add-train").on("click", function() {

  // Grabbed values from text boxes
  trainName = $("#train-name").val().trim();
  destination = $("#destination").val().trim();
  firstTrainTime = $("#train-time").val().trim();
  frequency = $("#frequency").val().trim();
  
  // First Time (pushed back 1 year to make sure it comes before current time)
  var firstTimeConverted = moment(firstTrainTime, "hh:mm").subtract(1, "years");
  //console.log("FTC: "+firstTimeConverted);

  // Difference between the times
  var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
  //console.log("Difference in time: " + diffTime);

  // Time apart (remainder)
  var tRemainder = diffTime % frequency;
  //console.log(tRemainder);

  // Minute Until Train
  minutesAway = frequency - tRemainder;
  //console.log("Minutes away: " + minutesAway);

  // Next Train
  nextTrain = moment().add(minutesAway, "minutes");
  //console.log("Arrival time: " + moment(nextTrain).format("hh:mm"));

  // Arrival time
  nextArrival = moment(nextTrain).format("hh:mm a");


  // Code for handling the push
  database.ref().push({
    trainName: trainName,
    destination: destination,
    firstTrainTime: firstTrainTime,
    frequency: frequency,
    minutesAway: minutesAway,
    nextArrival: nextArrival,
    dateAdded: firebase.database.ServerValue.TIMESTAMP
  });
  
  alert("Form submitted!");

  // Empty text input
  $("#train-name").val("");
  $("#destination").val("");
  $("#train-time").val("");
  $("#frequency").val("");
  // Don't refresh the page!
  return false; 
});

// Firebase watcher + initial loader HINT: This code behaves similarly to .on("child_added")
// This will only show the 10 latest entries
  database.ref().orderByChild("dateAdded").limitToLast(10).on("child_added", function(snapshot) {

  // Change the HTML to reflect
  $("#new-train").append("<tr><td>" + snapshot.val().trainName + "</td>" +
    "<td>" + snapshot.val().destination + "</td>" + 
    "<td>" + "Every " + snapshot.val().frequency + " mins" + "</td>" + 
    "<td>" + snapshot.val().nextArrival + "</td>" +
    "<td>" + snapshot.val().minutesAway + " mins until arrival" + "</td>" +
    "</td></tr>");

// Handle the errors
}, function(errorObject) {
  console.log("Errors handled: " + errorObject.code);
});


// References:
// In class activites: 
// RecentUser_withAllUsers.html
// Train Example
