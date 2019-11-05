var l1admin_data,
  l2_data;

var map1, subcitiesLayer1, markers1 = [];

var map2, subcitiesLayer2, markers2 = [], icons2;

var levels = [ 'L1 Admin', 'L1 UX', 'L2' ], level,
  models = [ 'Urban Landscape', 'Street Design' ], model,
  countries, country,
  cities, city,
  transProfiles, urbanProfiles;

var urlParams = new URLSearchParams(window.location.search),
  profileScheme = 'category10';

if( urlParams.has( 'scheme' ) ) {
  profileScheme = urlParams.get( 'scheme' );
}

var featuresHierarchy = {
  "Street Design" : [
    {
      "key" : "BECADSTTDENS",
      "name" : "Street density",
      "subdomain" : "Street connectivity",
      "description" : "Measures the length of streets per Km2 of area.",
      "interpretation": "Higher values, higher connectivity",
      "units": "streets / Km2"
    }, {
      "key" : "BECADINTDENS",
      "name" : "Intersection density",
      "subdomain" : "Intersection connectivity",
      "description" : "Measures the amount of intersections per Km2 of area.",
      "interpretation": "Higher values, higher connectivity",
      "units": "intersections / Km2"
    }, {
      "key" : "BECADSTTPNODEAVG",
      "name" : "Streets per node average",
      "subdomain" : "Intersection connectivity",
      "description" : "Measures the distribution of the number of streets that meet at each intersection of the street network.",
      "interpretation": "Higher values, higher connectivity",
      "units": "streets"
    }, {
      "key" : "BECADSTTLGAVG",
      "name" : "Street length average",
      "subdomain" : "Street length",
      "description" : "Measures the length of streets in the street network.",
      "interpretation": "Higher values, larger streets segments",
      "units": "meters"
    }, {
      "key" : "BECADCRCTYAVG",
      "name" : "Circuity average",
      "subdomain" : "Directness",
      "description" : "Measures the average ratio of network distances to straight-line distances.",
      "interpretation": "Higher values, more curved streets",
      "units": undefined
    }
  ],
  "Urban Landscape" : [ 
    {
      "key" : "BECNURBPTCH",
      "name" : "Number of urban patches",
      "subdomain" : "Fragmentation",
      "description" : "Number of contiguous areas of urban development (urban patches hereafter).",
      "interpretation": "Higher values, higher fragmentation",
      "units": "urban patches"
    }, {
      "key" : "BECPTCHDENS",
      "name" : "Patch density",
      "subdomain" : "Fragmentation",
      "description" : "Number of urban patches divided by the total area of the geographic unit (in 100 hectares).",
      "interpretation": "Higher values, higher fragmentation",
      "units": "urban patches / km2"
    }, {
      "key" : "BECAWAVGPTCHAREA",
      "name" : "Area-weighted mean patch size",
      "subdomain" : "Fragmentation",
      "description" : "Weighted average of urban patch size (in km2). This value is weighted by the area of each patch.",
      "interpretation": "Higher values, lower fragmentation",
      "units": "km2"
    }, {
      "key" : "BECEFFMESHSIZE",
      "name" : "Effective mesh size",
      "subdomain" : "Fragmentation",
      "description" : "The sum of squares of urban patch size, divided by the total area of the geographic unit.",
      "interpretation": "Higher values, lower fragmentation",
      "units": "km2"
    }, {
      "key" : "BECAWMNSHPINDX",
      "name" : "Area-weighted mean shape index",
      "subdomain" : "Shape",
      "description" : "Shape index is a ratio of the actual perimeter of a patch to the minimum perimeter possible for a maximally compact patch with the same size. The area-weighted mean shape index is the weighted average of the shape index for each patch within the geographic boundary. This index is weighted by the area of each patch.",
      "interpretation": "Higher values, more complex shape",
      "units": undefined
    }, {
      "key" : "BECAWMNNNGH",
      "name" : "Area-weighted mean nearest neighbor distance",
      "subdomain" : "Isolation",
      "description" : "Mean distance (in meters) to the nearest urban patch within the geographic boundary. This value is weighted by the area of each patch.",
      "interpretation": "Higher values, higher isolation",
      "units": "meters"
    } 
  ]
};

var icons = {
    1: new L.Icon( {
      iconUrl: './assets/img/icons/blue.png',
      iconSize: [ 17, 25 ],
      popupAnchor: [ 0, -10 ]
    } ),
    2: new L.Icon( {
      iconUrl: './assets/img/icons/orange.png',
      iconSize: [ 17, 25 ],
      popupAnchor: [ 0, -10 ]
    } ),
    3: new L.Icon( {
      iconUrl: './assets/img/icons/green.png',
      iconSize: [ 17, 25 ],
      popupAnchor: [ 0, -10 ]
    } ),
    4: new L.Icon( {
      iconUrl: './assets/img/icons/red.png',
      iconSize: [ 17, 25 ],
      popupAnchor: [ 0, -10 ]
    } ),
    5: new L.Icon( {
      iconUrl: './assets/img/icons/purple.png',
      iconSize: [ 17, 25 ],
      popupAnchor: [ 0, -10 ]
    } ),
    6: new L.Icon( {
      iconUrl: './assets/img/icons/brown.png',
      iconSize: [ 17, 25 ],
      popupAnchor: [ 0, -10 ]
    } )
  };

