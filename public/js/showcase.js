var displayArray = [];

$(document).ready(function() {

//$('#connect-view').fadeIn('slow', function(){
	//animation complete
//});


Servant.initialize({
			application_client_id: 'LDGZDSdA2tDyUGKD'
		},	function(status) {

			console.log(status);

			if (status === 'has_token') {

			//Change View
			document.getElementById('connect-view').style.display = 'none';
			document.getElementById('content-view').style.display = 'block';

			return contentView();
			}
	});
});

function contentView() {

	//Get User And Servants
	Servant.getUserAndServants(function(response) {

		console.log(response);
	
	//Create select menu to toggle between Servants
	for (i = 0; i < response.servants.length; i++){
		var option = document.createElement("option");
		option.innerHTML = response.servants[i].master;
		//Append it to the select element
		document.getElementById('servant-select').appendChild(option);
	}

	//Add listener to select menu change
	document.getElementById('servant-select').addEventListener("change", changeServant);

	//Set default Servant
	Servant.setServant(Servant.servants[0]);

	//Create divs
	insertProducts();
	
	//Get Products
	getProductsIterate();

	//Page Select
	
	var x = pageSelect(2);
	console.log(x);


	concatProducts(x);

	//Swipe
	swipeProducts();



	//Category
	//findCategory();

	//document.getElementById('next-button').addEventListener("onclick", concatArray);

	
	}, function(error) {
		console.log("Error: ", error.message);
	});
};

function changeServant(event) {

	//Set Servant
	Servant.setServant(Servant.servants[event.target.selectedIndex]);

	//Get Products
	//getProductsIterate();
};

/*function getProducts () {
	
	Servant.queryArchetypes('product', function(response) {



		document.getElementById('product-img').src = response.records[0].images[0].resolution_medium;
		document.getElementById('product-name').innerHTML = response.records[0].name;
		document.getElementById('product-price').innerHTML = "$" + response.records[0].price/100;
		document.getElementById('product-description').innerHTML = response.records[0].description;

		document.getElementById('product-img1').src = response.records[1].images[0].resolution_medium;
		document.getElementById('product-name1').innerHTML = response.records[1].name;
		document.getElementById('product-price1').innerHTML = "$" + response.records[1].price/100;
		document.getElementById('product-description1').innerHTML = response.records[1].description;

		console.log(response);

	}, function(error) {

	});
}*/

function getProductsIterate () {
	
	Servant.queryArchetypes('product', function(response) {

		for(i = 0; i < 10; i++) {

		document.getElementById('product-img' + i).src = response.records[i].images[0].resolution_medium;
		document.getElementById('product-name' + i).innerHTML = response.records[i].name;
		document.getElementById('product-price' + i).innerHTML = "$" + response.records[i].price/100;
	}

	}, function(error) {

	});
};

/*function recentProducts () {

	Servant.archetypesRecent('product', 1,
	function(response) {
		console.log(response);
		
	}, function(error) {
		console.log(error);
	});
}*/

/*function findCategory () {

Servant.archetypesRecent('product',
	function(response) {
		
		var catArray = [];
		for (i = 0; i < Math.ceil(response.meta.count/10); i++) {
			Servant.archetypesRecent('product',i+1)
				for(j = 0; j < response.records.length; j++) {
					if (!response.records[j].category) {
						catArray[j+(i*10)] = null
					} else {
						catArray[j+(i*10)] = response.records[j].category.tag;
					}
				}
		}
		console.log(catArray);
	}, function(error) {
		console.log(error);
	});
}*/




/*for (i = 0; i < response.servants.length; i++){
		var option = document.createElement("option");
		option.innerHTML = response.servants[i].master;
		//Append it to the select element
		document.getElementById('servant-select').appendChild(option);
	}*/

function swipeProducts (){

	var elem = document.getElementById('slider');
	window.slider = new Swipe(elem, {
		startSlide: 0,
		speed: 400,
		draggable: true,
		continuous: true,
		disableScroll: true,
	});

	console.log(slider.getPos());
};


//Dynamically create/add div elements to swipejs container
function insertProducts () {

var addAttr = ['product-img', 'product-name', 'product-price'];
var attrType = ['img', 'p', 'p'];

for (i = 0; i < 10; i++) {
$(".swipe-wrap").append('<div id="product'+ i +'"></div>');

	for(j = 0; j < addAttr.length; j++){
		$('#product'+i).append('<'+ attrType[j] +' id="'+ addAttr[j] +''+ i +'"></div>');
	}
}

};




/*function concatArray () {

Servant.archetypesRecent('product', 1, 
	function(response) {
		
		var catArray = [];
		for (i = 0; i < Math.ceil(response.meta.count/10); i++) {
			Servant.archetypesRecent('product',i+1)
				for(j = 0; j < response.records.length; j++) {
					if (!response.records[j].category) {
						catArray[j+(i*10)] = null
					} else {
						catArray[j+(i*10)] = response.records[j].category.tag;
					}
				}
		}
		console.log(catArray);
	}, function(error) {
		console.log(error);
	});
}*/


function pageSelect(page) {

	Servant.archetypesRecent('product', page, function(response) {

		var productArray = response.records;
		console.log(productArray);
		return productArray;

	}, function(error) {
		
	});

};

function concatProducts(newProductArray) {

	displayArray = displayArray.concat(newProductArray);
	console.log(displayArray);
	return displayArray;

};