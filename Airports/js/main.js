/**
 * Created by Scott on 2/12/2017.
 */




// initialize map object
var map = L.map('map', {center: [38.6046691, -101.9795816], zoom:3 });

// add basemap to leaflet map object
L.tileLayer(('https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoid2hpdHNvbnMiLCJhIjoiY2l0eW15ZDJ6MDhrbTJ5bjRuZGx1Z3lmZiJ9.4RXjTjxBUVzG2X3mdtcSZQ'),
{   maxZoom: 15,
    minZoom: 3,
    attribution: 'Airport data &copy; Map Cruzin | United States &copy; Open Street Map | Base Map &copy; Mapbox'
}).addTo(map);

var myIcon = L.Icon.extend({
    options:{
        shadowUrl: 'img/airport_sd.png',
        iconSize: [12,12],
        shadowSize: [20,13],
        iconAnchor: [16, 16],
        shadowAnchor: [16, 16],
        popupAnchor: [-8, -18]
    }
        });

var my1Icon = new myIcon({iconUrl: 'img/airport1.png'}),
     my2Icon = new myIcon({iconUrl: 'img/airport2.png'});

var airports = null;
// Get GeoJSON and put on it on the map when it loads
$.getJSON("assets/airports.geojson", function(data) {
    airports = L.geoJson(data, {
        onEachFeature: function (feature, layer) {
            layer.bindPopup(feature.properties.AIRPT_NAME);
        }, pointToLayer: function (feature, latlng) {
            var marker = null;
            if (feature.properties.CNTL_TWR == "Y") {
                marker = L.marker(latlng, {icon: my1Icon});
        }   else if (feature.properties.CNTL_TWR == "N") {
                marker = L.marker(latlng, {icon: my2Icon});
            }
                return marker;
        }
    }).addTo(map);
});
// Set function for color ramp
function setColor(density){
    return  density > 50 ? '#800026' :
            density > 20 ? '#b30000' :
            density > 10 ? '#e34a33' :
            density > 5 ? '#fc8d59' :
            density > 1 ? '#fdcc8a' :
                          '#FFFFFF';
}

// Set style function that sets fill color property equal to airport density, the count field within us-states.geojson
function style(feature) {
    return {
        fillColor: setColor(feature.properties.count),
        fillOpacity: 2,
        weight: 2,
        opacity: 1,
        color: '#ffffff',
        dashArray: '1'
    };
}
var states = null;

$.getJSON("assets/us-states.geojson",function (data) {
    states = L.geoJson(data, {style: style}).addTo(map);
});






// Create Leaflet Control Object for Legend