function initMap1() {

  map1 = L.map( 'map1' );

  L.tileLayer( 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo( map1 );

  //subcitiesLayer1 = new L.layerGroup();
  subcitiesLayer1 = new L.MarkerClusterGroup( {
    iconCreateFunction: ( cluster ) => L.divIcon( { html: '<span style="font-size: 15px;"><b>' + ( +cluster.getChildCount() )  + '</b></span>', className: 'mycluster', iconSize: new L.Point( 40, 40 ) } )
  } );
  subcitiesLayer1.addTo( map1 );

  var searchControl1 = new L.Control.Search( { layer: subcitiesLayer1, marker: false, moveToLocation: ( latlng ) => {
      map1.setView( latlng, 10 );
      map2.setView( latlng, 10 );
    } } );
  map1.addControl( searchControl1 );

  drawMap1();

}

function initMap2() {

  map2 = L.map( 'map2' );

  L.tileLayer( 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo( map2 );

  //subcitiesLayer2 = new L.layerGroup();
  subcitiesLayer2 = new L.MarkerClusterGroup( {
    iconCreateFunction: ( cluster ) => L.divIcon( { html: '<span style="font-size: 15px;"><b>' + ( +cluster.getChildCount() )  + '</b></span>', className: 'mycluster', iconSize: new L.Point( 40, 40 ) } )
  } );
  subcitiesLayer2.addTo( map2 );

  var searchControl2 = new L.Control.Search( { layer: subcitiesLayer2, marker: false, moveToLocation: ( latlng ) => {
      map1.setView( latlng, 10 );
      map2.setView( latlng, 10 );
    } } );
  map2.addControl( searchControl2 );

  var countryControl2 = L.control( { position: 'topright' } );
  countryControl2.onAdd = ( map ) => {
    var div = L.DomUtil.create( 'div', 'info legend' );
    div.innerHTML = '<select id="countrySelect2"></select>';
    div.firstChild.onmousedown = div.firstChild.ondblclick = L.DomEvent.stopPropagation;
    return div;
  };
  countryControl2.addTo( map2 );

  drawMap2();

  d3.select( "#countrySelect2" ).selectAll( 'option' )
    .data( [ { 'key' : undefined } ].concat( l1admin_countries ).sort( ( x, y ) => d3.ascending( x.key, y.key ) ) )
    .enter()
    .append( 'option' )
      .attr( 'value', d => d.key )
      .html( d => d.key );

  d3.select( "#countrySelect2" )
    .on( 'change', function() {
      if( this.value !== undefined && this.value !== '' ) {
        var bounds = new L.LatLngBounds( l2_data.filter( d => d.COUNTRY === this.value ).map( d => [ d.LAT, d.LONG ] ) );
        map1.fitBounds( bounds );
        map2.fitBounds( bounds );
      
        drawSparkLines( level, model, this.value );
        drawUnitsByProfile( level, model, this.value );
      } else {
        map1.setView( [ -16.47, -74.36], 0 );
        map2.setView( [ -16.47, -74.36], 0 );
      
        drawSparkLines( level, model );
        drawUnitsByProfile( level, model );
      }
    } );

}

function drawMap1( level = 'L1 Admin', fit = false ) {

  map1.setView( [ -16.47, -74.36], 0 );

  // Remove all layers in map
  subcitiesLayer1.clearLayers();

  var dataTemp;
  if( level === 'L1 Admin' ) dataTemp = l1admin_data;
  else if( level === 'L1 UX' ) dataTemp = l1ux_data;
  else dataTemp = l2_data;

  // Draw the markers
  dataTemp.map( d => {
    var marker = L.marker( [ d[ 'LAT' ], d[ 'LONG' ] ], { icon: icons[ 1 ], title: ( level === 'L1 Admin' || level === 'L1 UX' ) ? d[ 'L1' ] : d[ 'L2' ] } ).addTo( subcitiesLayer1 )
      .bindPopup( '<b>Country: </b>' + d[ 'COUNTRY' ] + '<br /><b>City: </b>' + d[ 'L1' ] + ( ( d[ 'L2' ] !== undefined ) ? '<br /><b>Sub-city: </b>' + d[ 'L2' ] : '' ) );
  } );

  if( fit === true ) {
    var bounds = new L.LatLngBounds( dataTemp.map( d => [ d.LAT, d.LONG ] ) );
    map1.fitBounds( bounds );
  }

}

function drawMap2( level = 'L1 Admin', model = 'Urban Landscape', fit = false  ) {

  map2.setView( [ -16.47, -74.36], 0 );
  document.getElementById( "countrySelect2" ).selectedIndex = 0;

  // Remove all layers in map
  subcitiesLayer2.clearLayers();

  var dataTemp;
  if( level === 'L1 Admin' ) dataTemp = l1admin_data;
  else if( level === 'L1 UX' ) dataTemp = l1ux_data;
  else dataTemp = l2_data;

  // Draw the markers
  dataTemp.forEach( d => {

    var colorAttr = ( model === 'Street Design' ) ? 'TRANS_PROF' : 'URBAN_PROF';
    var colorAttrName = ( model === 'Street Design' ) ? 'TRANS_PROF_NAME' : 'URBAN_PROF_NAME';
    var probAttr = ( model === 'Street Design' ) ? 'TRANS_PROB' : 'URBAN_PROB';

    var marker = L.marker( [ d[ 'LAT' ], d[ 'LONG' ] ], { icon: icons[ d[ colorAttr ] ], title: ( level === 'L1 Admin' || level === 'L1 UX' ) ? d[ 'L1' ] : d[ 'L2' ] } ).addTo( subcitiesLayer2 )
      .bindPopup( '<b>Country: </b>' + d[ 'COUNTRY' ] + '<br /><b>City: </b>' + d[ 'L1' ] + ( ( d[ 'L2' ] !== undefined ) ? '<br /><b>Sub-city: </b>' + d[ 'L2' ] : '' ) + '<br /><b>Profile: </b>' + d[ colorAttrName ] + '<br /><b>Probality: </b>' + d3.format(".2f")( d[ probAttr ] ) );
  } );

  if( fit === true ) {
    var bounds = new L.LatLngBounds( dataTemp.map( d => [ d.LAT, d.LONG ] ) );
    map2.fitBounds( bounds );
  }

}

function drawUnitsByCountry( level = 'L1 Admin' ) {

  var dataTemp;
  if( level === 'L1 Admin' ) dataTemp = l1admin_data;
  else if( level === 'L1 UX' ) dataTemp = l1ux_data;
  else dataTemp = l2_data;

  var profiles_chart = {
    "$schema": "https://vega.github.io/schema/vega-lite/v3.json",
    "width": +d3.select( '#unitsByCountry' ).node().parentNode.getBoundingClientRect().width - 100,
    "height": 360,
    "data": {
      "values": dataTemp
    },
    "layer": [ 
      {
        "mark": "bar"
      }, 
      {
        "mark": {
          "type": "text",
          "align": "left",
          "baseline": "middle",
          "dx": 5,
          "align": "left",
          "font": "Roboto",
          "fontSize": 16,
          "opacity": 1,
          "fontWeight": 300
        },
        "encoding": {
          "text": {
            "aggregate": "sum",
            "field": ( ( country !== undefined ) ? "PERCENTAGE_COUNTRY" : "PERCENTAGE" ),
            "type": "quantitative",
            "format": ".1%"
          },
          "color": { "value": "black" }
        }
      }
    ],
    "encoding": {
      "y": {
        "field": "COUNTRY", 
        "type": "nominal",
        "sort": { "encoding": "x", "order": "descending" },
        "axis": { 
          "title": "Country", 
          "titleFont": "Roboto",
          "titleFontSize": 16,
          "titleOpacity": 1,
          "titleFontWeight": 300,
          "titleColor": "black",
          "labelFont": "Roboto",
          "labelFontSize": 16,
          "labelOpacity": 1,
          "labelFontWeight": 300,
          "labelColor": "black",
          "tickColor": "black"
        }
      },
      "x": {
        "aggregate": "count",
        "field": "COUNTRY",
        "type": "quantitative",
        "axis": { 
          "title": ( level === 'L2' ) ? '# of sub-cities' : ( ( level === 'L1 UX' ) ? '# of UX cities' : '# of Admin cities' ), 
          "titleFont": "Roboto",
          "titleFontSize": 16,
          "titleOpacity": 1,
          "titleFontWeight": 300,
          "titleColor": "black",
          "labelFont": "Roboto",
          "labelFontSize": 16,
          "labelOpacity": 1,
          "labelFontWeight": 300,
          "labelColor": "black",
          "tickColor": "black",
          "tickCount": 8
        }
      },
      "color": {
        "value": "#39b69d"
      }
    }
  };

  vegaEmbed( '#unitsByCountry', profiles_chart, { "actions" : false } ).then( ( { spec, view } ) => {
    view.addEventListener( 'click', function ( event, item ) {

    } )
  } );

}

function drawFeaturesTable( level = 'L1 Admin', model = 'Urban Landscape' ) {

  d3.select( '#domain-tbl-span' ).html( model );

  d3.select( '#featureTable' ).select( 'tbody' ).html( '' );

  d3.select( '#featureTable' ).select( 'tbody' ).selectAll( 'tr' )
    .data( featuresHierarchy[ model ] )
    .enter()
    .append( 'tr' )
      .html( d => '<td style="background-color: white; font-size: 14px; text-align: center; opacity: 0.8;">' + d.subdomain + '<br /><i class="far fa-question-circle" data-toggle="tooltip" data-placement="right" title="' + d.interpretation +'"></i></td><td style="background-color: white; font-size: 14px;  text-align: center; opacity: 0.8;">' + d.name + ( ( d.units !== undefined )  ? ' (' + d.units + ')' : '' ) + '<br /><i class="far fa-question-circle" data-toggle="tooltip" data-placement="right" title="' + d.description +'"></i></td><td id="sparkline-' + d.key + '" style="background-color: white;"></td>' );

  drawSparkLines( level, model );

}

function drawSparkLines( level = 'L1 Admin', model = 'Urban Landscape', country ) {

  var dataTemp;
  if( level === 'L1 Admin' ) dataTemp = l1admin_data;
  else if( level === 'L1 UX' ) dataTemp = l1ux_data;
  else dataTemp = l2_data;

  featuresHierarchy[ model ].forEach( f => {

    var feature = f.key;

    var width = +d3.select( 'table' ).node().getBoundingClientRect().width * .5,
      height = 80;

    d3.select( '#sparkline-' + feature ).html( '' );

    var spec = {
      "width": width,
      "height": height,
      "$schema": "https://vega.github.io/schema/vega-lite/v3.json",
      "data": { "values": dataTemp },
      "layer": [
        {
          "mark": "bar",
          "encoding": {
            "x": {
              "bin": true,
              "field": feature,
              "type": "quantitative",
              "axis": { 
                "title": null,
                "labelFont": "Roboto",
                "labelFontSize": 16,
                "labelOpacity": 1,
                "labelFontWeight": 300
              }
            },
            "y": {
              "aggregate": "count",
              "type": "quantitative",
              "axis": { 
                "title": ( level === 'L2' ) ? '# of sub-cities' : ( ( level === 'L1 UX' ) ? '# of UX cities' : '# of Admin cities' ),
                "titleFont": "Roboto",
                "titleFontSize": 16,
                "titleOpacity": 1,
                "titleFontWeight": 300,
                "labelFont": "Roboto",
                "labelFontSize": 16,
                "labelOpacity": 1,
                "labelFontWeight": 300
              }
            },
            "color": { "value": ( ( country === undefined ) ? "#39b69d" : "#ccc" ) }
          }
        }, 
        {
          "mark": {
            "type": "text",
            "align": "left",
            "baseline": "top",
            "dx": 18,
            "dy": -14,
            "align": "right",
            "font": "Roboto",
            "fontSize": 13,
            "opacity": 1,
            "fontWeight": 300
          },
          "encoding": {
            "x": {
              "bin": true,
              "field": feature,
              "type": "quantitative",
              "axis": { 
                "title": null,
                "labelFont": "Roboto",
                "labelFontSize": 16,
                "labelOpacity": 1,
                "labelFontWeight": 300
              }
            },
            "y": {
              "aggregate": "count",
              "type": "quantitative",
              "axis": { 
                "title": ( level === 'L2' ) ? '# of sub-cities' : ( ( level === 'L1 UX' ) ? '# of UX cities' : '# of Admin cities' ),
                "titleFont": "Roboto",
                "titleFontSize": 16,
                "titleOpacity": 1,
                "titleFontWeight": 300,
                "labelFont": "Roboto",
                "labelFontSize": 16,
                "labelOpacity": 1,
                "labelFontWeight": 300
              }
            },
            "text": {
              "aggregate": "sum",
              //"field": ( ( country !== undefined ) ? "PERCENTAGE_COUNTRY" : "PERCENTAGE" ),
              "field": "PERCENTAGE",
              "type": "quantitative",
              "format": ".1%"
            },
            "color": { "value": "black" }
          }
        }
      ]
    };

    if( country !== undefined )
      spec.layer.push( {
        "mark": "bar",
        "transform": [ { "filter": { "field": "COUNTRY", "equal": country } } ],
        "encoding": {
          "x": {
            "bin": true,
            "field": feature,
            "type": "quantitative",
            "axis": { 
              "title": null,
              "labelFont": "Roboto",
              "labelFontSize": 16,
              "labelOpacity": 1,
              "labelFontWeight": 300
            }
          },
          "y": {
            "aggregate": "count",
            "type": "quantitative",
            "axis": { 
              "title": ( level === 'L2' ) ? '# of sub-cities' : ( ( level === 'L1 UX' ) ? '# of UX cities' : '# of Admin cities' ),
              "titleFont": "Roboto",
              "titleFontSize": 16,
              "titleOpacity": 1,
              "titleFontWeight": 300,
              "labelFont": "Roboto",
              "labelFontSize": 16,
              "labelOpacity": 1,
              "labelFontWeight": 300
            }
          },
          "color": { "value": "#39b69d" }
        }
      } );

    vegaEmbed( '#sparkline-' + feature, spec, { "actions" : false } );

  } );

}

function drawUnitsByProfile( level = 'L1 Admin', model = 'Urban Landscape', country ) {

  var dataTemp;
  if( level === 'L1 Admin' ) dataTemp = l1admin_data;
  else if( level === 'L1 UX' ) dataTemp = l1ux_data;
  else dataTemp = l2_data;

  var colorAttr = ( model === 'Street Design' ) ? 'TRANS_PROF' : 'URBAN_PROF';
  var colorAttrName = ( model === 'Street Design' ) ? 'TRANS_PROF_NAME' : 'URBAN_PROF_NAME';

  if( country !== undefined ) {

    var profiles_chart = {
      "$schema": "https://vega.github.io/schema/vega-lite/v3.json",
      "width": +d3.select( '#profiles' ).node().parentNode.getBoundingClientRect().width - 250,
      "height": 200,
      "data": {
        "values": dataTemp
      },
      "layer": [ 
        {
          "mark": "bar",
          "encoding": {
            "y": {
              "field": colorAttrName, 
              "type": "nominal",
              "sort": { "encoding": "x", "order": "descending" },
              "axis": { 
                "title": "Profile", 
                "titleFont": "Roboto",
                "titleFontSize": 16,
                "titleOpacity": 1,
                "titleFontWeight": 300,
                "titleAngle": 0,
                "titleY": 0,
                "titleX": -45,
                "labelFont": "Roboto",
                "labelFontSize": 14,
                "labelOpacity": 1,
                "labelFontWeight": 300,
                //"labelAngle": -45
              }
            },
            "x": {
              "aggregate": "count",
              "field": colorAttrName,
              "type": "quantitative",
              "axis": { 
                "title": ( level === 'L2' ) ? '# of sub-cities' : ( ( level === 'L1 UX' ) ? '# of UX cities' : '# of Admin cities' ), 
                "titleFont": "Roboto",
                "titleFontSize": 16,
                "titleOpacity": 1,
                "titleFontWeight": 300,
                "labelFont": "Roboto",
                "labelFontSize": 16,
                "labelOpacity": 1,
                "labelFontWeight": 300
              }
            },
            "color": { "value": "#ccc" },
            "tooltip": [
              { "field": colorAttrName, "type": "nominal", "title": "Profile" },
              { "aggregate": "count", "field": colorAttr, "type": "quantitative" }
            ]
          }
        },
        {
          "mark": {
            "type": "text",
            "align": "left",
            "baseline": "middle",
            "dx": 5,
            "align": "left",
            "font": "Roboto",
            "fontSize": 16,
            "opacity": 1,
            "fontWeight": 300
          },
          "encoding": {
            "y": {
              "field": colorAttrName, 
              "type": "nominal",
              "sort": { "encoding": "x", "order": "descending" },
              "axis": { 
                "title": "Profile", 
                "titleFont": "Roboto",
                "titleFontSize": 16,
                "titleOpacity": 1,
                "titleFontWeight": 300,
                "labelFont": "Roboto",
                "labelFontSize": 14,
                "labelOpacity": 1,
                "labelFontWeight": 300
              }
            },
            "x": {
              "aggregate": "count",
              "field": colorAttrName,
              "type": "quantitative",
              "axis": { 
                "title": ( level === 'L2' ) ? '# of sub-cities' : ( ( level === 'L1 UX' ) ? '# of UX cities' : '# of Admin cities' ), 
                "titleFont": "Roboto",
                "titleFontSize": 16,
                "titleOpacity": 1,
                "titleFontWeight": 300,
                "labelFont": "Roboto",
                "labelFontSize": 14,
                "labelOpacity": 1,
                "labelFontWeight": 300
              }
            },
            "text": {
              "aggregate": "sum",
              //"field": ( ( country !== undefined ) ? "PERCENTAGE_COUNTRY" : "PERCENTAGE" ),
              "field": "PERCENTAGE",
              "type": "quantitative",
              "format": ".1%"
            },
            "color": { "value": "black" }
          }
        },
        {
          "mark": "bar",
          "transform": [ { "filter": { "field": "COUNTRY", "equal": country } } ],
          "encoding": {
            "y": {
              "field": colorAttrName, 
              "type": "nominal",
              "sort": { "encoding": "x", "order": "descending" },
              "axis": { 
                "title": "Profile", 
                "titleFont": "Roboto",
                "titleFontSize": 16,
                "titleOpacity": 1,
                "titleFontWeight": 300,
                "titleAngle": 0,
                "titleY": 0,
                "titleX": -45,
                "labelFont": "Roboto",
                "labelFontSize": 14,
                "labelOpacity": 1,
                "labelFontWeight": 300,
                //"labelAngle": -45
              }
            },
            "x": {
              "aggregate": "count",
              "field": colorAttrName,
              "type": "quantitative",
              "axis": { 
                "title": ( level === 'L2' ) ? '# of sub-cities' : ( ( level === 'L1 UX' ) ? '# of UX cities' : '# of Admin cities' ), 
                "titleFont": "Roboto",
                "titleFontSize": 16,
                "titleOpacity": 1,
                "titleFontWeight": 300,
                "labelFont": "Roboto",
                "labelFontSize": 16,
                "labelOpacity": 1,
                "labelFontWeight": 300
              }
            },
            "color": {
              "field": colorAttr,
              "type": "nominal",
              "legend": null,
                "scale": {
                  "domain": [ "1", "2", "3", "4", "5", "6" ],
                  "scheme": profileScheme
                }
            },
            "tooltip": [
              { "field": colorAttrName, "type": "nominal", "title": "Profile" },
              { "aggregate": "count", "field": colorAttr, "type": "quantitative" }
            ]
          }
        }
      ]
    };

  } else {

    var profiles_chart = {
      "$schema": "https://vega.github.io/schema/vega-lite/v3.json",
      "width": +d3.select( '#profiles' ).node().parentNode.getBoundingClientRect().width - 250,
      "height": 200,
      "data": {
        "values": dataTemp
      },
      "layer": [ 
        {
          "mark": "bar",
          "encoding": {
            "y": {
              "field": colorAttrName, 
              "type": "nominal",
              "sort": { "encoding": "x", "order": "descending" },
              "axis": { 
                "title": "Profile", 
                "titleFont": "Roboto",
                "titleFontSize": 16,
                "titleOpacity": 1,
                "titleFontWeight": 300,
                "titleAngle": 0,
                "titleY": 0,
                "titleX": -45,
                "labelFont": "Roboto",
                "labelFontSize": 14,
                "labelOpacity": 1,
                "labelFontWeight": 300,
                //"labelAngle": -45
              }
            },
            "x": {
              "aggregate": "count",
              "field": colorAttrName,
              "type": "quantitative",
              "axis": { 
                "title": ( level === 'L2' ) ? '# of sub-cities' : ( ( level === 'L1 UX' ) ? '# of UX cities' : '# of Admin cities' ), 
                "titleFont": "Roboto",
                "titleFontSize": 16,
                "titleOpacity": 1,
                "titleFontWeight": 300,
                "labelFont": "Roboto",
                "labelFontSize": 16,
                "labelOpacity": 1,
                "labelFontWeight": 300
              }
            },
            "color": {
              "field": colorAttr,
              "type": "nominal",
              "legend": null,
                "scale": {
                  "domain": [ "1", "2", "3", "4", "5", "6" ],
                  "scheme": profileScheme
                }
            },
            "tooltip": [
              { "field": colorAttrName, "type": "nominal", "title": "Profile" },
              { "aggregate": "count", "field": colorAttr, "type": "quantitative" }
            ]
          }
        }, 
        {
          "mark": {
            "type": "text",
            "align": "left",
            "baseline": "middle",
            "dx": 5,
            "align": "left",
            "font": "Roboto",
            "fontSize": 16,
            "opacity": 1,
            "fontWeight": 300
          },
          "encoding": {
            "y": {
              "field": colorAttrName, 
              "type": "nominal",
              "sort": { "encoding": "x", "order": "descending" },
              "axis": { 
                "title": "Profile", 
                "titleFont": "Roboto",
                "titleFontSize": 16,
                "titleOpacity": 1,
                "titleFontWeight": 300,
                "labelFont": "Roboto",
                "labelFontSize": 14,
                "labelOpacity": 1,
                "labelFontWeight": 300,
                //"labelAngle": -45
              }
            },
            "x": {
              "aggregate": "count",
              "field": colorAttrName,
              "type": "quantitative",
              "axis": { 
                "title": ( level === 'L2' ) ? '# of sub-cities' : ( ( level === 'L1 UX' ) ? '# of UX cities' : '# of Admin cities' ), 
                "titleFont": "Roboto",
                "titleFontSize": 16,
                "titleOpacity": 1,
                "titleFontWeight": 300,
                "labelFont": "Roboto",
                "labelFontSize": 16,
                "labelOpacity": 1,
                "labelFontWeight": 300
              }
            },
            "text": {
              "aggregate": "sum",
              //"field": ( ( country !== undefined ) ? "PERCENTAGE_COUNTRY" : "PERCENTAGE" ),
              "field": "PERCENTAGE",
              "type": "quantitative",
              "format": ".1%"
            },
            "color": { "value": "black" }
          }
        }
      ]
    };

  }

  vegaEmbed( '#profiles', profiles_chart, { "actions" : false } ).then( ( { spec, view } ) => {
    view.addEventListener( 'click', function ( event, item ) {
        console.log( item.datum );
    } )
  } );

}

d3.selectAll( "#levelSelect-slide1" )
  .on( 'change', function() {

    level = $( 'input[name=levelSelect-slide1]:checked').val();

    $( 'input[name=levelSelect-slide2]').prop( "checked", false );
    $( 'input[value="' + level + '"]').prop( "checked", true );

    /*if( this.checked ) { 
      level = 'L2';
      document.getElementById( "levelSelect-slide2" ).checked = true;
    } else {
      level = 'L1 UX';
      document.getElementById( "levelSelect-slide2" ).checked = false;
    }*/

    drawUnitsByCountry( level );
    drawSparkLines( level, model );
    drawUnitsByProfile( level, model );
    drawMap1( level, model );
    drawMap2( level, model );

  } );

d3.selectAll( "#levelSelect-slide2" )
  .on( 'change', function() {
    
    level = $( 'input[name=levelSelect-slide2]:checked').val();

    $( 'input[name=levelSelect-slide1]').prop( "checked", false );
    $( 'input[value="' + level + '"]').prop( "checked", true );

    /*if( this.checked ) { 
      level = 'L2';
      document.getElementById( "levelSelect-slide1" ).checked = true;
    } else {
      level = 'L1 UX';
      document.getElementById( "levelSelect-slide1" ).checked = false;
    }*/

    drawUnitsByCountry( level );
    drawSparkLines( level, model );
    drawUnitsByProfile( level, model );
    drawMap1( level, model );
    drawMap2( level, model );

  } );

d3.selectAll( "#modelSelect-slide2" )
  .on( 'change', function() {

    if( this.checked ) {
      model = 'Street Design';
      $( "#street-design-labels" ).show();
      $( "#urban-landscape-labels" ).hide();
    } else {
      model = 'Urban Landscape';
      $( "#street-design-labels" ).hide();
      $( "#urban-landscape-labels" ).show();
    }

    drawFeaturesTable( level, model );
    drawUnitsByProfile( level, model );
    drawMap2( level, model );

  } );

d3.csv( "./data/l1Admin.csv", d => parseNumbers( d ) ).then( data => {

  l1admin_data = data;
  l1admin_data = l1admin_data.map( d => {
    d.TRANS_PROF_NAME = transformProfiles( 'L1 Admin', 'Street Design', d.TRANS_PROF );
    d.URBAN_PROF_NAME = transformProfiles( 'L1 Admin', 'Urban Landscape', d.URBAN_PROF );
    d.PERCENTAGE = 1 / l1admin_data.length;
    d.PERCENTAGE_COUNTRY = 1 / l1admin_data.filter( k => k.COUNTRY === d.COUNTRY ).length;
    return d;
  } );

  l1admin_countries = d3.nest().key( d => d.COUNTRY ).rollup( v => v.length ).entries( l1admin_data );
  l1admin_cities = d3.nest().key( d => d.COUNTRY ).key( d => d.L1 ).rollup( v => v.length ).entries( l1admin_data );
  
  d3.csv( "./data/l1UX.csv", d => parseNumbers( d ) ).then( data => {

    l1ux_data = data;
    l1ux_data = l1ux_data.map( d => {
      d.TRANS_PROF_NAME = transformProfiles( 'L1 UX', 'Street Design', d.TRANS_PROF );
      d.URBAN_PROF_NAME = transformProfiles( 'L1 UX', 'Urban Landscape', d.URBAN_PROF );
      d.PERCENTAGE = 1 / l1ux_data.length;
      d.PERCENTAGE_COUNTRY = 1 / l1ux_data.filter( k => k.COUNTRY === d.COUNTRY ).length;
      return d;
    } );

    l1ux_countries = d3.nest().key( d => d.COUNTRY ).rollup( v => v.length ).entries( l1ux_data );
    l1ux_cities = d3.nest().key( d => d.COUNTRY ).key( d => d.L1 ).rollup( v => v.length ).entries( l1ux_data );

    d3.csv( "./data/l2.csv", d => parseNumbers( d ) ).then( data => {

      l2_data = data;
      l2_data = l2_data.map( d => {
        d.TRANS_PROF_NAME = transformProfiles( 'L2', 'Street Design', d.TRANS_PROF );
        d.URBAN_PROF_NAME = transformProfiles( 'L2', 'Urban Landscape', d.URBAN_PROF );
        d.PERCENTAGE = 1 / l2_data.length;
        d.PERCENTAGE_COUNTRY = 1 / l2_data.filter( k => k.COUNTRY === d.COUNTRY ).length;
        return d;
      } );

      level = levels[ 0 ];
      model = models[ 0 ];

      //l2_countries = d3.nest().key( d => d.COUNTRY ).rollup( v => v.length ).entries( l2_data );
      //l2_cities = d3.nest().key( d => d.COUNTRY ).key( d => d.L1 ).rollup( v => v.length ).entries( l2_data );
      //l2_subcities = d3.nest().key( d => d.COUNTRY ).key( d => d.L2 ).rollup( v => v.length ).entries( l2_data );
      l2_subcities = d3.map( l2_data, d => d.COUNTRY ).keys().map( c => { return { 'key': c, 'values': l2_data.filter( d => d.COUNTRY === c ).map( l => { return { 'key': l.L2, 'value': 1 } } ) } } );
      
      // Slide 2
      //drawLevelCombo();
      drawUnitsByCountry();
      initMap1();
      
      // Slide 3
      //drawModelCombo();
      //drawCountryCombo();
      drawFeaturesTable();
      drawUnitsByProfile();
      initMap2();

    } );

  } );

} );

function parseNumbers( d ) {
  
  /* Street Design model */
  d[ "BECADCRCTYAVG" ] = +d[ "BECADCRCTYAVG" ];
  d[ "BECADINTDENS" ] = +d[ "BECADINTDENS" ];
  d[ "BECADSTTDENS" ] = +d[ "BECADSTTDENS" ];
  d[ "BECADSTTLGAVG" ] = +d[ "BECADSTTLGAVG" ];
  d[ "BECADSTTPNODEAVG" ] = +d[ "BECADSTTPNODEAVG" ];

  /* Urban Landscape model */
  d[ "BECNURBPTCH" ] = +d[ "BECNURBPTCH" ];
  d[ "BECPTCHDENS" ] = +d[ "BECPTCHDENS" ];
  d[ "BECEFFMESHSIZE" ] = +d[ "BECEFFMESHSIZE" ] / 100;
  d[ "BECAWAVGPTCHAREA" ] = +d[ "BECAWAVGPTCHAREA" ] / 100;
  d[ "BECAWMNSHPINDX" ] = +d[ "BECAWMNSHPINDX" ];
  d[ "BECAWMNNNGH" ] = +d[ "BECAWMNNNGH" ];

  d[ "TRANS_PROB" ] = +d[ "TRANS_PROB" ];
  d[ "URBAN_PROB" ] = +d[ "URBAN_PROB" ];

  d[ "LONG" ] = +d[ "LONG" ];
  d[ "LAT" ] = +d[ "LAT" ];

  return d;

}

function transformProfiles( level, model, profile ) {

  var name;
  if( model === 'Street Design' ){
    if( level === 'L1 Admin' ) {
      if( profile === "1" ) name = 'Semi-hyperbolic grid';
      else if( profile === "2" ) name = 'Labyrinth';
      else if( profile === "3" ) name = 'Spiderweb';
      else if( profile === "4" ) name = 'Hyperbolic grid';
    } else if( level === 'L1 UX' ) {
      if( profile === "1" ) name = 'Semi-hyperbolic grid';
      else if( profile === "2" ) name = 'Straight grid';
      else if( profile === "3" ) name = 'Spiderweb';
      else if( profile === "4" ) name = 'Labyrinth';
      else if( profile === "5" ) name = 'Hyperbolic labyrinth';
    } else {
      if( profile === "1" ) name = 'M Str. Connect./M Curved';
      else if( profile === "2" ) name = 'L Str. Connect./H Curved';
      else if( profile === "3" ) name = 'M Str. Connect./Straight';
      else if( profile === "4" ) name = 'H Str. Connect./M Curved';
    }     
  } else {
    if( level === 'L1 Admin' ) {
      if( profile === "1" ) name = 'Proximate stones';
      else if( profile === "2" ) name = 'Scattered pixels';
      else if( profile === "3" ) name = 'Proximate inkblots';
      else if( profile === "4" ) name = 'Contiguous large inkblots';
    } else if( level === 'L1 UX' ) {
      if( profile === "1" ) name = 'Contiguous pixels';
      else if( profile === "2" ) name = 'Proximate stones';
      else if( profile === "3" ) name = 'Contiguous large inkblots';
      else if( profile === "4" ) name = 'Scattered large inkblots';
    } else {
      if( profile === "1" ) name = 'H Frag./Complex/M Iso.';
      else if( profile === "2" ) name = 'M Frag./Irregular/L Iso.';
      else if( profile === "3" ) name = 'L Frag./Complex/L Iso.';
      else if( profile === "4" ) name = 'M Frag./Compact/H Iso.';
      else if( profile === "5" ) name = 'L Frag./Irregular/L Iso.';
      else if( profile === "6" ) name = 'H Frag./Compact/M Iso.';
    }
  }

  return name;

}

/* Tooltips - Urban Landscape */

$( "#contiguous-large-inkblots" ).tooltip( {
  title: "<img src='./assets/img/labels/urban/contiguous-large-inkblots.png'><p style='color: white !important; font-size: 14px !important;'><b>Contiguous large inkblots:</b> Cities with higher patch density and higher area weighted mean patch size, patches with complex shape and lower isolation.</p>",  
  html: true, 
} );

$( "#contiguous-pixels" ).tooltip( {
  title: "<img src='./assets/img/labels/urban/contiguous-pixels.png'><p style='color: white !important; font-size: 14px !important;'><b>Contiguous pixels:</b> Cities moderate patch density and lower area weighted mean patch size, patches with compact shape and lower isolation.</p>",  
  html: true, 
} );

$( "#proximate-inkblots" ).tooltip( {
  title: "<img src='./assets/img/labels/urban/proximate-inkblots.png'><p style='color: white !important; font-size: 14px !important;'><b>Proximate inkblots:</b> Cities with moderate patch density and higher area weighted mean patch size, patches with complex shape and moderate isolation.</p>",  
  html: true, 
} );

$( "#proximate-stones" ).tooltip( {
  title: "<img src='./assets/img/labels/urban/proximate-stones.png'><p style='color: white !important; font-size: 14px !important;'><b>Proximate stones:</b> Cities with moderate patch density and moderate area weighted mean patch size, patches with irregular shape and moderate isolation.</p>",  
  html: true, 
} );

$( "#scattered-large-inkblots" ).tooltip( {
  title: "<img src='./assets/img/labels/urban/scattered-large-inkblots.png'><p style='color: white !important; font-size: 14px !important;'><b>Scattered large inkblots:</b> Cities with moderate patch density and higher area weighted mean patch size, patches with complex shape and higher isolation.</p>",  
  html: true, 
} );

$( "#scattered-pixels" ).tooltip( {
  title: "<img src='./assets/img/labels/urban/scattered-pixels.png'><p style='color: white !important; font-size: 14px !important;'><b>Scattered pixels:</b> Cities with lower patch density and lower area weighted mean patch size, patches with compact shape and higher isolation.</p>",  
  html: true, 
} );

/* Tooltips - Street Design */

$( "#hyperbolic-grid" ).tooltip( {
  title: "<img src='./assets/img/labels/street/hyperbolic-grid.png'><p style='color: white !important; font-size: 14px !important;'><b>Hyperbolic grid:</b> Cities with moderate street connectivity, streets with moderate length and moderate curved streets.</p>",  
  html: true, 
} );

$( "#labyrinth" ).tooltip( {
  title: "<img src='./assets/img/labels/street/labyrinth.png'><p style='color: white !important; font-size: 14px !important;'><b>Labyrinth:</b> Cities with low street connectivity, streets with moderate length and moderate curved streets.</p>",  
  html: true, 
} );

$( "#wool-ball" ).tooltip( {
  title: "<img src='./assets/img/labels/street/wool-ball.png'><p style='color: white !important; font-size: 14px !important;'><b>Wool ball:</b> Cities with higher street connectivity, shorter streets and higher curved streets.</p>",  
  html: true, 
} );

$( "#straight-grid" ).tooltip( {
  title: "<img src='./assets/img/labels/street/straight-grid.png'><p style='color: white !important; font-size: 14px !important;'><b>Straight grid:</b> Cities with moderate street connectivity, larger streets and lower curved streets.</p>",  
  html: true, 
} );

$( "#hyperbolic-labyrinth" ).tooltip( {
  title: "<img src='./assets/img/labels/street/hyperbolic-labyrinth.png'><p style='color: white !important; font-size: 14px !important;'><b>Hyperbolic labyrinth:</b> Cities with lower streets connectivity, larger streets and higher curved streets.</p>",  
  html: true, 
} );

$( "#spiderweb" ).tooltip( {
  title: "<img src='./assets/img/labels/street/spiderweb.png'><p style='color: white !important; font-size: 14px !important;'><b>Spiderweb:</b> Cities with higher street connectivity, shorter streets and moderate curved streets.</p>",  
  html: true, 
} );