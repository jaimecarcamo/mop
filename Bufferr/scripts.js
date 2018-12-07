var map, tb;

require(["dojo/dom",

        "dojo/_base/array",
        "dojo/parser",
        "dojo/query",
        "dojo/on",

        "esri/Color",
        "esri/config",
        "esri/map",
        "esri/graphic",

        "esri/geometry/normalizeUtils",
        "esri/tasks/GeometryService",
        "esri/tasks/BufferParameters",
  
        "esri/toolbars/draw",
  
        "esri/symbols/SimpleMarkerSymbol",
        "esri/symbols/SimpleLineSymbol",
        "esri/symbols/SimpleFillSymbol",
        "esri/layers/FeatureLayer",
        "esri/dijit/Scalebar",
        
        "dijit/layout/BorderContainer",
        "dijit/layout/ContentPane",
        "dijit/form/Button", 
        "dojo/domReady!"
        ],
      function(dom, array, parser, query, on, Color, 
        esriConfig, Map, Graphic, normalizeUtils,
        GeometryService, BufferParameters, Draw, 
        SimpleMarkerSymbol, SimpleLineSymbol, 
        SimpleFillSymbol, FeatureLayer, Scalebar
        ){

        parser.parse();

        esriConfig.defaults.geometryService = new GeometryService(
          "https://utility.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer");

        esriConfig.defaults.io.proxyUrl = "/proxy/";
        esriConfig.defaults.io.alwaysUseProxy = false;

       //Setup button click handlers
        on(dom.byId("clearGraphics"), "click", function(){
          if(map){
            map.graphics.clear();
          }
        });
        //click handler for the draw tool buttons
        query(".tool").on("click", function(evt){
          if(tb){
           tb.activate(evt.target.id);
          }
        });

        map = new Map("map", {
          basemap: "streets",
          center: [-72.95, -41.46],
          zoom: 9
        });
        map.on("load", initToolbar);

        var capa = new FeatureLayer(
        "http://172.110.1.30/arcgis/rest/services/BASE_DAP/MapServer/0",
        {infoTemplate: template});

        map.addLayer(capa);

        var scalebar = new Scalebar({
          map: map,
          // "dual" displays both miles and kilometers
          // "english" is the default, which displays miles
          // use "metric" for kilometers
          scalebarUnit: "dual"
        });

        function initToolbar(evtObj) {
          tb = new Draw(evtObj.map);
          tb.on("draw-end", doBuffer);
        }

        function doBuffer(evtObj) {
          tb.deactivate();
          var geometry = evtObj.geometry, symbol;
          switch (geometry.type) {
             case "point":
               symbol = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_SQUARE, 10, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255,0,0]), 1), new Color([0,255,0,0.25]));
               break;
             case "polyline":
               symbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASH, new Color([255,0,0]), 1);
               break;
             case "polygon":
               symbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_NONE, new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASHDOT, new Color([255,0,0]), 2), new Color([255,255,0,0.25]));
               break;
          }

            var graphic = new Graphic(geometry, symbol);
            map.graphics.add(graphic);

            //setup the buffer parameters
            var params = new BufferParameters();
            params.distances = [ dom.byId("distance").value ];
            params.outSpatialReference = map.spatialReference;
            params.unit = GeometryService[dom.byId("unit").value];
            //normalize the geometry 

            normalizeUtils.normalizeCentralMeridian([geometry]).then(function(normalizedGeometries){
              var normalizedGeometry = normalizedGeometries[0];
              if (normalizedGeometry.type === "polygon") {
                //if geometry is a polygon then simplify polygon.  This will make the user drawn polygon topologically correct.
                esriConfig.defaults.geometryService.simplify([normalizedGeometry], function(geometries) {
                  params.geometries = geometries;
                  esriConfig.defaults.geometryService.buffer(params, showBuffer);
                });
              } else {
                params.geometries = [normalizedGeometry];
                esriConfig.defaults.geometryService.buffer(params, showBuffer);
              }

            });
          }

          function showBuffer(bufferedGeometries) {
            var symbol = new SimpleFillSymbol(
              SimpleFillSymbol.STYLE_SOLID,
              new SimpleLineSymbol(
                SimpleLineSymbol.STYLE_SOLID,
                new Color([255,0,0,0.65]), 2
              ),
              new Color([255,0,0,0.35])
            );

            array.forEach(bufferedGeometries, function(geometry) {
              var graphic = new Graphic(geometry, symbol);
              map.graphics.add(graphic);
            });

          }
  });