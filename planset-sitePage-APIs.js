function initializeMap() {
  var map = L.map("map").setView([0, 0], 2);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
  }).addTo(map);

  var marker;
  var coordinatesInput = document.getElementById("coordinates");

  map.on("click", function (e) {
    var lat = e.latlng.lat.toFixed(6);
    var lng = e.latlng.lng.toFixed(6);
    coordinatesInput.value = lat + ", " + lng;

    if (marker) {
      map.removeLayer(marker);
    }
    marker = L.marker(e.latlng).addTo(map);
  });

  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(function (position) {
      var lat = position.coords.latitude;
      var lng = position.coords.longitude;
      map.setView([lat, lng], 13);
    });
  }
}

document.addEventListener("DOMContentLoaded", function () {
  initializeMap();
});
