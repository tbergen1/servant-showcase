// Wait until DOM is loaded
document.onreadystatechange = function() {
	var state = document.readyState;
	if (state === 'complete'){

		Servant.initialize({
			application_client_id: 'LDGZDSdA2tDyUGKD'
		},	function(status) {

			console.log(status);

			if (status === 'has_token') return;

			//Change View
			document.getElementById('connect-view').style.display = 'none';
			document.getElementById('connect-view').style.display = 'block';
			
			//Start Content Area
			return contentView();


		});

	}
}

function contentView() {

	//Get User And Servants
	Servant.getUserAndServants(function(response) {
		//Show User and Servants Information
		document.getElementById('welcome-user').innerHTML = 'Hello ' + response.user.nick_name;
		document.getElementById('servant-info').innerHTML = 'You have ' + response.servants.length + ' Servants';

		//Create select menu to toggle between Servants
		for (i = 0; i < response.servants.length; i++) {
			var option = document.createElement("option");
			option.value = i;
			option.innerHTML = response.servants[i].master;
			//Append it to the select element
			document.getElementById('servant-select').appendChild(option);
		}

		//Add Listener To Select Menu change
		document.getElementById('servant-select').addEventListener("change", changeServant);

		//Set Servant
		Servant.setServant(Servant.servants[event.target.value]);

	}, function(error) {
		console.log("Error: ", error.message);
	});
};

	function changeServant(event) {

		//Set Servant
		Servant.setServant(Servant.servants[event.target.value]);
	};
