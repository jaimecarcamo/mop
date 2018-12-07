  // Query US block groups that intersect a county that was clicked
        var queryBlocksTask = new QueryTask({
          url: "https://services2.arcgis.com/FiaPA4ga0iQKduv3/arcgis/rest/services/US_Census_Housing/FeatureServer/3"
        });

        // ***********************************************************
        // Query block groups that intersect the given polygon.
        // Statistics query will return
        // number of block groups that intersect the polygon, total population,
        // and land area of intersecting block groups.
        // ***********************************************************

        function queryBlockGroups(polygon) {
          // count of block groups that intersect the polygon
          var countStatDef = new StatisticDefinition({
            statisticType: "count",
            onStatisticField: "TOTPOP10",
            outStatisticFieldName: "numBlockGroups"
          });

          // sum of population that live in block groups
          // intersected by the polygon
          var populationStatDef = new StatisticDefinition({
            statisticType: "sum",
            onStatisticField: "TOTPOP10",
            outStatisticFieldName: "totalPopulation2010"
          });

          // total land area of block groups that intersect
          // the polygon
          var areaStatDef = new StatisticDefinition({
            statisticType: "sum",
            onStatisticField: "TOTPOP00",
            outStatisticFieldName: "totalPopulation2000"
          });

          var query = new Query({
            geometry: polygon,
            outFields: ["*"],
            spatialRelationship: "intersects",
            outStatistics: [countStatDef, populationStatDef, areaStatDef],
          });

          // execute the query task and return the results
          // as popup content for display to the user
          return queryBlocksTask.execute(query)
            .then(function(result) {
              var stats = result.features[0].attributes;

              var population2010 = numberWithCommas(stats.totalPopulation2010);
              var numBlockGroups = numberWithCommas(stats.numBlockGroups);

              var change = stats.totalPopulation2010 - stats.totalPopulation2000;
              var populationChange = change > 0 ? "+" + numberWithCommas(
                change) : numberWithCommas(change);

              // format the query result for the counties popupTemplate's content.
              return {
                title: population2010,
                content: " people lived in the " + numBlockGroups +
                  " block groups that intersect this polygon in 2010, a change of " +
                  populationChange +
                  " people since 2000."
              };
            }).otherwise(function(error) {
              return {
                title: "No results",
                content: "Query executes against U.S. census data." +
                  " You must draw a polygon within the extent of the United States."
              };
            });
			// formats a number to a string with a thousands separator
        function numberWithCommas(x) {
          return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
        }

       