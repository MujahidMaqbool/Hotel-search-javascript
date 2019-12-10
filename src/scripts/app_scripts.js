
window.responseData = [];
var loader = document.getElementById('loader');
var hotelsList = document.getElementById('result-hotel');
var hotelDetail = document.getElementById('hotel-detail');
var reviews = [];
/////////number field validation
window.isNumberKey = function (evt) {
    var charCode = (evt.which) ? evt.which : event.keyCode
    if (charCode > 31 && (charCode < 48 || charCode > 57))
        return false;

    return true;
}

///////////ajax get request to external api/////////

function ajax_get(url, callback) {
    ////display loading div/////
    loader.style.display = "block";
    //Create the XHR Object
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        //check if the status is 200(means everything is okay)
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            // console.log('responseText:' + xmlhttp.responseText);
            try {
                var data = JSON.parse(xmlhttp.responseText);
                if (data && (data != '' || data != undefined)) {
                    window.responseData = data;
                }

            } catch (err) {
                console.log(err.message + " in " + xmlhttp.responseText);
                setTimeout(() => loader.style.display = "none", 100); ///hide loading
                return;
            }
            callback(data);
        }
    }
    xmlhttp.onerror = function (err) {
        // handle non-HTTP error (e.g. network down)
        alert('Network error, Try again reloading');
        setTimeout(() => loader.style.display = "none", 100); ///hide loading
    };
    //xmlhttp.timeout = 10000;
    xmlhttp.open("GET", url, true);
    xmlhttp.send();//call send
}

///**********Create HTML*******
function createHtml(hotelsData) {

    var html = "";
    if (hotelsData.length > 0) {
        hotelsData.forEach(function (hotel, i) {

            html += '<div class="col-4">';
            html += '<figure class="hotel-wrapper">';
            html += '<img class="img-responsive" src="' + hotel.images[0] + '" alt=" " />';
            html += '<figcaption>';
            html += '<h4>' + hotel.name + '</h4>';
            html += '<div class="hotel-rating">' + hotel.rating.toFixed(1) + ' <small> Rating</small></div>';
            html += '<div class="hotel-price m-b-10">$' + hotel.price + '<sup> / Night</sup>';
            html += '<span class="pull-right">';

            for (var i = 0; i < hotel.stars; i++) {
                html += '<i class="star"></i>';
            }

            html += '</span> </div>';
            html += '<p class="font14"><span>' + hotel.city + ', ' + hotel.country + '</span></p>';
            html += '<a class="btn btn-link" onclick="fetchReviews(' + "'" + hotel.id + "'" + ')">View reviews </a>';
            html += '<button type="button" class="btn btn-main" href="#">Book</button>';
            html += '</figcaption> </figure> </div>';

        });
        hotelsList.innerHTML = html; //////insert final html in page
    } else {
        hotelsList.innerHTML = '<p class="noRecordFound"><b>Oops! No record found.</b></p>';
    }
    setTimeout(() => loader.style.display = "none", 1000); ///hide loading
}

////////***********Filter data */
function filterData() {
    ////display loading div/////
    loader.style.display = "block";
    var newSearchData = [];
    const hFilter = document.forms[0];
    let starInput = hFilter.elements["starFilter"].value;
    let maxPriceInput = hFilter.elements["maxPrice"].value;
    if (maxPriceInput && maxPriceInput != '' && (!isNaN(maxPriceInput))) {
        newSearchData = window.responseData.filter(x => (starInput == 0 ? x.price <= maxPriceInput : x.stars == starInput && x.price <= maxPriceInput));
    } else {
        newSearchData = window.responseData.filter(x => (starInput > 0 ? x.stars == starInput : x.stars));
    }

    createHtml(newSearchData);
}



window.addEventListener('load', function () {

    ajax_get('http://fake-hotel-api.herokuapp.com/api/hotels?count=50&no_error=1', function (hotels) {

        var newFilteredData = hotels.filter(function (item) {
            return item.stars >= 3; //by default display hotel list having minium 3 stars
        });
        //////create HTML from filtered data and display on page
        createHtml(newFilteredData);
    });

    /////////
    document.getElementById("searchBtn").addEventListener('click', function () {
        filterData();
    });

});

function getHotelName(hotelId) {

    var filteredArray = window.responseData.filter(item => item.id == hotelId);
    document.getElementById('hotel-name').innerText = filteredArray[0].name;

}

///////////////get hotel reviews using fetch api just for fun instead of using above ajax function///////////////
window.fetchReviews = function (hotelId) {
    getHotelName(hotelId)///set hotel name
    const reviewsApiURL = `http://fake-hotel-api.herokuapp.com/api/reviews?hotel_id=${hotelId}`;
    fetch(reviewsApiURL)
        .then((resp) => resp.json())
        .then(function (data) {
            reviews = data;
            console.log(reviews);
            var reviewsHtml = "";
            if (reviews.length > 0) {
                reviews.forEach(function (review, i) {
                    reviewsHtml += '<div class="review-wrapper">';
                    reviewsHtml += '<h4>' + review.name + '</h4>';
                    //  reviewsHtml += '<label>' + review.positive + '</label>';
                    reviewsHtml += '<p>' + review.comment + '</p>';
                    reviewsHtml += '</div>';
                });
                hotelDetail.innerHTML = reviewsHtml;
            } else {
                reviewsHtml += '<div class="max-width">';
                reviewsHtml += '<p class="noRecordFound"><b>No reviews</b></p>';
                reviewsHtml += '</div>';
                hotelDetail.innerHTML = reviewsHtml;
            }

        })
        .catch(function (error) {
            console.log(error);
        });
    modalBg.classList.add('bg-active');///open modal
}



///***********for modal */
var mbtn = document.querySelector('.btn-hotel1');
var closeBtn = document.querySelector('.modal-close');
var modalBg = document.querySelector('.modal-bg');

closeBtn.addEventListener('click', function () {
    modalBg.classList.remove('bg-active');
})
/////////////////////////
