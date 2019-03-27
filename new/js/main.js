
var l1admin_data,
  l2_data;

var map1, subcitiesLayer1, markers1 = [];

var map2, subcitiesLayer2, markers2 = [], icons2;

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
      "description" : "Measures the length of streets per Km2 of area.",
      "units": "Streets per Km2"
    }, {
      "key" : "BECADINTDENS",
      "name" : "Intersection density",
      "subdomain" : "Intersection density",
      "description" : "Measures the amount of intersections per Km2 of area.",
      "units": "Intersections per Km2"
    }, {
      "key" : "BECADSTTPNODEAVG",
      "name" : "Streets per node average",
      "subdomain" : "Intersection density",
      "description" : "Measures the distribution of the number of streets that meet at each intersection of the street network.",
      "units": "aaa"
    }, {
      "key" : "BECADSTTLGAVG",
      "name" : "Street length average",
      "subdomain" : "Street network length and structure",
      "description" : "Measures the length of streets in the street network.",
      "units": "aaa"
    }, {
      "key" : "BECADCRCTYAVG",
      "name" : "Circuity average",
      "subdomain" : "Street network length and structure",
      "description" : "Measures the average ratio of network distances to straight-line distances.",
      "units": "aaa"
    }
  ],
  "Urban Landscape" : [ 
    {
      "key" : "BECAWMNSHPINDX",
      "name" : "Area-weighted mean shape index",
      "subdomain" : "Shape",
      "description" : "Shape index is a ratio of the actual perimeter of a patch to the minimum perimeter possible for a maximally compact patch with the same size. The area-weighted mean shape index is the weighted average of the shape index for each patch within the geographic boundary. This index is weighted by the area of each patch.",
      "units": "aaa"
    },
    {
      "key" : "BECNURBPTCH",
      "name" : "Number of urban patches",
      "subdomain" : "Fragmentation",
      "description" : "Number of contiguous areas of urban development (urban patches hereafter).",
      "units": "aaa"
    }, {
      "key" : "BECPTCHDENS",
      "name" : "Patch density",
      "subdomain" : "Fragmentation",
      "description" : "Number of urban patches divided by the total area of the geographic unit (in 100 hectares).",
      "units": "aaa"
    }, {
      "key" : "BECAWAVGPTCHAREA",
      "name" : "Area-weighted mean patch size",
      "subdomain" : "Fragmentation",
      "description" : "Weighted average of urban patch size (in hectares). This value is weighted by the area of each patch.",
      "units": "aaa"
    }, {
      "key" : "BECEFFMESHSIZE",
      "name" : "Effective Mesh Size",
      "subdomain" : "Fragmentation",
      "description" : "The sum of squares of urban patch size, divided by the total area of the geographic unit.",
      "units": "aaa"
    }, {
      "key" : "BECAWMNNNGH",
      "name" : "Area-weighted Mean Nearest Neighbor Distance",
      "subdomain" : "Isolation",
      "description" : "Mean distance (in meters) to the nearest urban patch within the geographic boundary. This value is weighted by the area of each patch.",
      "units": "aaa"
    } 
  ]
};

var icons = {
    1: new L.Icon( {
      iconUrl: './imgs/icons/1.png',
      iconSize: [ 10, 15 ],
      popupAnchor: [ 1, -34 ]
    } ),
    2: new L.Icon( {
      iconUrl: './imgs/icons/2.png',
      iconSize: [ 10, 15 ],
      popupAnchor: [ 1, -34 ]
    } ),
    3: new L.Icon( {
      iconUrl: './imgs/icons/3.png',
      iconSize: [ 10, 15 ],
      popupAnchor: [ 1, -34 ]
    } ),
    4: new L.Icon( {
      iconUrl: './imgs/icons/4.png',
      iconSize: [ 10, 15 ],
      popupAnchor: [ 1, -34 ]
    } ),
    5: new L.Icon( {
      iconUrl: './imgs/icons/5.png',
      iconSize: [ 10, 15 ],
      popupAnchor: [ 1, -34 ]
    } ),
    6: new L.Icon( {
      iconUrl: './imgs/icons/6.png',
      iconSize: [ 10, 15 ],
      popupAnchor: [ 1, -34 ]
    } )
  };

