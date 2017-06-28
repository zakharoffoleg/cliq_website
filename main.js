var emailField = document.getElementById("emailField")
var passwordField = document.getElementById("passwordField")
var isBarber = false

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // redirect to UI
  } else {
  	// show login form
  }
});

function main() {
	$('#register-btn').on('click', function() {
		// redirect to registration page
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

	var email = emailField.value
	var password = passwordField.value

	if (email != "" && password != "") {

		//turn on the sign in animation
		
		firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
			$('#errorMsg').show();
			$('#errorMsg').text(error.message);
		})
	}
}

function register() {

	var firebaseRef = firebase.database().ref();

	var email = emailField.value
	var password = passwordField.value

	if (isBarber != null) {

		if (email != "" && password != "") {

			firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
			$('#errorMsg').show();
			$('#errorMsg').text(error.message);

			var user = firebase.auth().currentUser;
			var userID = user.uid;

			firebase.database().ref('users/' + userID).set({
				email: email,
				password: password,
				isBarber: isBarber
			})
		})
		} else {
			alert('Email or password fields are empty')
		}
	} else {
		alert('Select your role')
	}
}

function signOut() {
	firebase.auth().signOut().then(function() {
	  alert('signed out')
	}).catch(function(error) {
	  alert(error.message)
	});
}

function animateIcon(){
	//$('.roleIcon').className = "selectedIcon"
	$('.roleIcon').css('border-bottom', '2px solid #F88B30')
}

$(document).ready(main);