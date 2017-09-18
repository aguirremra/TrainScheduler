  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDzG-8k0S1sfuvdaB9tdUv3VInIcoElLP0",
    authDomain: "trainscheduler-fd416.firebaseapp.com",
    databaseURL: "https://trainscheduler-fd416.firebaseio.com",
    projectId: "trainscheduler-fd416",
    storageBucket: "trainscheduler-fd416.appspot.com",
    messagingSenderId: "1098684706354"
  };
  firebase.initializeApp(config);

  var database = firebase.database();

  //initial values
  var trainName = "";
  var destination = "";
  var firstTime = "";
  var frequency = "";

$("#submit").on("click", function(){
  event.preventDefault();

  //get data elements from form
  trainName = $("#train-name").val().trim();
  destination = $("#destination").val().trim();
  firstTime = $("#first-time").val().trim();
  frequency = $("#frequency").val().trim();


  console.log(trainName);


  database.ref().push({
    trainName: trainName,
    destination: destination,
    firstTime: firstTime,
    frequency: frequency,
    firstAdded: firebase.database.ServerValue.TIMESTAMP
  })

});

  //Firebase watcher
  database.ref().on("child_added", function(snapshot){

    var sv = snapshot.val();

    console.log(sv);
    console.log(sv.trainName);
    console.log(sv.destination);
    console.log(sv.firstTime);
    console.log(sv.frequency);

    var minutesTillTrain = getNextArrival(sv.firstTime, sv.frequency);
    console.log("min til train: " + minutesTillTrain);
    
    // Next Train
    var nextArrival = moment(moment().add(minutesTillTrain, "minutes")).format("HH:mm");
    console.log("ARRIVAL TIME: " + nextArrival);

    $("tbody")
    .append("<tr><td>"+sv.trainName+"</td><td>"+sv.destination+"</td><td>"+sv.frequency+"</td><td>"+nextArrival+"</td><td>"+minutesTillTrain+"</td></tr>");

  }, function(errorObject){
    console.log("Errors handled: " + errorObject.code);
  });

  function getNextArrival(firstTime, frequency){
    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
    console.log("first time converted: " + moment(firstTimeConverted).format("HH:mm"));
    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);
    // Time apart (remainder)
    var tRemainder = diffTime % frequency;
    console.log("time remainder" + tRemainder);
    // Minute Until Train
    var minutesTillTrain = frequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + minutesTillTrain);
    return minutesTillTrain;
  }