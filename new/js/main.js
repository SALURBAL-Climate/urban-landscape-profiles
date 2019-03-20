
var l1admin_data,
  l2_data;

var map, subcitiesLayer, markers = [],
  icons;

var levels = [ 'L1 Admin', 'L2' ], level,
  models = [ 'Street Design', 'Urban Landscape' ], model,
  countries, country,
  cities, city,
  transProfiles, urbanProfiles;

var featuresHierarchy = {
  "Street Design" : [
    {
      "key" : "BECADSTTDENS",
      "name" : "Street density",
      "subdomain" : "Street density",
      "description" : "Measures the length of streets per km2 of area."
    }, {
      "key" : "BECADINTDENS",
      "name" : "Intersection density",
      "subdomain" : "Intersection density",
      "description" : "Measures the amount of intersections per km2 of area."
    }, {
      "key" : "BECADSTTPNODEAVG",
      "name" : "Streets per node average",
      "subdomain" : "Intersection density",
      "description" : "Measures the distribution of the number of streets that meet at each intersection of the street network."
    }, {
      "key" : "BECADSTTLGAVG",
      "name" : "Street length average",
      "subdomain" : "Street network length and structure",
      "description" : "Measures the length of streets in the street network."
    }, {
      "key" : "BECADCRCTYAVG",
      "name" : "Circuity average",
      "subdomain" : "Street network length and structure",
      "description" : "Measures the average ratio of network distances to straight-line distances."
    }
  ],
  "Urban Landscape" : [ 
    {
      "key" : "BECAWMNSHPINDX",
      "name" : "Area-weighted mean shape index",
      "subdomain" : "Shape",
      "description" : "Shape index is a ratio of the actual perimeter of a patch to the minimum perimeter possible for a maximally compact patch with the same size. The area-weighted mean shape index is the weighted average of the shape index for each patch within the geographic boundary. This index is weighted by the area of each patch."
    },
    {
      "key" : "BECNURBPTCH",
      "name" : "Number of urban patches",
      "subdomain" : "Fragmentation",
      "description" : "Number of contiguous areas of urban development (urban patches hereafter)."
    }, {
      "key" : "BECPTCHDENS",
      "name" : "Patch density",
      "subdomain" : "Fragmentation",
      "description" : "Number of urban patches divided by the total area of the geographic unit (in 100 hectares)."
    }, {
      "key" : "BECAWAVGPTCHAREA",
      "name" : "Area-weighted mean patch size",
      "subdomain" : "Fragmentation",
      "description" : "Weighted average of urban patch size (in hectares). This value is weighted by the area of each patch."
    }, {
      "key" : "BECEFFMESHSIZE",
      "name" : "Effective Mesh Size",
      "subdomain" : "Fragmentation",
      "description" : "The sum of squares of urban patch size, divided by the total area of the geographic unit."
    }, {
      "key" : "BECAWMNNNGH",
      "name" : "Area-weighted Mean Nearest Neighbor Distance",
      "subdomain" : "Isolation",
      "description" : "Mean distance (in meters) to the nearest urban patch within the geographic boundary. This value is weighted by the area of each patch."
    } 
  ]
};

