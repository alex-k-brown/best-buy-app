'use strict';

/*-- Header JS --*/

function loadSocial() {
	
	// Add social icons, pulling from data.js
	data.social.forEach(function(icon, n) {
		$('#social').append('<a href="' + icon.url + '" target="_blank" class="social-icon ' + icon.name + '"></a>')
	});

	// Add close button after social icons
	$('#social').append('<div id="closed" class="close"></div>');
};

loadSocial();

function menu() {
	$('#social').toggleClass('closed');
};

// Header clic events
$('#closed').on('click', menu);

/*-- Gallery JS --*/

var slideCounter = 0;

// Add product to gallery
function addProduct(product, n, categoryChoice) {

	// Append products
	$('#gallery').append('<div id="product-' + n + '" class="product product-' + categoryChoice + '"><div class="image-container"><img src="' + product.image + '" class="product-image"></div><div class="product-info"><div class="info-container"><div class="product-price">$' + product.regularPrice + '</div><div class="product-name">' + product.name + '</div><div class="product-description">' + product.shortDescription + '</div><a href="' + product.url + '" target="_blank" class="product-cta">Shop Now</div></div></div></div>');
};

function slideSwitch(arrowVal, productLength) {

	// Hide current product
	$('#product-' + slideCounter).removeClass('active');
	$('#product-' + slideCounter).removeClass('back-active');

	// If right arrow clicked
	if(arrowVal === 'right') {
		
		// Increase slideCounter by 1
		slideCounter++;

		// Show next product
		$('#product-' + slideCounter).addClass('active');

	// If left arrow clicked
	} else {

		// Decrease slideCounter by 1
		slideCounter--;

		// Show next product
		$('#product-' + slideCounter).addClass('back-active');
	};

	// Show hidden arrows
	$('.arrow').removeClass('hide');

	// If at first product
	if (slideCounter < 1) {

		// Hide left arrow
		$('#arrow-left').addClass('hide');
	// If at last product
	} else if (slideCounter > (productLength - 2)) {

		// Hide right arrow
		$('#arrow-right').addClass('hide');
	}
};

// Get products from Best Buy API
function getProducts() {

	// Show loader
	$('#loader').addClass('active');

	var categoryChoice = $(this).attr('val');
	var category;

	// If user chose category
	if (categoryChoice === 'health') {
		category = 'pcmcat242800050021';

	// If user chose laptops
	} else {
		category = 'abcat0502000';
	};

	var urlCall = 'https://api.bestbuy.com/v1/products((categoryPath.id=' + category + '))?apiKey=5lK3DbxYtppGfCfBeahQ9iIu&sort=bestSellingRank.asc&show=image,name,regularPrice,shortDescription,url,bestSellingRank&pageSize=20&format=json';

	$.ajax(
	    {
	        type:'GET',

	        // URL call
	        url: urlCall,
		}
	)

	// When the API returs the data
	.done(function(data){

		// Show gallery
		$('#gallery').addClass('active');

		// Hide loader
		$('#loader').removeClass('active');

		data.products.forEach(function(product, n) {
			addProduct(product, n, categoryChoice);
		});

		// Add active to first product
		$('#product-0').addClass('active');

		// Append arrows
		$('#gallery').append('<div id="arrow-left" class="arrow arrow-left" val="left"></div><div id="arrow-right" class="arrow arrow-right" val="right"></div>');

		// Hide left arrow
		$('#arrow-left').addClass('hide');

		// Click event on arrows
		$('.arrow').on('click', function() {
			slideSwitch($(this).attr('val'), data.products.length);
		});
	})

	// If it fails
	.fail(function(data){

		// Write the error in the console
	    console.log('Error: ' + data);
	});
};

// Restart experience
function restart() {

	// Remove products from gallery
	$('#gallery').html('');

	// Hide gallery
	$('#gallery').removeClass('active');

	// Reset slide counter
	slideCounter = 0;
};

// Gallery click events
$('.category').on('click', getProducts);
$('#logo').on('click', restart);