function initMap1() {

  map1 = L.map( 'map1' ).setView( [ -16.47, -74.36], 2 );

  L.tileLayer( 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo( map1 );

  //subcitiesLayer1 = new L.layerGroup();
  subcitiesLayer1 = new L.MarkerClusterGroup( {
    iconCreateFunction: ( cluster ) => L.divIcon( { html: '<b><font size="5">' + ( +cluster.getChildCount() + 1 )  + '</font></b>', iconSize: new L.Point( 40, 40 ) } )
  } );
  subcitiesLayer1.addTo( map1 );

  drawMap1();

}

function drawMap1() {

  // Remove all layers in map
  subcitiesLayer1.clearLayers();

  var dataTemp;
  if( level === 'L1 Admin' ) dataTemp = l1admin_data;
  else dataTemp = l2_data;

  // Draw the markers
  dataTemp.map( d => {
    var marker = L.marker( [ d[ 'LAT' ], d[ 'LONG' ] ], { icon: icons[ 1 ] } ).addTo( subcitiesLayer1 )
      .bindPopup( '<b>Country: </b>' + d[ 'COUNTRY' ] + '<br /><b>City: </b>' + d[ 'L1' ] + ( ( d[ 'L2' ] !== undefined ) ? '<br /><b>Sub-city: </b>' + d[ 'L2' ] : '' ) );
    markers1.push( marker );
  } );

  var bounds = new L.LatLngBounds( dataTemp.map( d => [ d.LAT, d.LONG ] ) );
  map1.fitBounds( bounds );

}

function fitBoundsMap1() {

  var dataTemp;
  if( level === 'L1 Admin' ) dataTemp = l1admin_data;
  else dataTemp = l2_data;

  var bounds;
  if( country !== undefined ) bounds = new L.LatLngBounds( dataTemp.filter( d => d[ 'COUNTRY' ] === country ).map( d => [ d.LAT, d.LONG ] ) );
  else bounds = new L.LatLngBounds( dataTemp.map( d => [ d.LAT, d.LONG ] ) );
  map1.fitBounds( bounds );

}

function initMap2() {

  map2 = L.map( 'map2' ).setView( [ -16.47, -74.36], 2 );

  L.tileLayer( 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo( map2 );

  //subcitiesLayer2 = new L.layerGroup();
  subcitiesLayer2 = new L.MarkerClusterGroup( {
    iconCreateFunction: ( cluster ) => L.divIcon( { html: '<b><font size="5">' + ( +cluster.getChildCount() + 1 )  + '</font></b>', iconSize: new L.Point( 40, 40 ) } )
  } );
  subcitiesLayer2.addTo( map2 );

  drawMap2();

}

function drawMap2() {

  // Remove all layers in map
  subcitiesLayer2.clearLayers();

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

    var colorAttr = ( model === 'Street Design' ) ? 'TRANS_PROF' : 'URBAN_PROF';
    var colorAttrName = ( model === 'Street Design' ) ? 'TRANS_PROF_NAME' : 'URBAN_PROF_NAME';

    var marker = L.marker( [ d[ 'LAT' ], d[ 'LONG' ] ], { icon: icons[ d[ colorAttr ] ] } ).addTo( subcitiesLayer2 )
      .bindPopup( '<b>Country: </b>' + d[ 'COUNTRY' ] + '<br /><b>City: </b>' + d[ 'L1' ] + ( ( d[ 'L2' ] !== undefined ) ? '<br /><b>Sub-city: </b>' + d[ 'L2' ] : '' ) + '<br /><b>Profile: </b>' + d[ colorAttrName ] );
    markers2.push( marker );
    arrayOfLatLngs.push( [ d[ 'LAT' ], d[ 'LONG' ] ] );
  } );

  var bounds = new L.LatLngBounds( arrayOfLatLngs );
  map2.fitBounds( bounds );

}

