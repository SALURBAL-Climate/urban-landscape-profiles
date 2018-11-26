/* global d3, crossfilter, tip */

var width = 500,
  height = 700;

var svg;

var csData, 
  countriesGeoJSON;

var countriesFigure,
  unitsPoints,
  countriesProjection,
  countriesPath,
  countriesList;

function initializeMap() {

  countriesProjection = d3.geoMercator()
    .scale( 950 / Math.PI )
    .translate( [ 650 , 250 ] );

  countriesPath = d3.geoPath()
    .projection( countriesProjection );

}

function noClustersMap( element ) {

  svg = d3.select( element ).select( "svg" );

  // Drawing geoJSON
  
  if( countriesFigure == null ) {

    countriesFigure = svg.selectAll( "path.countriesFigure" )
      .data( countriesGeoJSON.features )
      .enter()
      .append( "path" )
        .attr( "class", "countriesFigure" )
        .attr( "d", countriesPath )
        .style( "fill-opacity", 0 );

    countriesFigure
      .transition()
        .duration( 1000 )
        .style( "fill-opacity", 1 );

  } else {

    countriesProjection = d3.geoMercator()
      .scale( 950 / Math.PI )
      .translate( [ 650 , 250 ] );

    countriesPath.projection( countriesProjection );

    countriesFigure
      .transition()
        .duration( 1000 )   
          .attr( "d", countriesPath );

  }
  
  // Drawing countries list
  
  if( countriesList == null ) { 

    countriesList = svg.selectAll( "text.countriesList" )
      .data( csData.sumByCountry.all() )
      .enter().append( "text" )
        .attr( "class", "countriesList" )
        .attr( "x", 490 )
        .attr( "y", ( d, i ) => ( 15 + i * 20 ) )
        .attr( "fill", "steelblue" )
        .attr( "text-anchor", "end" )
        .text( d => d.key + " " + d.value )
        .style( "font-size", "0.4em" )
        .style( "fill-opacity", 0 );

    countriesList
      .transition()
        .duration( 1000 )
        .style( "fill-opacity", 1 );


  } else {

    countriesList
      .transition()
        .duration( 1000 )
        .attr( "x", 490 )
        .attr( "y", ( d, i ) => ( 15 + i * 20  ) )
        .style( "font-size", "0.4em" )
        .attr( "text-anchor", "end" );

  }

  // Drawing unitsPoints

  if( unitsPoints == null ) {

    unitsPoints = svg.selectAll( "circle.unitsPoints" )
      .data( csData.all() )
      .enter().append( "circle" )
        .attr( "class", "unitsPoints" )
        .attr( "cx", d => countriesProjection( d.point )[ 0 ] )
        .attr( "cy", d => countriesProjection( d.point )[ 1 ] )
        .attr( "fill", "steelblue" )
        .attr( "r", 2 )
        .style( "fill-opacity", 0 );

     unitsPoints   
      .append( "title" )
          .text( d => d[ "Country" ] + " - " + d[ "L1Name" ] );

    unitsPoints
      .transition()
        .duration( 1000 )
        .style( "fill-opacity", 1 );

  } else {

     unitsPoints
      .transition()
        .duration( 1000 )
        .attr( "cx", d => countriesProjection( d.point )[ 0 ] )
        .attr( "cy", d => countriesProjection( d.point )[ 1 ] );

  }

}

function noClustersDistribution( element ) {

  countriesProjection = d3.geoMercator()
    .scale( 170 / Math.PI )
    .translate( [ 120 , 40 ] );

  countriesPath.projection( countriesProjection );

  countriesFigure
    .transition()
      .duration( 1000 )   
        .attr('d', countriesPath );

  countriesList
    .transition()
      .duration( 1000 )
      .attr( "x", 100 )
      .attr( "y", ( d, i ) => ( 15 + i * 10  ) )
      .style( "font-size", "0.20em" )
      .attr( "text-anchor", "start" );



  var xScale = d3.scaleLinear()
    .domain( [ d3.min( csData.all(), d => d[ "area" ] ), d3.max( csData.all(), d => d[ "area" ] ) ] )
    .range( [ 100, 400 ] );

  var yScale = d3.scaleLinear()
    .domain( [ d3.min( csData.all(), d => d[ "intersection_density" ] ), d3.max( csData.all(), d => d[ "intersection_density" ] ) ] )
    .range( [ 450, 150 ] );

  var svg = d3.select( element ).select( "svg" );

  // X-axis
  var xAxis = d3.axisBottom().scale(xScale).ticks(5);

  // Y-axis
  var yAxis = d3.axisLeft().scale(yScale).ticks(5);

  //x axis
  svg.append("g")
    .attr("class", "x axis")  
    .attr("transform", "translate(0," + 450 + ")")
    .call(xAxis);
  
  //y axis
  svg.append("g")
    .attr("class", "y axis")  
    .attr("transform", "translate(" + 100 + ", 0)")
    .call(yAxis);

  unitsPoints
    .transition()
      .duration( 1000 )
      .attr( "cx", d => xScale( d[ "area" ] ) )
      .attr( "cy", d => yScale( d[ "intersection_density" ] ) );
  
}

function doStep( step ) {

  if( step === "map-no-clusters" ) noClustersMap( this );
  else if( step === "distribution-no-clusters" ) noClustersDistribution( this );

}

d3.csv( "./data/base_l1ux_clean.csv", d => {
  
  d[ "number_of_urban_patches" ] = +d[ "number_of_urban_patches" ];
  d[ "patch_density" ] = +d[ "patch_density" ];
  d[ "area_weigthed_mean_shape_index" ] = +d[ "area_weigthed_mean_shape_index" ];
  d[ "area_weigthed_mean_nearest_neighbor" ] = +d[ "area_weigthed_mean_nearest_neighbor" ];
  d[ "effective_mesh_size" ] = +d[ "effective_mesh_size" ];
  d[ "area_weighted_mean_patch_size" ] = +d[ "area_weighted_mean_patch_size" ];
  d[ "Circuity_average" ] = +d[ "Circuity_average" ];
  d[ "intersection_density" ] = +d[ "intersection_density" ];
  d[ "street_density" ] = +d[ "street_density" ];
  d[ "street_length_average" ] = +d[ "street_length_average" ];
  d[ "streets_per_node_average" ] = +d[ "streets_per_node_average" ];
  d[ "area" ] = +d[ "area" ];
  d[ "population_density" ] = +d[ "population_density" ];

  d[ "point" ] = [ +d[ "CentLongitude" ], +d[ "CentLatitude" ] ];

  //d[ "TSNE_TR_X" ] = +d[ "TSNE_TR_X" ];
  //d[ "TSNE_TR_Y" ] = +d[ "TSNE_TR_Y" ];

  return d;

} ).then( data => {

  console.log( data );

  csData = crossfilter( data );

  csData.countries = csData.dimension( d => d[ "Country" ] );
  csData.l1names = csData.dimension( d => d[ "L1Name" ] );
  csData.l2names = csData.dimension( d => d[ "L2Namev2" ] );
  csData.profiles = csData.dimension( d => d[ "TR_PROFILE" ] );

  csData.sumByCountry = csData.countries.group();
  csData.sumByL1Name =  csData.l1names.group();
  csData.sumByL2Name =  csData.l2names.group();
  csData.sumByProfile = csData.profiles.group();

} );

d3.json( "./data/custom.geo.json" ).then( data => {
  countriesGeoJSON = data;
} );

initializeMap();