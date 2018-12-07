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

      // Bootstrap
      "bootstrap/Collapse",
      "bootstrap/Dropdown",

      // Calcite Maps
      "calcite-maps/calcitemaps-v0.4",
      
      "dojo/domReady!"

    ], function(WebMap, MapView,TileLayer, Basemaps, Search, 
      Legend, LayerList, Print, BasemapToggle, FeatureLayer, 
      ScaleBar, Compass, Track) {

        // Guardar el mapa (URL) como cache
        var layer = new TileLayer({
          url:"http://172.110.1.30/arcgis/rest/services/BASE_LOS_LAGOS/MapServer"
        });

        // Cargar los mapas
        var map = new WebMap({
          basemap: "streets"
        });
      
        // View
        var mapView = new MapView({
          container: "mapViewDiv",
          center: {
            x: -72.5,
            y: -41.5
          },
          zoom: 8,
          map: map,
          padding: {
            top: 50,
            bottom: 0
          }
        });

        // Popup
        mapView.then(function(){
          mapView.popup.dockEnabled = false;//mantiene posicion fija del poppup
          mapView.popup.dockOptions = {
            buttonEnabled: false
          }
        });
    
        // Capa aeropuerto
        var featureLayer = new FeatureLayer({
          url: "http://172.110.1.30/arcgis/rest/services/BASE_DAP/MapServer",
          outFields: ["*"],
          
          // REVISA EN EL DOCUMENTO LAYER
          definitionExpression: "",

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
      
        // AGREGAR LA CAPA
        map.add(featureLayer);

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

        // Print
        var printWidget = new Print({
          container: "printDiv",
          view: mapView,
          printServiceUrl: "https://utility.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task"
        });

        // BasemapToggle, no carga el segundo mapa
        var basemapToggle = new BasemapToggle({
          container: "basemapToggle",
          view: mapView
        });
        // Lamada al Togle, no carga el segundo mapa
        mapView.ui.add(basemapToggle, "bottom-right");
        
        // Scalebar
        var scaleBar = new ScaleBar({
          view: mapView,
          unit: "dual" // sistema metrico y no metrico
        });
        // Llamada al ScaleBar
        mapView.ui.add(scaleBar, "bottom-left");
      
        // Cargar el compass, problema icono
        var compassWidget = new Compass({
          view: mapView
        });
        // Llamada al Compass
        mapView.ui.add(compassWidget, "top-left");

        // Carga punto de referencia
        var track = new Track({
          view: mapView
        });
        
        mapView.ui.add(track, "top-left");

        mapView.then(function() {
          track.start();
        });

    }
);
