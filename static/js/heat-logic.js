const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
let selected_category = 0;


selected_radius = 8;
let county_codes = ["AOB","AZC","BJU","COY","CUA","GAM","IZC","IZP","MAL","MCO","MHI","TLA","TLH","VCA","XOC","CUH"];
let county_names = {
  "AZC" : "Azcapotzalco",
  "COY" : "Coyoacán",
  "CUA" : "Cuajimalpa",
  "GAM" : "Gustavo A. Madero",
  "IZC" : "Iztacalco",
  "IZP" : "Iztapalapa",
  "MCO" : "Magdalena Contreras",
  "MAL" : "Milpa Alta",
  "AOB" : "Álbaro Obregón",
  "TLH" : "Tláhuac",
  "TLA" : "Tlalpan",
  "XOC" : "Xochimilco",
  "BJU" : "Benito Juárez",
  "MHI" : "Miguel Hidalgo",
  "VCA" : "Venustiano Carranza",
  "CUH" : "Cuahtémoc",
}

let incident_types = ["accidente-choque con lesionados","accidente-choque sin lesionados","accidente-ciclista","accidente-motociclista","lesionado-atropellado",];
let inc_labls_short = {
  "accidente-choque con lesionados": "Con lesionados",
  "accidente-choque sin lesionados": "Sin lesionados",
  "accidente-ciclista": "Ciclista",
  "accidente-motociclista": "Motociclista",
  "lesionado-atropellado": "Atropellado"
};


if(urlParams.has('category')){
  selected_category = urlParams.get('category');
  active_category = incident_types[ urlParams.get('category') ];
}else{
  active_category = incident_types[0];
}

if(urlParams.has('radius')){
  selected_radius = urlParams.get('radius');
}

$('.nav.nav-tabs').children('a').each(function(i) { 
  var cat_code = $(this).data('category');
  if(incident_types[cat_code] == active_category){
    $(this).addClass('active');
  }
});

$('#select-radius').children('option').each(function(i){
  var val = $(this).val();
  if(val == selected_radius){
    $(this).attr('selected',true);
  }
});

$("#select-radius").on("change",function(){
  window.location.href = '/dangerous-heat.html?category='+selected_category+'&radius='+this.value;
})

// console.log(dataset);
var incidents = [];
for (var county in dataset) {
  for(var category in dataset[county]){
    //only show one category at a time
    if(active_category == category){
      features = dataset[county][category]['features'];
      L.geoJSON(features, {   
        onEachFeature: function(feature, layer) {
          // add lat, lng, intensity to incidents
          incidents.push({
            lat: feature.geometry.coordinates[1],
            lng: feature.geometry.coordinates[0],
            count: feature.properties.member_count
          });
        },
      });
    }
  }
}

var testData = {
  max: 8,
  data: incidents
};

// Define streetmap and darkmap layers
var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
});

var cfg = {
  // radius should be small ONLY if scaleRadius is true (or small radius is intended)
  // if scaleRadius is false it will be the constant radius used in pixels
  "radius": selected_radius,
  "maxOpacity": .7,
  // scales the radius based on map zoom
  "scaleRadius": false,
  // if set to false the heatmap uses the global maximum for colorization
  // if activated: uses the data maximum within the current map boundaries
  //   (there will always be a red spot with useLocalExtremas true)
  "useLocalExtrema": false,
  // which field name in your data represents the latitude - default "lat"
  latField: 'lat',
  // which field name in your data represents the longitude - default "lng"
  lngField: 'lng',
  // which field name in your data represents the data value - default "value"
  valueField: 'count'
};


var heatmapLayer = new HeatmapOverlay(cfg);

heatmapLayer.setData(testData);

var myMap = L.map("map-canvas", {
  center: [
    19.4337585,-99.1454531
  ],
  zoom: 11,
  layers: [streetmap, heatmapLayer],
});