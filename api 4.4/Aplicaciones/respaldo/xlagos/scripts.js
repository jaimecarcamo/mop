 // SE PIDEN LAS LIBRERIAS
 require([
        "esri/Map",
        "esri/views/MapView",
	    "esri/layers/TileLayer",
        "esri/layers/ImageryLayer",
        "esri/widgets/ScaleBar",
        "esri/widgets/Compass",
        "esri/layers/FeatureLayer",
        "dojo/domReady!"
      ],

// SE LLAMAN LAS FUNCIONES
	function(
        Map, MapView, TileLayer, RasterFunction, ScaleBar, Compass, FeatureLayer
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

       

        // CAPA AEROPUERTO
		var fl = new FeatureLayer({
		url: "http://172.110.1.30/arcgis/rest/services/BASE_DAP/MapServer"
		});
		// AGREGAR LA CAPA
		map.add(fl); 
        
       
	
                 

      
  }
);