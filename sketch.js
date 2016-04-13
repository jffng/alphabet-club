var id = "OUXISKJ21S0DMRLSCKC5BAAY2ZK0UN3QV4JAP3MM3PGQ3LXD";
var secret = "BPECZOFCDZM14KWGJF4AVSXDEB4UROBR1VZJJWWE3DUQEMDT";
var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
var labelIndex = 0;
var theLetter, neighborhood;
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
    theLetter = $('.letter').val().toLowerCase();
    if(theLetter.length === 1 && letterTest.test(theLetter)){
        $('.results').show();
        $('.prompt').hide();
        neighborhood = $('.neighborhood').val();
        if (!neighborhood) neighborhood = '325 hudson st, NY';

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
    } else {
        $('.error').html('One letter, plz');
    }
}

function getJSON(){
    $.getJSON('https://api.foursquare.com/v2/venues/explore', options, function(data){
        
    }).done(function(data){
        var items = data.response.groups[0].items;
        parseVenues(items);
    }).fail(function(err){
        $('.gif').hide();
        $('#map').hide();
        $('.loader').html('Whoops');
        $('.loader').addClass('pasta');
        $('.help').show();
        $('.help').html('No results for: ' + neighborhood + '. Maybe try a different address.');
        console.log(err.responseText);
    });
}

function parseVenues(venues){
    matches = [];

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

    $('.gif').hide();
    $('.loader').addClass('pasta');
    $('.help').show();

    if (matches.length){
        $('.loader').html('Results');
        console.log(matches);
        addResults(matches);
    } else {
        $('.loader').html('Whoops');
        $('.help').html('No results for: ' + location + '. Maybe try a different address.');
    }
}

function addResults(results){
    results.forEach(function(r){
        var link = r.name + ', ' + r.location.address;
        r.label = labels[labelIndex++ % labels.length];
        var q = link.replaceAll(' ', '+');
        var markup = '<li><a href="https://google.com/maps/search/' + q + '" target="_blank">' + r.label +'. '+ link +', '+r.location.city + '</a></li>';
        // console.log(markup);
        $('.results').find('ul').append(markup);
    });

    var mapLoc = {
        lat: results[0].location.lat,
        lng: results[0].location.lng
    };
    initMap(mapLoc, results);

}

function initMap(location, places){
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        center: location
    });

    places.forEach(function(p){
        var pos = {
            lat: p.location.lat,
            lng: p.location.lng
        };
        var marker = new google.maps.Marker({
            position: pos,
            map: map,
            label: p.label,
            title: p.name
        });
    });
}

$('#submit').click(getResults);
$('.neighborhood').on('keypress', function(e){
    if (e.keyCode === 13){
        getResults();
    }
});
