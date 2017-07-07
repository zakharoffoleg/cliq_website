
function searchCliqBtn() {
	var userID = firebase.auth().currentUser.uid

	firebase.database().ref('/users/' + userID).once('value').then(function(getVal) {
		var readyStatus = getVal.val().isReady
		var busyStatus = getVal.val().isBusy
		//console.log(readyStatus)
		
		if (!busyStatus) {
			if (!readyStatus) {
				var confActivate = confirm('Are you ready for Cliq?')
				//console.log(confActivate)
				if (confActivate) {
					firebase.database().ref('users/' + userID).update({
		    			isReady: true
					})
					readyStatus = true



					$('#searchCliqBtn').text('Stop search')
				}
			} else {
				var confDeactivate = confirm('Done cliqing?')
				if (confDeactivate) {
					firebase.database().ref('users/' + userID).update({
		    			isReady: false
					})
					readyStatus = false
					confActivate = false
					$('#searchCliqBtn').text('Search Cliq')
				}
				//console.log(confActivate)
				//console.log(readyStatus)
			}
		} else {
			var confFinish = alert('You have some Cliqs to finish')
		}
  	})
}


function finishCliqBtn() {

	var userID = firebase.auth().currentUser.uid;
	firebase.database().ref('/users/' + userID).once('value').then(function(getVal) {
		var busyStatus = getVal.val().isBusy
	
		if (!busyStatus) {
			alert('You have no Cliqs to finish')
		} else {
			firebase.database().ref('users/' + userID).update({
				isBusy: false
			})
			firebase.database().ref('requests/').once('value').then(function(snapshot) {	
				for (var i in snapshot.val()) {
					if (snapshot.val()[i].barberID === userID) {
						firebase.database().ref('requests/' + i).update({
							isFinished: true
						})
						break;
					}
				}
			})
			alert('Good job. Congrats!')
		}
	})
}


function cancelCliqBtn() {

	var userID = firebase.auth().currentUser.uid;
	firebase.database().ref('/users/' + userID).once('value').then(function(getVal) {
		var busyStatus = getVal.val().isBusy

		if(!busyStatus) {
			alert('There is nothing to cancel')
		} else {
			var confCancel = confirm('Are you sure you want to cancel this Cliq?')
			if (confCancel) {
				firebase.database().ref('requests/').once('value').then(function(snapshot) {	
					for (var i in snapshot.val()) {
						if (snapshot.val()[i].barberID === userID) {
							firebase.database().ref('requests/' + i).update({
								isAccepted: false,
								barberID: null
							})
							firebase.database().ref('users/' + userID).update({
								isBusy: false
							})
							break;
						}
					}
				})
			}
		}
	})
}
