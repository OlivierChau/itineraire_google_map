var map;
var polyPath;

var events;
var iterator = 0;

var colors = ["#FF4040","#FF9640","#E6399B","#39E639","#33CCCC", "#FFEE6C"];
var lastEvent = null;
var currentPolyPath = null;

var transitLayer;

function initialize() {
    console.log('Heho');
	loadData("data/segmented_transport.csv");

	map = new google.maps.Map(document.getElementById('map-canvas'), {
		zoom: 15,
		center: new google.maps.LatLng(43.3, 5.4),
		disableDefaultUI: true,
		mapTypeId: google.maps.MapTypeId.TERRAIN
	});

	polyPath = new google.maps.Polyline({map: map, strokeOpacity: 0.5});

	transitLayer = new google.maps.TransitLayer();

	document.onkeydown = (function(e) {
		if(e.keyCode == 39) {
			addNextEvent();
		} else if (e.keyCode == 32) {
			addAllEvents();
		} else if(e.keyCode == 84) {
			switchTransitLayer();
		}
	});
}

function switchTransitLayer() {
	if(transitLayer.getMap() == map) {
		transitLayer.setMap(null);
	} else {
		transitLayer.setMap(map);
	}
};

function addAllEvents() {
	for(var i = 0; i < events.length; i++) {
		var event = events[i];
		addPath(event);
	}
};

function addNextEvent() {
	var event = events[iterator++];
	addPath(event);
	setTime(event);
	map.setCenter(event.latLng);
};

function addPath(event) {
	polyPath.getPath().push(event.latLng);

	var marker = new google.maps.Marker({
		map: map,
  		position: event.latLng,
		icon: {
			path: google.maps.SymbolPath.CIRCLE,
			fillOpacity: 0.9,
			fillColor: colors[event.label],
			strokeOpacity: 0,
			scale: 5
		}
	});
};

function setTime(event) {
	var timeElement = document.getElementById("time");

	var date = new Date(event.datetime);
	var time = date.toTimeString().substring(0, 8)

	timeElement.innerHTML = time;
	
};

function loadData(filename) {
	d3.csv(filename, function(d) {
		return {
			latLng: new google.maps.LatLng(d.lat, d.lon),
			datetime: Date.parse(d.datetime),
			label: parseInt(d.label)
		};
	}, function(error, rows) {
		events = rows;
	});
};

google.maps.event.addDomListener(window, 'load', initialize);
