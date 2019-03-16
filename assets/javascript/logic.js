
///website is to provide up-to-date information about various trains, their arrival times and how many minutes remain until they arrive at their station.

///when adding trains, it should include:
///Train Name
///Destination
///First Train Time (military time)
///Frequency in minutes

///code app to calculate when the next train will arrive; this should be relative to the current time.
///USers from many different machines must be able to view same train times


// Initialize Firebase

// Initialize Firebase
var config = {
  apiKey: "AIzaSyB8O9Fljp2Lff0yDQB3Skck3mIckOhV-IE",
  authDomain: "trainscheduler2.firebaseapp.com",
  databaseURL: "https://trainscheduler2.firebaseio.com",
  projectId: "trainscheduler2",
  storageBucket: "trainscheduler2.appspot.com",
  messagingSenderId: "361082925603"
};
firebase.initializeApp(config);


//Variables
var database = firebase.database();

//  Button for adding trains
$("#add-train-btn").on("click", function(event) {
  event.preventDefault();

  // Grabs user input
  var trainName = $("#train-name-input").val().trim();
  var destination = $("#destination-input").val().trim();
  var firstTime = moment($("#first-input").val().trim(), "HH:mm").format("X");
  var freqTime = $("#freq-input").val().trim();

  // Creates local "temporary" object for holding train data
  var newTrain = {
    name: trainName,
    dest: destination,
    first: firstTime,
    freq: freqTime
  };

  // Uploads train data to the database
  database.ref().push(newTrain);

  // Logs everything to console
  console.log(newTrain.name);
  console.log(newTrain.dest);
  console.log(newTrain.first);
  console.log(newTrain.freq);

  alert("Train successfully added");

  // Clears all of the text-boxes
  $("#train-name-input").val("");
  $("#destination-input").val("");
  $("#first-input").val("");
  $("#freq-input").val("");

 
});

// Create Firebase event for adding train to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function (childSnapshot) {
  console.log(childSnapshot.val());

  // Store everything into a variable.
  var trainName = childSnapshot.val().name;
  var destination = childSnapshot.val().dest;
  var firstTime = childSnapshot.val().first;
  var freqTime = childSnapshot.val().rate;

  // Train Info
  console.log(trainName);
  console.log(destination);
  console.log(firstTime);
  console.log(freqTime);


  // format the train start time and frequency time
  var firstTimeFormat = moment.unix(firstTime).format("HH:mm");
  var freqTimeFormat = moment.unix(freqTime).format("00:mm");

  //calculate train times
    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
    console.log(firstTimeConverted);
// 
   // Current Time
  //  ===============================================================
  //This is where I am running into problems, the current time is continously updating, but I can't find the error in the code
  //==========================================================
   var currentTime = moment();
   console.log("CURRENT TIME: " + moment(currentTime).format("HH:mm"));

   
    // Difference between the times
    var diffTime = currentTime.diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);


    // Time apart (remainder)
    var tRemainder = diffTime % freqTime;
    console.log(tRemainder);

        // Minute Until Train
        var tMinutesTillTrain = freqTime - tRemainder;
        console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);


 // Next Train
 var nextTrain = currentTime.add(tMinutesTillTrain, "minutes");
 console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

 var formatNextTrain = moment(nextTrain).format("HH:mm");



  // Create the new row
  var newRow = $("<tr>").append(
    $("<td>").text(trainName),
    $("<td>").text(destination),
    $("<td>").text(freqTime),
    $("<td>").text(formatNextTrain),
    $("<td>").text(tMinutesTillTrain),
    

  );
  // Append the new row to the table
  $("#train-table > tbody").append(newRow);

  
});