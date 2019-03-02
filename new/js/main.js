
var data,
  countriesGeoJSON;

var models = [ 'Street Design', 'Urban Landscape' ], model,
  countries, country,
  cities, city;

var featuresHierarchy = {
  "Street Design" : [ {
      "key" : "BECADCRCTYAVG",
      "name" : "BECADCRCTYAVG",
      "subdomain" : "subdomain1",
      "description" : ""
    }, {
      "key" : "BECADINTDENS",
      "name" : "BECADINTDENS",
      "subdomain" : "subdomain1",
      "description" : ""
    }, {
      "key" : "BECADSTTDENS",
      "name" : "BECADSTTDENS",
      "subdomain" : "subdomain1",
      "description" : ""
    }, {
      "key" : "BECADSTTLGAVG",
      "name" : "BECADSTTLGAVG",
      "subdomain" : "subdomain1",
      "description" : ""
    }, {
      "key" : "BECADSTTPNODEAVG",
      "name" : "BECADSTTPNODEAVG",
      "subdomain" : "subdomain1",
      "description" : ""
    } ],
  "Urban Landscape" : [ {
      "key" : "BECNURBPTCH",
      "name" : "BECNURBPTCH",
      "subdomain" : "subdomain1",
      "description" : ""
    }, {
      "key" : "BECPTCHDENS",
      "name" : "BECPTCHDENS",
      "subdomain" : "subdomain1",
      "description" : ""
    }, {
      "key" : "BECEFFMESHSIZE",
      "name" : "BECEFFMESHSIZE",
      "subdomain" : "subdomain1",
      "description" : ""
    }, {
      "key" : "BECAWAVGPTCHAREA",
      "name" : "BECAWAVGPTCHAREA",
      "subdomain" : "subdomain1",
      "description" : ""
    }, {
      "key" : "BECAWMNSHPINDX",
      "name" : "BECAWMNSHPINDX",
      "subdomain" : "subdomain1",
      "description" : ""
    }, {
      "key" : "BECAWMNNNGH",
      "name" : "BECAWMNNNGH",
      "subdomain" : "subdomain1",
      "description" : ""
    } ]
};

function drawModelCombo() {

  model = models[ 0 ];

  d3.select( "#modelSelect" ).selectAll( 'option' )
    .data( models )
    .enter()
    .append( 'option' )
      .attr( 'value', d => d )
      .html( d => d );

  d3.select( "#modelSelect" )
    .on( 'change', _ => {
      model = d3.select( "#modelSelect" ).property( 'value' );
      drawTable();
    } );

}

function drawCountryCombo() {
    
  //country = countries[ 0 ].key;

  d3.select( "#countrySelect" ).selectAll( 'option' )
    .data( [ { 'key' : undefined } ].concat( countries ) )
    .enter()
    .append( 'option' )
      .attr( 'value', d => d.key )
      .html( d => d.key );

  d3.select( "#countrySelect" )
    .on( 'change', _ => {
      
      country = d3.select( "#countrySelect" ).property( 'value' );
      if( country === '' ) country = undefined;
      
      drawCityCombo();
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

function drawTable() {

  d3.select( 'table' ).select( 'tbody' ).html( '' );

  d3.select( 'table' ).select( 'tbody' ).selectAll( 'tr' )
    .data( featuresHierarchy[ model ] )
    .enter()
    .append( 'tr' )
      .html( d => '<td>' + d.subdomain + '</td><td>' + d.name + '&nbsp;<i class="far fa-question-circle" data-toggle="tooltip" data-placement="right" title="Tooltip on right Tooltip on right Tooltip on right Tooltip on right Tooltip on right Tooltip on right Tooltip on right Tooltip on right Tooltip on right Tooltip on right Tooltip on right Tooltip on right"></i></td><td id="sparkline-' + d.key + '"></td>' );

  drawSparkLines();

}

function drawSparkLines() {

  featuresHierarchy[ model ].forEach( f => {

    var feature = f.key;

    var width = +d3.select( 'table' ).node().getBoundingClientRect().width / 2,
      height = 100,// +d3.select( '#sparkline-' + feature ).node().getBoundingClientRect().height,
      margin = { top: 10, right: 10, bottom: 18, left: 10 };

    var svg = d3.select( '#sparkline-' + feature ).append( 'svg' )
      .attr( 'width', width )
      .attr( 'height', height );

    var columnArray = [];
    data.map( d => columnArray.push( d[ feature ] ) );

    var x = d3.scaleLinear()
      .domain( [ d3.min( data, d => d[ feature ] ), d3.max( data, d => d[ feature ] ) ] )
      .range( [ margin.left, width - margin.right ] );

    var n = columnArray.length,
    bins = d3.histogram().domain( x.domain() ).thresholds( columnArray.length / 50 )( columnArray );
    density = kernelDensityEstimator( kernelEpanechnikov( 0.0050 ), x.ticks( columnArray.length / 50 ) )( columnArray );

    var y = d3.scaleLinear()
      .domain( [ 0, d3.max( bins, d => d.length / n ) ] )
      .range( [ height - margin.bottom, margin.top ] );

    var yKDE = d3.scaleLinear()
      .domain( [ 0, 12 ] )
      .range( [ height - margin.bottom, margin.top ] );

    svg.append( 'g' )
      .attr( 'class', 'axis axis--x' )
      .attr( 'transform', 'translate(0,' + ( height - margin.bottom ) + ')' )
      .call( d3.axisBottom( x ) );

    /*svg.append( 'g' )
      .attr( 'class', 'axis axis--y' )
      .attr( 'transform', 'translate(' + margin.left + ',0)' )
      .call( d3.axisLeft( y ).ticks( null, '%' ) );*/

    svg.insert( "g", "*" )
      .attr( "fill", "#bbb" )
      .selectAll( "rect" )
      .data( bins )
      .enter().append( "rect" )
        .attr( "x", d => x( d.x0 ) + 1 )
        .attr( "y", d => y( d.length / n ) )
        .attr( "width", d => x( d.x1 ) - x( d.x0 ) - 1 )
        .attr( "height", d => y( 0 ) - y( d.length / n ) );

    svg.append( "path" )
      .datum( density )
      .attr( "fill", "none" )
      .attr( "stroke", "#000" )
      .attr( "stroke-width", 1.5 )
      .attr( "stroke-linejoin", "round" )
      .attr( "d",  d3.line().curve(d3.curveBasis ).x( d => x( d[ 0 ] ) ).y( d => yKDE( d[ 1 ] ) ) );

  } );

}

function kernelDensityEstimator( kernel, X ) {
  return function( V ) {
    return X.map( function( x ) {
      return [ x, d3.mean( V, function( v ) { return kernel( x - v ); } ) ];
    });
  };
}

function kernelEpanechnikov( k ) {
  return v => Math.abs( v /= k ) <= 1 ? 0.75 * ( 1 - v * v ) / k : 0;
}

d3.csv( "./data/l2.csv", d => {
  
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

  d[ "point" ] = [ +d[ "LONG" ], +d[ "LAT" ] ];

  return d;

} ).then( data => {

  this.data = data;

  countries = d3.nest().key( d => d.COUNTRY ).rollup( v => v.length ).entries( data );
  cities = d3.nest().key( d => d.COUNTRY ).key( d => d.L1 ).rollup( v => v.length ).entries( data );

  drawModelCombo();
  drawCountryCombo();
  drawCityCombo();
  drawTable();


} );

d3.json( "./data/custom.geo.json" ).then( data => {
  countriesGeoJSON = data;
  //initializeMap();
} );