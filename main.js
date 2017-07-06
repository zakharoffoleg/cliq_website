var emailField = document.getElementById("emailField")
var passwordField = document.getElementById("passwordField")
var isBarber = null

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
  	$('#signOutBtn').show()
    // redirect to UI
  } else {
  	$('#signOutBtn').hide()
  	// show login form
  }
});


function main() {

	
	firebase.database().ref('requests/').on('value', function(snapshot) {	

		var userID = firebase.auth().currentUser.uid

		firebase.database().ref('/users/' + userID).once('value').then(function(getVal) {
			var readyStatus = getVal.val().isReady
			if (readyStatus) {
				console.log(readyStatus)
				var conf = confirm('Client has been found. Accept request?')
			}
		})
	})

	$('.redirectBtn').on('click', function() {
		if ($(this).attr('id') === 'registerRedirectBtn') {
			window.location.replace('register.html')
		} else if ($(this).attr('id') === 'loginRedirectBtn') {
			window.location.replace('login.html')
		} else {
			//wrong button id
			console.log('error')
		}
		
	})

	$('#getStartedBtn').on('click', function() {

		if (firebase.auth().currentUser) {

			var userID = firebase.auth().currentUser.uid

			firebase.database().ref('/users/' + userID).once('value').then(function(snapshot) {
  				if (snapshot.val().userIsBarber === true) {
  					window.location.replace('barber_map.html')
  				} else {
  					window.location.replace('map.html')
  				}
			});

		} else {
			window.location.replace('login.html')
		}
	})

	$('.roleIcon').on('click', function() {

		if ($(this).attr("src") === 'scissors.png') {
			isBarber = true
		} else if ($(this).attr("src") === 'man_hair.jpg') {
			console.log('client')
			isBarber = false
		} else {
			isBarber = null
		}

		if ($(this).css('border-bottom') != '2px solid #F88B30') {
			$('.roleIcon').css('border-bottom', '2px solid #ccc');
			$(this).css('border-bottom', '2px solid #F88B30');
		} else {
			$(this).css('border-bottom', '2px solid #F88B30')
		}	
	})
}

function login() {

	var firebaseRef = firebase.database().ref();

	var shaObj = new jsSHA("SHA-256", "TEXT")
	shaObj.update(passwordField.value)
	
	var email = emailField.value
	var password = shaObj.getHash("HEX")

	if (email != "" && password != "") {

		//turn on the sign in animation
		
		firebase.auth().signInWithEmailAndPassword(email, password).then(function(user) {

			$('#errorMsg').hide();

			//redirect to UI
			window.location.replace('main_page.html')
			
		}, function(error) {
			$('#errorMsg').show();
			$('#errorMsg').text(error.message);
		})
	} else {
		$('#errorMsg').show();
		$('#errorMsg').text('Email or password field is empty');
	}
}

function register() {

	var firebaseRef = firebase.database().ref();

	var shaObj = new jsSHA("SHA-256", "TEXT")
	shaObj.update(passwordField.value)

	var email = emailField.value
	var password = shaObj.getHash("HEX")

	if (isBarber != null) {

		if (email != "" && password != "") {

			firebase.auth().createUserWithEmailAndPassword(email, password).then(function(user) {

				var userID = user.uid;

  				firebase.database().ref('users/' + userID).set({
					userEmail: email,
					userPassword: password,
					userIsBarber: isBarber
				})

				$('#errorMsg').hide();

				//redirect to UI
				window.location.replace('main_page.html')

			}, function(error) {
  				$('#errorMsg').show();
  				$('#errorMsg').text(error.message);
			});			
		} else {
			$('#errorMsg').show();
  			$('#errorMsg').text('Email or password fields are empty');
		}
	} else {
		$('#errorMsg').show();
  		$('#errorMsg').text('Select your role');
	}
}


function signOut() {
	firebase.auth().signOut().then(function() {

	  //redirect to main page
	  window.location.replace('main_page.html')

	}).catch(function(error) {
	  alert(error.message)
	});
}

function map() {

	var User = firebase.auth().currentUser
	var mapCheck = window.location.pathname.split('/')

	if (User) {

		if (mapCheck[mapCheck.length - 1] === 'map.html') {

		var userID = firebase.auth().currentUser.uid

		firebase.database().ref('/users/' + userID).once('value').then(function(getVal) {
			var currentLocation = getVal.val().origin
			$('#map').attr('src', 'https://www.google.com/maps/embed/v1/directions?key=AIzaSyB0ZdKM6SiqkeKI9PyYeVr_WwX0IBlXkCI&origin=' + currentLocation + '&destination=Helsinki&mode=transit&avoid=ferries|tolls|highways')

		})

		}
	}
}

function isReady() {

	var userID = firebase.auth().currentUser.uid

	firebase.database().ref('/users/' + userID).once('value').then(function(getVal) {

		var readyStatus = getVal.val().isReady
		//console.log(readyStatus)
		
		
		if (!readyStatus) {

			var confActivate = confirm('Are you ready for Cliq?')
			//console.log(confActivate)

			if (confActivate) {

				firebase.database().ref('users/' + userID).update({
	    			isReady: true
				})

				readyStatus = true

				$('#callCliqBtn').text('Stop Cliq')
			}
		} else {

			var confDeactivate = confirm('Done cliqing?')
			if (confDeactivate) {

				firebase.database().ref('users/' + userID).update({
	    			isReady: false
				})
				readyStatus = false
				confActivate = false
				$('#callCliqBtn').text('Find Cliq')
			}
			//console.log(confActivate)
			//console.log(readyStatus)
		}
  	})
}

function saveOrigin() {

	var originTextField = document.getElementById("originTextField")
	var origin_input = originTextField.value

	var origin = origin_input.replace(/ /g, "+")
	console.log(origin)

	//localStorage.setItem('origin', origin)

	$('#map').attr('src', 'https://www.google.com/maps/embed/v1/directions?key=AIzaSyB0ZdKM6SiqkeKI9PyYeVr_WwX0IBlXkCI&origin=' + origin + '&destination=Helsinki&mode=transit&avoid=ferries|tolls|highways')

	/*var userID = firebase.auth().currentUser.uid;

    firebase.database().ref('users/' + userID).update({
     origin: origin
   })*/

   // send cliq request to database

   var requestRef = firebase.database().ref('requests/').push({

    // some request attributes

    isAccepted: false,
    isFinished: false,
    clientLocation: origin,
    requestTime: new Date()
   })
}

function saveLocation() {

	var locationTextField = document.getElementById("originTextField")
	var locationInput = locationTextField.value

	var location = locationInput.replace(/ /g, "+")
	//console.log(location)

	var userID = firebase.auth().currentUser.uid;

    firebase.database().ref('users/' + userID).update({
    	location: location
  	})
}

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

function animateIcon(){
	$('.roleIcon').css('border-bottom', '2px solid #F88B30')
}

$(document).ready(main);