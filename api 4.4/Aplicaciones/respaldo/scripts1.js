 // SE PIDEN LAS LIBRERIAS
 require([
        "esri/Map",
        "esri/views/MapView",
	    "esri/layers/TileLayer",
        "esri/layers/ImageryLayer",
        "esri/widgets/ScaleBar",
        "esri/widgets/Compass",
        "esri/widgets/Track",
        "esri/layers/FeatureLayer",
        "esri/tasks/Locator",
		"dojo/domReady!"
      ],

// SE LLAMAN LAS FUNCIONES
	function(
        Map, MapView, TileLayer, RasterFunction, ScaleBar, Compass, Track, FeatureLayer, Locator
    ){
        
        // DECLARACION DE LAS VARIABLES

        // LLAMA AL CACHE, DONDE DEBEN ESTAR ALMACENADOS LOS MAPAS
        var layer = new TileLayer({
		      url:"http://172.110.1.30/arcgis/rest/services/BASE_LOS_LAGOS/MapServer"
		    });

        // CARGA LAS CAPAS DE LOS MAPAS
        var map = new Map({
            layers: [layer]
        });

        // CARGA EL MPADA EN LA PÁGINA
        var view = new MapView({
          container: "viewDiv",
          map: map,          
          center: { // autocasts as esri/geometry/Point
            x: -43, 
            y: -72,
          },
          zoom: -1,

        });

        // CARGA SCALEBAR
        var scaleBar = new ScaleBar({
          view: view,
          unit: "dual" // The scale bar displays both metric and non-metric units.
        });

        // Add the widget to the bottom left corner of the view
        view.ui.add(scaleBar, "bottom-left");

        // CARGA COMPASS
        var compassWidget = new Compass({
          view: view
        });

        // Add the Compass widget to the top left corner of the view
        view.ui.add(compassWidget, "top-left");

        // Create an instance of the Track widget
        // and add it to the view's UI
        var track = new Track({
          view: view
        });

        view.ui.add(track, "top-left");
        // The sample will start tracking your location
        // once the view becomes ready
        view.then(function() {
          track.start();
        });

        // CAPA AEROPUERTO
		var fl = new FeatureLayer({
		url: "http://172.110.1.30/arcgis/rest/services/DAP/MapServer"
		});
		// AGREGAR LA CAPA
		map.add(fl); 
        
       

              // Set up a locator task using the world geocoding service
		var locatorTask = new Locator({
        url: "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer"
		});

        view.on("click", function(event) {
			event.stopPropagation(); // overwrite default click-for-popup behavior

			// Get the coordinates of the click on the view
			var lat = Math.round(event.mapPoint.latitude * 1000) / 1000;
			var lon = Math.round(event.mapPoint.longitude * 1000) / 1000;

			view.popup.open({
			// Set the popup's title to the coordinates of the location
			title: "Reverse geocode: [" + lon + ", " + lat + "]",
			location: event.mapPoint // Set the location of the popup to the clicked location
			});

			// Display the popup
			// Execute a reverse geocode using the clicked location
			locatorTask.locationToAddress(event.mapPoint).then(function(
			  response) {
			  // If an address is successfully found, show it in the popup's content
			  view.popup.content = response.address;
			}).otherwise(function(err) {
			  // If the promise fails and no result is found, show a generic message
			  view.popup.content =
				"No address was found for this location";
			});
		});
  }
);