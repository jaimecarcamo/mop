require([
      // ArcGIS
	  "esri/WebMap",
      "esri/views/MapView",
	   "esri/layers/GroupLayer",
      "esri/layers/MapImageLayer",

      // Widgets
      // "esri/widgets/Legend",
      "esri/widgets/LayerList",
      // "esri/widgets/Print",
      // "esri/widgets/ScaleBar",
      // "esri/widgets/Compass",
      // "esri/widgets/Track",

      // // Bootstrap
      // "bootstrap/Collapse",
      // "bootstrap/Dropdown",

      // // Calcite Maps
      // "calcite-maps/calcitemaps-v0.4",
      
      "dojo/domReady!"
    ], function(WebMap, MapView, LayerList, GroupLayer, MapImageLayer) {

        // Create layer showing household income.

      var householdIncomeLayer = new MapImageLayer({
        url: "http://172.110.1.30/arcgis/rest/services/BASE_LOS_LAGOS/MapServer",
        title: "lagos",
		 visibility: false
      });

      // Create layer showing median net worth.
      // Set visibility to false so it's not visible on startup.

      var medianNetWorthLayer = new MapImageLayer({
        url: "http://172.110.1.30/arcgis/rest/services/BASE_DAP/MapServer",
        title: "avion",
        visibility: false
      });

      // Create GroupLayer with the two MapImageLayers created above
      // as children layers.

      var demographicGroupLayer = new GroupLayer({
        title: "US Demographics",
        visibility: false,
        visibilityMode: "independent",
        layers: [householdIncomeLayer, medianNetWorthLayer],
        opacity: 0.75
      });

      // Create a map and add the group layer to it

      var map = new WebMap({
        basemap: "streets",
        layers: [demographicGroupLayer]
      });

      // Add the map to a MapView

      var mapView = new MapView({
        container: "viewDiv",
		  center: {
            x: -72.5,
            y: -41.5
          },
        map: map,
		padding: {
            top: 50,
            bottom: 0
          },
		  zoom: 8
      });

      // Creates actions in the LayerList.

      function defineActions(event) {

        // The event object contains an item property.
        // is is a ListItem referencing the associated layer
        // and other properties. You can control the visibility of the
        // item, its title, and actions using this object.

        var item = event.item;

        if (item.title === "US Demographics") {

          // An array of objects defining actions to place in the LayerList.
          // By making this array two-dimensional, you can separate similar
          // actions into separate groups with a breaking line.

          item.actionsSections = [
            [{
              title: "Go to full extent",
              className: "esri-icon-zoom-out-fixed",
              id: "full-extent"
            }, {
              title: "Layer information",
              className: "esri-icon-description",
              id: "information"
            }],
            [{
              title: "Increase opacity",
              className: "esri-icon-up",
              id: "increase-opacity"
            }, {
              title: "Decrease opacity",
              className: "esri-icon-down",
              id: "decrease-opacity"
            }]
          ];
        }
      }

      mapView.then(function() {

        // Create the LayerList widget with the associated actions
        // and add it to the top-right corner of the view.

        var layerList = new LayerList({
		  view: mapView,
          // executes for each ListItem in the LayerList
          listItemCreatedFunction: defineActions
        });

        // Event listener that fires each time an action is triggered

        layerList.on("trigger-action", function(event) {

          // The layer visible in the view at the time of the trigger.
          var visibleLayer = householdIncomeLayer.visible ?
            householdIncomeLayer : medianNetWorthLayer;

          // Capture the action id.
          var id = event.action.id;

          if (id === "full-extent") {

            // if the full-extent action is triggered then navigate
            // to the full extent of the visible layer
            mapView.goTo(visibleLayer.fullExtent);

          } else if (id === "information") {

            // if the information action is triggered, then
            // open the item details page of the service layer
            window.open(visibleLayer.url);

          } else if (id === "increase-opacity") {

            // if the increase-opacity action is triggered, then
            // increase the opacity of the GroupLayer by 0.25

            if (demographicGroupLayer.opacity < 1) {
              demographicGroupLayer.opacity += 0.25;
            }
          } else if (id === "decrease-opacity") {

            // if the decrease-opacity action is triggered, then
            // decrease the opacity of the GroupLayer by 0.25

            if (demographicGroupLayer.opacity > 0) {
              demographicGroupLayer.opacity -= 0.25;
            }
          }
        });

        // Add widget to the top right corner of the view
        mapView.ui.add(layerList,  "bottom-right");
      });
		
		
        // // Popup
        // mapView.then(function(){
          // mapView.popup.dockEnabled = false;//mantiene posicion fija del poppup
          // mapView.popup.dockOptions = {
            // buttonEnabled: false
          // }
        // });
    
        // // Capa aeropuerto
        // var featureLayer = new FeatureLayer({
          // url: "http://172.110.1.30/arcgis/rest/services/BASE_DAP/MapServer",
          // outFields: ["*"],
          
          // // REVISA EN EL DOCUMENTO LAYER
          // definitionExpression: "",

          // // Obtener los datos del popup
          // popupTemplate: {
            // title: "{name}",
            // content: [{
            // type: "fields",
            // fieldInfos: [{
                // fieldName: "name",
                // label: "Nombre"
              // }, {
                // fieldName: "tipo_red",
                // label: "Tipo"
              // }, {
                // fieldName: "coor_X",
                // label: "Cordenadas X"
              // }, {
                // fieldName: "coor_Y",
                // label: "Cordenadas Y"
              // }]
            // }],
          // }
        // });
      
        // // AGREGAR LA CAPA
        // map.add(featureLayer);

        // Basemaps
        // var basemaps = new Basemaps({
          // container: "basemapGalleryDiv",
          // view: mapView
        // });

      // // Search - add to navbar - va a la direccion
      // var searchWidget = new Search({
      //   container: "searchWidgetDiv",
      //   view: mapView
      // });
      
        // // Legend
        // var legendWidget = new Legend({
          // container: "legendDiv",
          // view: mapView
        // });

        // // LayerList
        // var layerWidget = new LayerList({
          // container: "layersDiv",
		  // view: mapView
        // });

        // // Print
        // var printWidget = new Print({
          // container: "printDiv",
          // view: mapView,
          // printServiceUrl: "https://utility.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task"
        // });

        // BasemapToggle, no carga el segundo mapa
        // var basemapToggle = new BasemapToggle({
          // view: mapView		 
	   // });
        // Lamada al Togle, no carga el segundo mapa
        // mapView.ui.add(basemapToggle, "bottom-right");          
        
        // // Scalebar
        // var scaleBar = new ScaleBar({
          // view: mapView,
          // unit: "dual" // sistema metrico y no metrico
        // });
        // // Llamada al ScaleBar
        // mapView.ui.add(scaleBar, "bottom-left");
      
        // // Cargar el compass, problema icono
        // var compassWidget = new Compass({
          // view: mapView
        // });
        // // Llamada al Compass
        // mapView.ui.add(compassWidget, "top-left");
	
        // // Carga punto de referencia, no funciona
        // var track = new Track({
          // view: mapView
        // });
        
        // mapView.ui.add(track, "top-left");

        // mapView.then(function() {
          // track.start();
        // });
		
		

    }
);