function drawUnitsTable() {

  d3.select( '#unitsTable' ).select( 'tbody' ).html( '' );

  d3.select( '#unitsTable' ).select( 'tbody' ).selectAll( 'tr' )
    .data( l1admin_cities )
    .enter()
    .append( 'tr' )
      .html( d => '<td>' + d.key + '</td><td class="text-center">' + d.values.length + '</td><td class="text-center">' + l2_subcities.find( k => k.key === d.key ).values.length + '</td>' )
      .on( 'click', d => {
        country = d.key;
        fitBoundsMap1();
      } );

  d3.select( '#unitsTable' ).select( 'tbody' )
    .append( 'tr' )  
      .html( d => '<td class="text-center"><b>TOTAL</b></td><td class="text-center"><b>' + l1admin_cities.reduce( ( a, b ) => a + ( b.values.length || 0 ), 0 ) + '</b></td><td class="text-center"><b>' + l2_subcities.reduce( ( a, b ) => a + ( b.values.length || 0 ), 0 ) + '</b></td>' )
      .on( 'click', d => {
        country = undefined;
        fitBoundsMap1();
      } );

}

function drawFeaturesTable() {

  d3.select( '#featureTable' ).select( 'tbody' ).html( '' );

  d3.select( '#featureTable' ).select( 'tbody' ).selectAll( 'tr' )
    .data( featuresHierarchy[ model ] )
    .enter()
    .append( 'tr' )
      .html( d => '<td>' + d.subdomain + '</td><td>' + d.name + '&nbsp;<i class="far fa-question-circle" data-toggle="tooltip" data-placement="right" title="' + d.description +'"></i></td><td id="sparkline-' + d.key + '" style="padding: .25rem;"></td>' );

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

    d3.select( '#sparkline-' + feature ).html( '' );

    var spec = {
      "width": width,
      "height": height,
      "$schema": "https://vega.github.io/schema/vega-lite/v3.json",
      "data": { "values": dataTemp },
      "mark": "bar",
      "encoding": {
        "x": {
          "bin": true,
          "field": feature,
          "type": "quantitative",
          "axis": { "title": f.name + ' (' + f.units + ')' }
        },
        "y": {
          "aggregate": "count",
          "type": "quantitative",
          "axis": { "title": ( level === 'L2' ) ? '# of sub-cities' : '# of cities' }
        },
        "tooltip": {
          "aggregate": "count",
          "type": "quantitative"
        }
      }
    };

    /*var svg = d3.select( '#sparkline-' + feature ).append( 'svg' )
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
        .attr( "height", d => y( 0 ) - y( d.length / n ) );*/

    vegaEmbed( '#sparkline-' + feature, spec, { "actions" : false } );

  } );

}

