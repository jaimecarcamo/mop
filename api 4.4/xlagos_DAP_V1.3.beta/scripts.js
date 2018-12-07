require([
      // ArcGIS
      "esri/WebMap",
      "esri/views/MapView",
      "esri/layers/TileLayer",

      // Widgets
      "esri/widgets/BasemapGallery",
      "esri/widgets/Search",
      "esri/widgets/Legend",
      "esri/widgets/LayerList",
      "esri/widgets/Print",
      "esri/widgets/BasemapToggle",
      "esri/layers/FeatureLayer",
      "esri/widgets/ScaleBar",
      "esri/widgets/Compass",
      "esri/widgets/Track",
      "esri/layers/GroupLayer",
      "esri/layers/MapImageLayer",
	  
	  // Bootstrap
      "bootstrap/Collapse",
      "bootstrap/Dropdown",

      // Calcite Maps
      "calcite-maps/calcitemaps-v0.4",
      "dojo/domReady!"
	  

    ], function(
      WebMap, MapView,TileLayer, Basemaps, Search, 
      Legend, LayerList, Print, BasemapToggle, FeatureLayer, 
      ScaleBar, Compass, Track, GroupLayer, MapImageLayer) {

		//crea una capa de avion
	   var avion = new FeatureLayer({
          url: "http://172.110.1.30/arcgis/rest/services/BASE_DAP/MapServer",
          outFields: ["*"],
          title: "Aeródromos",
          // Revisa el documento del layer
          definitionExpression: "",
			visibility: false,
          // Obtener los datos del popup
          popupTemplate: {
            title: "{name}",
            content: [{
            type: "fields",
            fieldInfos: [{
                fieldName: "name",
                label: "Nombre"
              }, {
                fieldName: "tipo_red",
                label: "Tipo"
              }, {
                fieldName: "coor_X",
                label: "Cordenadas X"
              }, {
                fieldName: "coor_Y",
                label: "Cordenadas Y"
              }]
            }],
          }
        });

      // Create layer showing los lagos.
      // Set visibility to false so it's not visible on startup.

      var los_lagos = new MapImageLayer({
        url: "http://172.110.1.30/arcgis/rest/services/BASE_LOS_LAGOS/MapServer",
        title: "Base de los Lagos",
        visibility: false
      });

      // Create GroupLayer with the two MapImageLayers created above
      // as children layers.

      var grupo_capas = new GroupLayer({
        title: "Capas de la Región",
        visibility: true,
        visibilityMode: "exclusive",
        layers: [los_lagos, avion],
        opacity: 0.75
      });
        

        // Cargar los mapas
        var map = new WebMap({
          basemap: "streets",
          layers: [grupo_capas]
        });
      
        // View
        var mapView = new MapView({
          container: "mapViewDiv",
          center: {
            x: -72.5,
            y: -41.5
          },
          map: map,
          padding: {
            top: 50,
            bottom: 0
          },
		  zoom: 9

        });
		
		 // // Popup
        // mapView.then(function(){
          // mapView.popup.dockEnabled = false;//mantiene posicion fija del poppup
          // mapView.popup.dockOptions = {
            // buttonEnabled: false
          // }
        // });

        // quita el zoom del mapa
        //mapView.ui.components = ["attribution"];
    
        // Basemaps
        var basemaps = new Basemaps({
          container: "basemapGalleryDiv",
          view: mapView
        })

        // Search - add to navbar - va a la direccion
        var searchWidget = new Search({
          container: "searchWidgetDiv",
          view: mapView
        });
      
        // Legend
        var legendWidget = new Legend({
          container: "legendDiv",
          view: mapView
        });

        // LayerList
        var layerWidget = new LayerList({
          container: "layersDiv",
          view: mapView
        });

        // Print, no crea PDF
        var printWidget = new Print({
          container: "printDiv",
          view: mapView,
          printServiceUrl: "https://utility.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task"
        });

        // BasemapToggle
        var basemapToggle = new BasemapToggle({
          container: "basemapToggle",
          view: mapView
        });
        // Llamada al Togle
        mapView.ui.add(basemapToggle, "bottom-right");
        
        // Scalebar
        var scaleBar = new ScaleBar({
          view: mapView,
          unit: "dual" // sistema metrico y no metrico
        });
        // Llamada al ScaleBar
        mapView.ui.add(scaleBar, "bottom-left");
      
        // Carga el compass, problema con el icono
        var compassWidget = new Compass({
          view: mapView
        });
        // Llamada al Compass
        mapView.ui.add(compassWidget, "top-left");

        // Carga punto de referencia, errores con el zoom
        var track = new Track({
          view: mapView
        });
        // ubicacion del track
        mapView.ui.add(track, "top-left");
        // inicia el track
        mapView.then(function() {
          track.start();
        });

    }
);
