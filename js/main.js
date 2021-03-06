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

	// autodelete finished requests

	firebase.database().ref('requests/').on('value', function(snapshot) {

		for (var i in snapshot.val()) {
	   		if (snapshot.val()[i].isFinished || snapshot.val()[i].isCanceled) {
	    		firebase.database().ref('requests/' + i).remove()
	    		console.log(i)
	   		}
	  	} 
	})


	firebase.database().ref('requests/').on('value', function(snapshot) {	

		var userID = firebase.auth().currentUser.uid
		firebase.database().ref('/users/' + userID).once('value').then(function(getVal) {
			var readyStatus = getVal.val().isReady
			var busyStatus = getVal.val().isBusy
			if (readyStatus) {
				console.log(busyStatus)
				if (!busyStatus) {
					//console.log(readyStatus)
					//console.log(snapshot.val())
					for (var i in snapshot.val()) {
						if (!snapshot.val()[i].isAccepted) {
							var conf = confirm('Client has been found at ' + snapshot.val()[i].clientLocation)
							if (conf) {
								firebase.database().ref('requests/' + i).update({
		    						isAccepted: true,
		    						barberID: userID
								})
								firebase.database().ref('users/' + userID).update({
									isBusy: true
								})
								break;
							}
						}
					}
				}	
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
  				if (snapshot.val().isBarber === true) {
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
				/*
  				firebase.database().ref('users/' + userID).set({
					email: email,
					password: password,
					isBarber: isBarber
				})
				*/
				firebase.database().ref('users/' + userID).set({
					email: email,
					password: password,
					isBarber: isBarber,
					isBusy: false,
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

/*
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
*/

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

function animateIcon(){
	$('.roleIcon').css('border-bottom', '2px solid #F88B30')
}

$(document).ready(main);