function drawBarchart() {

  var dataTemp;
  if( country !== undefined ) {
    if( level === 'L1 Admin' ) dataTemp = l1admin_data.filter( d => d[ 'COUNTRY' ] == country );
    else dataTemp = l2_data.filter( d => d[ 'COUNTRY' ] == country );
  } else {
    if( level === 'L1 Admin' ) dataTemp = l1admin_data;
    else dataTemp = l2_data;
  }

  var colorAttr = ( model === 'Street Design' ) ? 'TRANS_PROF' : 'URBAN_PROF';
  var colorAttrName = ( model === 'Street Design' ) ? 'TRANS_PROF_NAME' : 'URBAN_PROF_NAME';

  var profiles_chart = {
    "$schema": "https://vega.github.io/schema/vega-lite/v3.json",
    "width": +d3.select( '#right-column' ).node().getBoundingClientRect().width - 190,
    "height": 250,
    "data": {
      "values": dataTemp
    },
    "mark": "bar",
    "encoding": {
      "y": {
        "field": colorAttrName, 
        "type": "nominal",
        "title": "Profile",
        "sort": { "encoding": "x", "order": "descending" }
      },
      "x": {
        "aggregate": "count",
        "field": colorAttrName,
        "type": "quantitative"
      },
      "color": {
        "field": colorAttr, 
        "type": "nominal",
        "legend": null,
        "scale": {
          "domain": [ "1", "2", "3", "4", "5", "6" ],
          "scheme": "tableau10"
        }
      }
    }
  };

  vegaEmbed( '#profiles', profiles_chart, { "actions" : false } );

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
      drawMap1();
      drawFeaturesTable();
      drawBarchart();
      if( country !== undefined ) drawCityCombo();
      drawMap2();
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
      drawMap2();
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
      
      drawMap1();
      drawSparkLines();
      drawBarchart();
      drawCityCombo();
      drawMap2();
      
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

    var units;
    if( level === 'L1 Admin' ){
      city = l1admin_cities.find( d => d.key === country ).values[ 0 ].key;
      units = l1admin_cities;
    } else {
      city = l2_subcities.find( d => d.key === country ).values[ 0 ].key;
      units = l2_subcities;
    }

    d3.select( "#citySelect" ).selectAll( 'option' )
      .data( units.find( d => d.key === country ).values )
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

d3.csv( "./data/l1Admin.csv", d => parseNumbers( d ) ).then( data => {

  l1admin_data = data;
  l1admin_data = l1admin_data.map( d => {
    d.TRANS_PROF_NAME = transformProfiles( 'L1 Admin', 'Street Design', d.TRANS_PROF );
    d.URBAN_PROF_NAME = transformProfiles( 'L1 Admin', 'Urban Landscape', d.URBAN_PROF );
    return d;
  } );

  l1admin_countries = d3.nest().key( d => d.COUNTRY ).rollup( v => v.length ).entries( l1admin_data );
  l1admin_cities = d3.nest().key( d => d.COUNTRY ).key( d => d.L1 ).rollup( v => v.length ).entries( l1admin_data );
  

  d3.csv( "./data/l2.csv", d => parseNumbers( d ) ).then( data => {

    l2_data = data;
    l2_data = l2_data.map( d => {
    d.TRANS_PROF_NAME = transformProfiles( 'L2', 'Street Design', d.TRANS_PROF );
    d.URBAN_PROF_NAME = transformProfiles( 'L2', 'Urban Landscape', d.URBAN_PROF );
    return d;
  } );

    level = levels[ 0 ];
    model = models[ 0 ];

    //l2_countries = d3.nest().key( d => d.COUNTRY ).rollup( v => v.length ).entries( l2_data );
    //l2_cities = d3.nest().key( d => d.COUNTRY ).key( d => d.L1 ).rollup( v => v.length ).entries( l2_data );
    //l2_subcities = d3.nest().key( d => d.COUNTRY ).key( d => d.L2 ).rollup( v => v.length ).entries( l2_data );
    l2_subcities = d3.map( l2_data, d => d.COUNTRY ).keys().map( c => { return { 'key': c, 'values': l2_data.filter( d => d.COUNTRY === c ).map( l => { return { 'key': l.L2, 'value': 1 } } ) } } );
    
    // Slide 2
    drawLevelCombo();
    drawUnitsTable();
    initMap1();
    
    // Slide 3
    drawModelCombo();
    drawCountryCombo();
    drawFeaturesTable();
    drawBarchart();
    initMap2();

    // Slide 4

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

function transformProfiles( level, model, profile ) {

  var name;
  if( model === 'Street Design' ){
    if( level === 'L1 Admin' ) {
      if( profile === "1" ) name = 'L Walk/M Direct';
      else if( profile === "2" ) name = 'M Walk/L Direct';
      else if( profile === "3" ) name = 'H Walk/L Direct';
      else if( profile === "4" ) name = 'L Walk/H Direct';
    } else {
      if( profile === "1" ) name = 'M Walk/L Direct';
      else if( profile === "2" ) name = 'L Walk/H Direct';
      else if( profile === "3" ) name = 'H Walk/L Direct';
      else if( profile === "4" ) name = 'L Walk/M Direct';
    }     
  } else {
    if( level === 'L1 Admin' ) {
      if( profile === "1" ) name = 'M Frag/Complex/L Iso';
      else if( profile === "2" ) name = 'H Frag/Irregular/L Iso';
      else if( profile === "3" ) name = 'M Frag/Compact/H Iso';
      else if( profile === "4" ) name = 'L Frag/Irregular/M Iso';
    } else {
        if( profile === "1" ) name = 'H Frag/Complex/M Iso';
        else if( profile === "2" ) name = 'M Frag/Irregular/L Iso';
        else if( profile === "3" ) name = 'L Frag/Complex/L Iso';
        else if( profile === "4" ) name = 'M Frag/Compact/H Iso';
        else if( profile === "5" ) name = 'L Frag/Irregular/L Iso';
        else if( profile === "6" ) name = 'H Frag/Compact/M Iso';
    }
  }

  return name;

}