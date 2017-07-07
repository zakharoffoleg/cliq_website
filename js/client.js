
function saveOrigin() {

	var userID = firebase.auth().currentUser.uid;

	firebase.database().ref('users/' + userID).once('value', function(snapshot) {

		var busyStatus = snapshot.val().isBusy

		if (!busyStatus) {
			console.log('ya ne daun')

			var originTextField = document.getElementById("originTextField")
			var origin_input = originTextField.value

			var origin = origin_input.replace(/ /g, "+")
			console.log(origin)

			//localStorage.setItem('origin', origin)

			$('#map').attr('src', 'https://www.google.com/maps/embed/v1/directions?key=AIzaSyB0ZdKM6SiqkeKI9PyYeVr_WwX0IBlXkCI&origin=' + origin + '&destination=Helsinki&mode=transit&avoid=ferries|tolls|highways')

		   	// send cliq request to database

		   	var requestRef = firebase.database().ref('requests/').push({

		    // some request attributes
		   		isAccepted: false,
		    	isFinished: false,
		    	isCanceled: false,
		    	clientLocation: origin,
		    	clientID: userID
		  	})

		  	firebase.database().ref('users/' + userID).update({
		  		isBusy: true
		  	})

		  	$('#callCliqBtn').text('Cancel Cliq')

		} else {

			console.log('ya daun')

			firebase.database().ref('requests/').once('value').then(function(snapshot) {

				for (var i in snapshot.val()) {
					console.log(i)
					if (snapshot.val()[i].clientID === userID) {
						if (busyStatus) {
							firebase.database().ref('requests/' + i).update({
								isCanceled: true
							})
						}
					}
				}	
			})

			firebase.database().ref('users/' + userID).update({
		  		isBusy: false
		  	})

			$('#callCliqBtn').text('Find Cliq')
		}
	})
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

