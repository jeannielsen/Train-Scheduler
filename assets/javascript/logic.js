// Initialize Firebase

var config = {
  apiKey: "AIzaSyB8O9Fljp2Lff0yDQB3Skck3mIckOhV-IE",
  authDomain: "trainscheduler2.firebaseapp.com",
  databaseURL: "https://trainscheduler2.firebaseio.com",
  projectId: "trainscheduler2",
  storageBucket: "trainscheduler2.appspot.com",
  messagingSenderId: "361082925603"
};
// ========need to add to project apikey==============

firebase.initializeApp(config);


//Variables
var database = firebase.database();

//  Button for adding items
$("#add-item-btn").on("click", function(event) {
  event.preventDefault();

  // Grabs user input
  var itemName = $("#item-input").val().trim();
  var sizeName = $("#size-input").val().trim();
  var quantityName = ($("#quantity-input").val().trim();

  // Creates local "temporary" object for holding train data
  var newOrder = {
    name: itemName,
    destination: trainDestination,
    start: trainStart,
    freq: trainFreq
  };

  // Uploads train data to the database
  database.ref().push(newTrain);

  // Logs everything to console
  console.log(newTrain.name);
  console.log(newTrain.destination);
  console.log(newTrain.start);
  console.log(newTrain.freq);

  alert("Train successfully added");

  // Clears all of the text-boxes
  $("#train-name-input").val("");
  $("#destination-input").val("");
  $("#start-input").val("");
  $("#freq-input").val("");

 
});

// Create Firebase event for adding train to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function (childSnapshot) {
  console.log(childSnapshot.val());

  // Store everything into a variable.
  var trainName = childSnapshot.val().name;
  var trainDestination = childSnapshot.val().destination;
  var trainStart = childSnapshot.val().start;
  var trainFreq = childSnapshot.val().freq;

  // Train Info
  console.log(trainName);
  console.log(trainDestination);
  console.log(trainStart);
  console.log(trainFreq);


  // format the train start time and frequency time
  var startTimeFormat = moment.unix(trainStart).format("HH:mm");
  var freqTimeFormat = moment.unix(trainFreq).format("00:mm");

  //calculate train times
    // First Time (pushed back 1 year to make sure it comes before current time)
    var trainStartConverted = moment(trainStart, "HH:mm").subtract(1, "years");
    console.log(trainStartConverted);
// 
   // Current Time
 
   var currentTime = moment();
   console.log("CURRENT TIME: " + moment(currentTime).format("HH:mm"));

   
    // Difference between the times
    var diffTime = currentTime.diff(moment(trainStartConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);


    // Time apart (remainder)
    var tRemainder = diffTime % trainFreq;
    console.log(tRemainder);

        // Minutes Until Train
        var tMinutesTillTrain = trainFreq - tRemainder;
        console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);


 // Next Train
 var nextTrain = moment().add(tMinutesTillTrain, "minutes");
 console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

 var formatNextTrain = currentTime.add(nextTrain).format("HH:mm");

  // Create the new row
  var newRow = $("<tr>").append(
    $("<td>").text(trainName),
    $("<td>").text(trainDestination),
    $("<td>").text(trainFreq),
    $("<td>").text(formatNextTrain),
    $("<td>").text(tMinutesTillTrain),
    

  );
  // Append the new row to the table
  $("#train-table > tbody").append(newRow);

  
});