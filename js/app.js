var map, router = new Router();

function findRoutes() {
    var buses = router.findRoutes(document.getElementById('source').value, document.getElementById('destination').value);


    document.getElementById('output').innerHTML = buses.map(function(b) {
        return renderOption(b);
    }).join('\n');
}

function renderOption(route) {
    var output;
    if(route.changes.length == 0) {
        output = renderRoute(route.from, route.to, route.distance, route.routes[0].routes);
    }
    else if(route.changes.length == 1) {
        output = '<div class="col-xs-6">' + 
            renderRoute(route.from, route.changes[0], route.routes[0].distance, route.routes[0].routes) + 
        '</div><div class="col-xs-6">' +
            renderRoute(route.changes[0], route.to, route.routes[1].distance, route.routes[1].routes) + 
        '</div>';
    }
    else if(route.changes.length == 2) {
        output = '<div class="col-xs-4">' + 
            renderRoute(route.from, route.changes[0], route.routes[0].distance, route.routes[0].routes) + 
        '</div><div class="col-xs-4">' +
            renderRoute(route.changes[0], route.changes[1], route.routes[1].distance, route.routes[1].routes) +
        '</div><div class="col-xs-4">' +
            renderRoute(route.changes[1], route.to, route.routes[2].distance, route.routes[2].routes) + 
        '</div>';
    }

    return '<div class="panel panel-default"><div class="panel-body row">' + 
        output + '</div><div class="panel-footer text-center">' + 
        'Total Distance: <strong>' + (route.distance / 1000.0).toFixed(2) + 'km </strong></div></div>';
}

function renderRoute(from, to, distance, buses) {
    var from    = router.getPlaceDetails(from);
    var to      = router.getPlaceDetails(to);

    var details;
    var busmarkup = buses.map(function(r) {
        details = router.getRouteDetails(r);
        if(details) {
            return '<a href="#" class="list-group-item"><strong>#' + details.routeno +
                    '</strong> (' + details.from + ' - ' + details.to + ')</a>';
        }
    }).join('\n');

    return '<div class="panel panel-primary">' + 
        '<div class="panel-heading"><h3 class="panel-title">' + 
        '<a href="#" data-lat="' + from.lat + '" data-lon="' + from.lon + '" data-toggle="modal" data-target="#map-modal">' + 
        from.name + '</a> to <a href="#" data-lat="' + to.lat + '" data-lon="' + to.lon + '" data-toggle="modal" data-target="#map-modal">' + 
        to.name + '</a> (' + (distance / 1000.0).toFixed(2) + 'km)</h3></div>' + 
        '<div class="list-group">' + busmarkup + '</div></div>';
}

/** Google Map code stolen off http://stackoverflow.com/a/26410438 */
function initMap(myCenter) {
    var marker = new google.maps.Marker({
        position: myCenter
    });

    var mapProp = {
        center: myCenter,
        zoom: 16,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    map = new google.maps.Map(document.getElementById('map-canvas'), mapProp);
    marker.setMap(map);
};

$('#map-modal').on('shown.bs.modal', function(e) {
    var element = $(e.relatedTarget);
    initMap(new google.maps.LatLng(element.data('lat'), element.data('lon')));
    $('#map-title').html(element.html());
});