function initMap() {

  map = L.map( 'map' ).setView( [ -16.47, -74.36], 2 );

  icons = {
    1: new L.Icon( {
      iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
      iconSize: [ 10, 15 ],
      popupAnchor: [ 1, -34 ]
    } ),
    2: new L.Icon( {
      iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
      iconSize: [ 10, 15 ],
      popupAnchor: [ 1, -34 ]
    } ),
    3: new L.Icon( {
      iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
      iconSize: [ 10, 15 ],
      popupAnchor: [ 1, -34 ]
    } ),
    4: new L.Icon( {
      iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png',
      iconSize: [ 10, 15 ],
      popupAnchor: [ 1, -34 ]
    } ),
    5: new L.Icon( {
      iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-yellow.png',
      iconSize: [ 10, 15 ],
      popupAnchor: [ 1, -34 ]
    } )
  };

  L.tileLayer( 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo( map );

  subcitiesLayer = new L.MarkerClusterGroup( {
    iconCreateFunction: ( cluster ) => L.divIcon( { html: '<b><font size="5">' + ( +cluster.getChildCount() + 1 )  + '</font></b>', iconSize: new L.Point( 40, 40 ) } )
  } );
  subcitiesLayer.addTo( map );

  drawMap();

}

function drawMap() {

  // Remove all layers in map
  subcitiesLayer.clearLayers();

  var dataTemp;
  if( country !== undefined ) {
    if( level === 'L1 Admin' ) dataTemp = l1admin_data.filter( d => d[ 'COUNTRY' ] == country );
    else dataTemp = l2_data.filter( d => d[ 'COUNTRY' ] == country );
  } else {
    if( level === 'L1 Admin' ) dataTemp = l1admin_data;
    else dataTemp = l2_data;
  }

  // Draw the markers
  arrayOfLatLngs = [];
  dataTemp.forEach( d => {
    //var colorAttr = ( model === 'Street Design' ) ? 'TRANS_PROF' : 'URBAN_PROF';
    var marker = L.marker( [ d[ 'LAT' ], d[ 'LONG' ] ], { icon: icons[ /*d[ colorAttr ]*/1 ] } ).addTo( subcitiesLayer )
      .bindPopup( '<b>Country: </b>' + d[ 'COUNTRY' ] + '<br /><b>City: </b>' + d[ 'L1' ] + ( ( d[ 'L2' ] !== undefined ) ? '<br /><b>Sub-city: </b>' + d[ 'L2' ] : '' ) );
      //.bindPopup( '<b>Country: </b>' + d[ 'COUNTRY' ] + '<br /><b>City: </b>' + d[ 'L1' ] + '<br /><b>Sub-city: </b>' + d[ 'L2' ] + '<br /><b>Profile: </b>' + d[ 1  ] );
    markers.push( marker );
    arrayOfLatLngs.push( [ d[ 'LAT' ], d[ 'LONG' ] ] );
  } );

  var bounds = new L.LatLngBounds( arrayOfLatLngs );
  map.fitBounds( bounds );

}

function drawUnitsTable() {

  d3.select( '#unitsTable' ).select( 'tbody' ).html( '' );

  d3.select( '#unitsTable' ).select( 'tbody' ).selectAll( 'tr' )
    .data( l1admin_cities )
    .enter()
    .append( 'tr' )
      .html( d => '<td>' + d.key + '</td><td class="text-center">' + d.values.length + '</td><td class="text-center">' + l2_subcities.find( k => k.key === d.key ).values.length + '</td>' );

  d3.select( '#unitsTable' ).select( 'tbody' )
    .append( 'tr' )  
      .html( d => '<td class="text-center"><b>TOTAL</b></td><td class="text-center"><b>' + l1admin_cities.reduce( ( a, b ) => a + ( b.values.length || 0 ), 0 ) + '</b></td><td class="text-center"><b>' + l2_subcities.reduce( ( a, b ) => a + ( b.values.length || 0 ), 0 ) + '</b></td>' );

}

function drawFeaturesTable() {

  d3.select( '#featureTable' ).select( 'tbody' ).html( '' );

  d3.select( '#featureTable' ).select( 'tbody' ).selectAll( 'tr' )
    .data( featuresHierarchy[ model ] )
    .enter()
    .append( 'tr' )
      .html( d => '<td>' + d.subdomain + '</td><td>' + d.name + '&nbsp;<i class="far fa-question-circle" data-toggle="tooltip" data-placement="right" title="' + d.description +'"></i></td><td id="sparkline-' + d.key + '"></td>' );

  drawSparkLines();

}

function drawSparkLines() {

  var dataTemp;
  if( level === 'L1 Admin' ) dataTemp = l1admin_data;
  else dataTemp = l2_data;

  if( country !== undefined ) dataTemp = dataTemp.filter( d => d.COUNTRY === country );

  //if( country !== undefined ) dataTemp = dataTemp.filter( d => d.COUNTRY === country );

  featuresHierarchy[ model ].forEach( f => {

    var feature = f.key;

    var width = +d3.select( 'table' ).node().getBoundingClientRect().width / 2,
      height = 100,// +d3.select( '#sparkline-' + feature ).node().getBoundingClientRect().height,
      margin = { top: 10, right: 10, bottom: 18, left: 30 };

    var svg = d3.select( '#sparkline-' + feature ).append( 'svg' )
      .attr( 'width', width )
      .attr( 'height', height );

    var columnArray = [];
    dataTemp.map( d => columnArray.push( d[ feature ] ) );

    var x = d3.scaleLinear()
      .domain( [ d3.min( dataTemp, d => d[ feature ] ), d3.max( dataTemp, d => d[ feature ] ) ] )
      .range( [ margin.left, width - margin.right ] );

    var n = columnArray.length,
    bins = d3.histogram().domain( x.domain() ).thresholds( columnArray.length / 50 )( columnArray );

    var y = d3.scaleLinear()
      .domain( [ 0, d3.max( bins, d => d.length / n ) ] )
      .range( [ height - margin.bottom, margin.top ] );

    svg.append( 'g' )
      .attr( 'class', 'axis axis--x' )
      .attr( 'transform', 'translate(0,' + ( height - margin.bottom ) + ')' )
      .call( d3.axisBottom( x ).ticks( 5 ) );

    svg.append( 'g' )
      .attr( 'class', 'axis axis--y' )
      .attr( 'transform', 'translate(' + margin.left + ',0)' )
      .call( d3.axisLeft( y ).ticks( 3, '%' ) );

    svg.insert( "g", "*" )
      .attr( "fill", "steelblue" )
      .selectAll( "rect" )
      .data( bins )
      .enter().append( "rect" )
        .attr( "x", d => x( d.x0 ) + 1 )
        .attr( "y", d => y( d.length / n ) )
        .attr( "width", d => x( d.x1 ) - x( d.x0 ) - 1 )
        .attr( "height", d => y( 0 ) - y( d.length / n ) );

  } );

}

function drawLevelCombo() {

  d3.selectAll( "#levelSelect" ).selectAll( 'option' )
    .data( levels )
    .enter()
    .append( 'option' )
      .attr( 'value', d => d )
      .html( d => d );

  d3.selectAll( "#levelSelect" )
    .on( 'change', function() {
      level = this.value;
      d3.selectAll( "#levelSelect" ).selectAll( 'option' ).property( 'selected', d => ( d === level ) ? true : false );
      drawMap();
      drawFeaturesTable();
      drawBarchart();
    } );

}

function drawModelCombo() {

  d3.select( "#modelSelect" ).selectAll( 'option' )
    .data( models )
    .enter()
    .append( 'option' )
      .attr( 'value', d => d )
      .html( d => d );

  d3.select( "#modelSelect" )
    .on( 'change', _ => {
      model = d3.select( "#modelSelect" ).property( 'value' );
      drawFeaturesTable();
      drawBarchart();
    } );

}

function drawCountryCombo() {

  d3.select( "#countrySelect" ).selectAll( 'option' )
    .data( [ { 'key' : undefined } ].concat( l1admin_countries ) )
    .enter()
    .append( 'option' )
      .attr( 'value', d => d.key )
      .html( d => d.key );

  d3.select( "#countrySelect" )
    .on( 'change', _ => {
      
      country = d3.select( "#countrySelect" ).property( 'value' );
      if( country === '' ) country = undefined;
      d3.select( "#citySelect" ).property( 'disabled', true );
      
      drawMap();
      drawSparkLines();
      drawBarchart();
      //drawCityCombo();
      
    } );

}

function drawCityCombo() {

  d3.select( "#citySelect" )
    .property( 'disabled', false )
    .html( '' );

  if( country === undefined ) {

    d3.select( "#citySelect" ).property( 'disabled', true );
    city = undefined;

  } else {

    city = cities.find( d => d.key === country ).values[ 0 ].key;

    d3.select( "#citySelect" ).selectAll( 'option' )
      .data( cities.find( d => d.key === country ).values )
      .enter()
      .append( 'option' )
        .attr( 'value', d => d.key )
        .html( d => d.key );

    d3.select( "#citySelect" )
      .on( 'change', _ => {
        city = d3.select( "#citySelect" ).property( 'value' );
      } );

  }
  
}

function drawBarchart() {

  var profiles;
  if( model === 'Street Design' ){
    if( level === 'L1 Admin' ) profiles = l1admin_transProfiles;
    else profiles = l2_transProfiles;     
  } else {
    if( level === 'L1 Admin' ) profiles = l1admin_urbanProfiles;
    else profiles = l2_urbanProfiles;
  }

  if( model === 'Street Design' ){
    if( level === 'L1 Admin' ) {
      profiles.forEach( p => {
        if( p.key === "1" ) p[ 'name' ] = 'L Walk/M Direct';
        else if( p.key === "2" ) p[ 'name' ] = 'M Walk/L Direct';
        else if( p.key === "3" ) p[ 'name' ] = 'H Walk/L Direct';
        else if( p.key === "4" ) p[ 'name' ] = 'L Walk/H Direct';
      } );
    } else {
      profiles.forEach( p => {
        if( p.key === "1" ) p[ 'name' ] = 'M Walk/L Direct';
        else if( p.key === "2" ) p[ 'name' ] = 'L Walk/H Direct';
        else if( p.key === "3" ) p[ 'name' ] = 'H Walk/L Direct';
        else if( p.key === "4" ) p[ 'name' ] = 'L Walk/M Direct';
      } );
    }     
  } else {
    if( level === 'L1 Admin' ) {
      profiles.forEach( p => {
        if( p.key === "1" ) p[ 'name' ] = 'M Frag/Complex/L Iso';
        else if( p.key === "2" ) p[ 'name' ] = 'H Frag/Irregular/L Iso';
        else if( p.key === "3" ) p[ 'name' ] = 'M Frag/Compact/H Iso';
        else if( p.key === "4" ) p[ 'name' ] = 'L Frag/Irregular/M Iso';
      } );
    } else {
      profiles.forEach( p => {
        if( p.key === "1" ) p[ 'name' ] = 'H Frag/Complex/M Iso';
        else if( p.key === "2" ) p[ 'name' ] = 'M Frag/Irregular/L Iso';
        else if( p.key === "3" ) p[ 'name' ] = 'L Frag/Complex/L Iso';
        else if( p.key === "4" ) p[ 'name' ] = 'M Frag/Compact/H Iso';
        else if( p.key === "5" ) p[ 'name' ] = 'L Frag/Irregular/L Iso';
        else if( p.key === "6" ) p[ 'name' ] = 'H Frag/Compact/M Iso';
      } );
    }
  }

  console.log( profiles );

  var profiles_chart = {
    "$schema": "https://vega.github.io/schema/vega-lite/v3.json",
    "width": +d3.select( '#right-column' ).node().getBoundingClientRect().width - 180,
    "height": 250,
    "data": {
      "values": profiles
    },
    "mark": "bar",
    "encoding": {
      "y": {
        "field": "name", 
        "type": "nominal",
        "title": "Profile"
      },
      "x": {
        "field": "value", 
        "type": "quantitative",
        "title": ( level === 'L1 Admin' ) ? "Number of cities" : "Number of sub-cities" 
      },
      "color": {
        "field": "name", 
        "type": "nominal",
        "title": "Profile",
        "legend": null
      },
      "tooltip": [ 
        {
          "field": "name", "type": "nominal"
        },
        {
          "field": "value", "type": "quantitative"
        }
      ]
    }
  };

  vegaEmbed( '#profiles', profiles_chart, { "actions" : false } );

}

d3.csv( "./data/l1Admin.csv", d => parseNumbers( d ) ).then( data => {

  l1admin_data = data;

  l1admin_countries = d3.nest().key( d => d.COUNTRY ).rollup( v => v.length ).entries( l1admin_data );
  l1admin_cities = d3.nest().key( d => d.COUNTRY ).key( d => d.L1 ).rollup( v => v.length ).entries( l1admin_data );
  l1admin_transProfiles = d3.nest().key( d => d.TRANS_PROF ).rollup( v => v.length ).entries( l1admin_data );
  l1admin_urbanProfiles = d3.nest().key( d => d.URBAN_PROF ).rollup( v => v.length ).entries( l1admin_data );

  d3.csv( "./data/l2.csv", d => parseNumbers( d ) ).then( data => {

    l2_data = data;

    level = levels[ 0 ];
    model = models[ 0 ];

    l2_countries = d3.nest().key( d => d.COUNTRY ).rollup( v => v.length ).entries( l2_data );
    l2_cities = d3.nest().key( d => d.COUNTRY ).key( d => d.L1 ).rollup( v => v.length ).entries( l2_data );
    //l2_subcities = d3.nest().key( d => d.COUNTRY ).key( d => d.L2 ).rollup( v => v.length ).entries( l2_data );
    l2_subcities = d3.map( l2_data, d => d.COUNTRY ).keys().map( c => { return { 'key': c, 'values': l2_data.filter( d => d.COUNTRY === c ).map( l => { return { 'key': l.L2, 'value': 1 } } ) } } );
    l2_transProfiles = d3.nest().key( d => d.TRANS_PROF ).rollup( v => v.length ).entries( l2_data );
    l2_urbanProfiles = d3.nest().key( d => d.URBAN_PROF ).rollup( v => v.length ).entries( l2_data );

    //drawModelCombo();
    //drawCountryCombo();
    //drawCityCombo();
    //drawTable();
    //drawBarchart( transProfiles );
    
    initMap();
    
    drawUnitsTable();
    drawFeaturesTable();

    drawLevelCombo();
    drawModelCombo();
    drawCountryCombo();

    drawBarchart();

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
  d[ "BECEFFMESHSIZE" ] = +d[ "BECEFFMESHSIZE" ];
  d[ "BECAWAVGPTCHAREA" ] = +d[ "BECAWAVGPTCHAREA" ];
  d[ "BECAWMNSHPINDX" ] = +d[ "BECAWMNSHPINDX" ];
  d[ "BECAWMNNNGH" ] = +d[ "BECAWMNNNGH" ];

  d[ "TRANS_PROB" ] = +d[ "TRANS_PROB" ];
  d[ "URBAN_PROB" ] = +d[ "URBAN_PROB" ];

  d[ "LONG" ] = +d[ "LONG" ];
  d[ "LAT" ] = +d[ "LAT" ];

  return d;

}