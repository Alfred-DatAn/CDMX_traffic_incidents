let centers_loc = c_loc
let cameras_loc = cam_loc

//add tile layer
var street = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 17,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: API_KEY
});

//icon markers
var c_icon = L.icon({
    iconUrl: "static/assets/center.png",
    iconSize: [25,25],
    iconAnchor: [0,0],
    popupAnchor: [12, -2]
})

var cam_icon = L.icon({
    iconUrl: "static/assets/camera.png",
    iconSize: [5,5],
    iconAnchor: [0,0],
    popupAnchor: [12, -2]
})

var center_markers = [];

//create center markers
for (var i = 0; i < centers_loc.length; i++) {
    center_markers.push(
        L.marker(centers_loc[i].Location, {icon: c_icon})
        .bindPopup("<h5>" + centers_loc[i].Name + "</h5>")
    );
}

var camera_markers = [];

//create camera_markers
for (var i = 0; i < cameras_loc.length; i++) {
    camera_markers.push(
        L.marker(cameras_loc[i].Location, {icon: cam_icon})
    );
}

//center markers layer
var centers_layer = L.layerGroup(center_markers);

//camera markers layer
var cameras_layer = L.layerGroup(camera_markers)

//layer to toggle on and off
var overlayMaps = {
    Centers : centers_layer,
    Cameras : cameras_layer
};

//create map object
var myMap = L.map("mapid", {
    center: [19.4206, -99.1375],
    zoom: 12,
    layers: [street]
});

//layers control
L.control.layers(overlayMaps).addTo(myMap)

//19.4326, -99.1375