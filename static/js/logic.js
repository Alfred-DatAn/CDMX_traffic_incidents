//data
let centers_loc = c_loc;
let cameras_loc = cam_loc;
var county_areas = "static/data/alcaldias.geojson"

//add tile layer
var street = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 17,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: API_KEY
});

//center markers
var c_icon = L.icon({
    iconUrl: "static/assets/secondary.png",
    iconSize: [25,25],
    iconAnchor: [0,0],
    popupAnchor: [12, -2]
})

var main_icon = L.icon({
    iconUrl: "static/assets/head.png",
    iconSize: [40,40],
    iconAnchor: [0,0],
    popupAnchor: [12, -2]
})

function img_center(center_name){
    if(center_name === "C5"){
        return main_icon
    } else {
        return c_icon
    }
}

//create center markers
var center_markers = [];

for (var i = 0; i < centers_loc.length; i++) {
    center_markers.push(
        L.marker(centers_loc[i].Location, {icon: img_center(centers_loc[i].Name)})
        .bindPopup("<h5>" + centers_loc[i].Name + "</h5>")
    );
}

//create camera_markers
var myRenderer = L.canvas({ padding: 0.5});

var camera_markers = [];

for (var i = 0; i < cameras_loc.length; i++) {
    camera_markers.push(
        L.circleMarker(cameras_loc[i].Location, {renderer: myRenderer, radius:1, color:"#660708"})
    );
}

/// counties
function chooseColor(county) {
    switch (county) {
    case "Azcapotzalco":
      return "#F94144";
    case "Coyoacán":
      return "#997B66";
    case "Cuajimalpa de Morelos":
      return "#F8961E";
    case "Gustavo A. Madero":
      return "#F9C74F";
    case "Iztacalco":
      return "#577590";
    case "Iztapalapa":
      return "#43AA8B";
    case "La Magdalena Contreras":
        return "#577590";
    case "Milpa Alta":
        return "#F94144";
    case "Álvaro Obregón":
        return "#F3722C";
    case "Tláhuac":
        return "#F8961E";
    case "Tlalpan":
        return "#F9C74F";
    case "Xochimilco":
        return "#90BE6D";
    case "Benito Juárez":
        return "#43AA8B";
    case "Miguel Hidalgo":
        return "#577590";
    case "Venustiano Carranza":
        return "#F94144";
    case "Cuauhtémoc":
        return "#D08C60";
    default:
      return "black";
    }
  }

  function no_cameras(county) {
    switch (county) {
    case "Azcapotzalco":
      return 707;
    case "Coyoacán":
      return 907;
    case "Cuajimalpa de Morelos":
      return 239;
    case "Gustavo A. Madero":
      return 1790;
    case "Iztacalco":
      return 664;
    case "Iztapalapa":
      return 2100;
    case "La Magdalena Contreras":
        return 305;
    case "Milpa Alta":
        return 214;
    case "Álvaro Obregón":
        return 899;
    case "Tláhuac":
        return 540;
    case "Tlalpan":
        return 753;
    case "Xochimilco":
        return 416;
    case "Benito Juárez":
        return 796;
    case "Miguel Hidalgo":
        return 926;
    case "Venustiano Carranza":
        return 990;
    case "Cuauhtémoc":
        return 1448;
    default:
      return "black";
    }
  }

function addMyData( feature, layer ){
    counties.addLayer( layer )
    layer.bindPopup("<h5>" + feature.properties.nomgeo + "</h5> <hr> <h6>" + no_cameras(feature.properties.nomgeo) + " cameras</h6>")
};

d3.json(county_areas).then(function(data) {
        L.geoJson(data, {
            style: function(feature) {
                return {
                    color: "white",
                    fillColor: chooseColor(feature.properties.nomgeo),
                    fillOpacity: 0.5,
                    weight: 1.5
                }
            },
            onEachFeature: addMyData,
        })
  });

//center and camera markers layers
var centers_layer = L.layerGroup(center_markers);

var cameras_layer = L.layerGroup(camera_markers);

let counties = L.layerGroup();

//create base layer
var baseMap = {
    Street : street
};

//layer to toggle on and off
var overlayMaps = {
    Centers : centers_layer,
    "C5 Cameras" : cameras_layer,
    Counties : counties
};

//create map object
var myMap = L.map("mapid", {
    center: [19.3099, -99.1475],
    zoom: 11.2,
    layers: [street]
});

//layers control
L.control.layers(baseMap, overlayMaps, {collapsed:false}).addTo(myMap)