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

		document.getElementById('welcome-user').innerHTML = 'Hello ' + response.user.nick_name;
		document.getElementById('servant-info').innerHTML = 'You have ' + response.servants.length + ' Servants';

	}, function(error) {
		console.log("Error: ", error.message);
	});
	};
