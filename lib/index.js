const showMap = (userInput) => {
  // TODO: Construct the URL (with apiKey & userInput) and make the fetch request to the mapbox API
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${userInput.value}.json?access_token=pk.eyJ1IjoieWFubmx1Y2tsZWluIiwiYSI6ImNqd3VvZmh0eDAwZzk0YWxjYmx1bmFpaDcifQ.R6oqb2VcNqMXhDf3S1Pb3A`;
  const geoCoordinates = document.querySelector(".font-monospace");

  fetch(url)
    .then(response => response.json())
    .then((data) => {
      // TODO: Insert the info into the DOM
      // - Extract the coordinates from the parsed JSON response (lang, lat)
      // - Display the coordinates in the element where the coordinates will be displayed
      // - Create a map using the Mapbox API and the coordinates
      // - Add a marker to the map at the coordinates
      console.log(data);
      geoCoordinates.innerText = data.features[0].place_name;
      mapboxgl.accessToken = 'pk.eyJ1IjoidXNrMzI0IiwiYSI6ImNscGt1cDJqZDAwN3EybHBteWt3NXh0a3cifQ.CcQHK7HsKmEONLDpmSbyyw';
      const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v9',
        projection: 'globe', // Display the map as a globe, since satellite-v9 defaults to Mercator
        zoom: 1,
        center: data.features[0].center,
      });

      map.addControl(new mapboxgl.NavigationControl());
      map.scrollZoom.disable();
      // At low zooms, complete a revolution every two minutes.
      const secondsPerRevolution = 240;
      // Above zoom level 5, do not rotate.
      const maxSpinZoom = 100;
      // Rotate at intermediate speeds between zoom levels 3 and 5.
      const slowSpinZoom = 5;

      let userInteracting = false;
      const spinEnabled = true;

      function spinGlobe() {
        const zoom = map.getZoom();
        if (spinEnabled && !userInteracting && zoom < maxSpinZoom) {
          let distancePerSecond = 500 / secondsPerRevolution;
          if (zoom > slowSpinZoom) {
            const zoomDif = (maxSpinZoom - zoom) / (maxSpinZoom - slowSpinZoom);
            distancePerSecond *= zoomDif;
          }
        }
      }

      // Pause spinning on interaction
      map.on('mousedown', () => {
        userInteracting = true;
      });
      map.on('dragstart', () => {
        userInteracting = true;
      });

      // When animation is complete, start spinning if there is no ongoing interaction
      map.on('moveend', () => {
        spinGlobe();
      });

      spinGlobe();
      new mapboxgl.Marker()
        .setLngLat(data.features[0].center)
        .addTo(map);
    });
};

const formElements = document.forms;
console.log(formElements[0]);
formElements[0].addEventListener("submit", (event) => {
  event.preventDefault();
  const inputValue = document.querySelector(".form-control");
  showMap(inputValue);
});
