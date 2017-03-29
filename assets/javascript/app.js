// Initialize Firebase
var config = {
    apiKey: "AIzaSyAkczMGfzEwU76C4tSkAzFXvYQYqjRAu3I",
    authDomain: "train-scheduler-2cde2.firebaseapp.com",
    databaseURL: "https://train-scheduler-2cde2.firebaseio.com",
    storageBucket: "train-scheduler-2cde2.appspot.com",
    messagingSenderId: "564554260109"
};
firebase.initializeApp(config);
//create a variable to hold the database
var database = firebase.database();

//creating the variables
var trainName = "";
var destination = "";
var firstTrainTime = "";
var frequency = "";
var nextArrival = "";
var currentTime = "";
var minutesAway = "";

// currentTime = moment().format("MM-DD-YYYY hh:mm:a");
// firstTrainTime = moment("03-27-2017 8:00 pm").format("MM-DD-YYYY hh:mm:a");


// console.log(firstTrainTime);
// console.log(currentTime);
// console.log(moment(firstTrainTime).toNow());



$("#add-train").on("click", function(){
	event.preventDefault();
	trainName = $("#trainName-input").val().trim();
	destination = $("#destination-input").val().trim();
	firstTrainTime = $("#firstTrain-input").val().trim();
	frequency = $("#frequency-input").val().trim();

	console.log(trainName);
	console.log(destination);
	console.log(firstTrainTime);
	console.log(frequency);

	database.ref().push({

        trainName: trainName,
        destination: destination,
        firstTrainTime: firstTrainTime,
        frequency: frequency,
        dateAdded: firebase.database.ServerValue.TIMESTAMP

    });
    // Clears all of the text-boxes
	$("#trainName-input").val("");
	$("#destination-input").val("");
	$("#firstTrain-input").val("");
	$("#frequency-input").val("");


});
database.ref().on("child_added", function(childSnapshot) {

  
      var firstTimeConverted = moment(childSnapshot.val().firstTrainTime, "hh:mm").subtract(1, "years");
      console.log(firstTimeConverted);

      var currentTime = moment();
      // Difference between the times
      console.log(currentTime);
      var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
      console.log(diffTime);
      var tRemainder = diffTime % childSnapshot.val().frequency;
      console.log(tRemainder);
      // Minute Until Train
      var tMinutesTillTrain = childSnapshot.val().frequency - tRemainder;

      // Next Train
      var nextTrain = moment().add(tMinutesTillTrain, "minutes");

      console.log(tMinutesTillTrain);
      console.log(nextTrain);

      // full list of items to the well
      $("#trains-view").append("<tr>" +
      	"<td id='trainName'>" + childSnapshot.val().trainName + "</td>" +
      	"<td id='destination'> " + childSnapshot.val().destination + "</td>" +
      	"<td id='frequency'> " + childSnapshot.val().frequency +" </td>" +
      	"<td id='nextArrival'> " + moment(nextTrain).format("hh:mm a") +" </td>" + 
      	"<td id='minutesAway'> " + tMinutesTillTrain +" </td>" + "</tr>");

    // Handle the errors
    }, function(errorObject) {
      console.log("Errors handled: " + errorObject.code);
    });

    // database.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function(snapshot) {

    //   // Change the HTML to reflect
    //   $("#trainName").html(snapshot.val().trainName);
    //   $("#destination").html(snapshot.val().destination);
    //   $("#nextArrival").html(snapshot.val().firstTrainTime);
    //   $("#frequency").html(snapshot.val().frequency);

    // });