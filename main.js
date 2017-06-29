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
	$('#register-btn').on('click', function() {
		window.location.replace('register.html')
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
			
		}), function(error) {
			$('#errorMsg').show();
			$('#errorMsg').text(error.message);
		}
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

function animateIcon(){
	$('.roleIcon').css('border-bottom', '2px solid #F88B30')
}

$(document).ready(main);