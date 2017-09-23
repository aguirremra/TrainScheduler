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

  //push values to the database
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
    // console.log(sv);

    //minutes away
    var minutesAway = getNextArrival(sv.firstTime, sv.frequency);
    
    //next arrival
    var nextArrival = moment(moment().add(minutesAway, "minutes")).format("HH:mm");

    //push the data to the table
    $("tbody")
    .append("<tr><td>"+sv.trainName+"</td><td>"+sv.destination+"</td><td class='text-center'>"+sv.frequency+"</td><td class='text-center'>"+nextArrival+"</td><td class='text-center'>"+minutesAway+"</td></tr>");

  }, function(errorObject){
    console.log("Errors handled: " + errorObject.code);
  });

  //function to get next arrival
  function getNextArrival(firstTime, frequency){
    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    // Time apart (remainder)
    var tRemainder = diffTime % frequency;
    // Minute Until Train
    var minutesAway = frequency - tRemainder;
    return minutesAway;
  }

//form validator
$.validate({
  modules : 'date'
});