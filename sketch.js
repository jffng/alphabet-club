var id = "OUXISKJ21S0DMRLSCKC5BAAY2ZK0UN3QV4JAP3MM3PGQ3LXD";
var secret = "BPECZOFCDZM14KWGJF4AVSXDEB4UROBR1VZJJWWE3DUQEMDT";
var theLetter;
var matches;
var center;
var letterTest = /([A-Z])|([a-z])/

var options = {
    client_id: id,
    client_secret: secret,
    v: 20160410,
    m: "foursquare",
    section: "drinks",
    limit: 250
};

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

function getResults(){
    $('.results').show();
    $('.prompt').hide();
    var neighborhood = $('.neighborhood').val();
    theLetter = $('.letter').val().toLowerCase();

    if(parseInt(neighborhood.split(' ')[0])){
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({'address': neighborhood}, function(results, status){
            if (status === google.maps.GeocoderStatus.OK){
                var ll = results[0].geometry.location.lat() + ',' +  results[0].geometry.location.lng();
                options.ll = ll;
                console.log(ll);
                getJSON();
            }else {
                console.log(status);
            }
        });
    } else {
        options.near = $('.neighborhood').val();
        getJSON();
    }
}

function getJSON(){
    $.getJSON('https://api.foursquare.com/v2/venues/explore', options, function(data){
        
    }).done(function(data){
        var items = data.response.groups[0].items;
        parseVenues(items);
    }).fail(function(err){
        console.log(err.responseText);
    });
}

function parseVenues(venues){
    matches = [];
    // console.log(theLetter);

    venues.forEach(function(i){
        var venueName = i.venue.name.toLowerCase();
        // console.log(venueName[0].toLowerCase());

        if (venueName.split(' ')[0] == "the"){
            venueName = venueName.split(' ')[1]; 
        }
        if (venueName[0].toLowerCase() == theLetter){
            matches.push(i.venue);
        };
    });

    console.log(matches);
    addResults(matches);
    $('.loader').html('Results');
    $('.loader').addClass('pasta');
}

function addResults(results){
    results.forEach(function(r){
        var link = r.name + ', ' + r.location.address;
        var q = link.replaceAll(' ', '+');
        var markup = '<li><a href="https://google.com/maps/search/' + q + '" target="_blank">' + link +', '+r.location.city + '</a></li>';
        console.log(markup);
        $('.results').find('ul').append(markup);
    });
}

function initMap(){
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: {
            lat: 40.7268674,
            lng: -74.0099211
        } 
    });
}

$('#submit').click(getResults);
