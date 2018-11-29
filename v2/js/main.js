/* global d3, crossfilter, tip */

var level = "L2Name",
  typology = "stt_perfil";

var friendly_names = {
  "intersection_density" : "Intersection Density (km2)",
  "street_length_average" : "Street Length Average (km)",

  "population_density" : "Population Density (?)",
  "area" : "Area (?)"
};

var svg,
  width = 500,
  height = 700,
  point_radius = 1,
  point_radius_highlighted = 6,
  transition_duration = 1000;

var csData, 
  sumstat,
  countriesGeoJSON;

var countriesFigure,
  unitsPoints,
  countriesProjection,
  countriesPath,
  countriesList,
  countriesNumUnits,
  countriesBoxplotxAxis,
  countriesBoxplotyAxis,
  countriesBoxplotVertLines,
  countriesBoxplotBoxes,
  countriesBoxplotMedians,
  typologiesNumUnits,
  indepFeatScatterxAxis,
  indepFeatScatteryAxis;

var xScaleBox,
  yScaleBox,
  xScaleScatter,
  yScaleScatter,
  cScale = d3.scaleOrdinal( d3.schemeCategory10  )
   .domain( [ "0", "1", "2", "3", "", "4", "5", "6" ] );

var typologySimul;

var using_colors = false;

function indepFeatDistribution( element ) {

  if( indepFeatScatterxAxis == null ) {

    xScaleScatter = d3.scaleLinear()
      .domain( [ d3.min( csData.all(), d => d[ "population_density" ] ), d3.max( csData.all(), d => d[ "population_density" ] ) ] )
      .range( [ 30, width - 30 ] );

    yScaleScatter = d3.scaleLinear()
      .domain( [ d3.min( csData.all(), d => d[ "area" ] ), d3.max( csData.all(), d => d[ "area" ] ) ] )
      .range( [ height - 70 , 150 ] );

    // Show the X axis
    indepFeatScatterxAxis = svg.append( "g" )
      .attr( "transform", "translate(0," + height + ")" );

    indepFeatScatterxAxis
      .transition()
        .duration( transition_duration )
        .attr( "transform", "translate(0," + ( height - 70 ) + ")" );
    
    indepFeatScatterxAxis
      .call( d3.axisBottom( xScaleScatter ).ticks( 5, "s" ) )
      .selectAll( "text" )
        .attr( "y", 10 )
        .attr( "x", 0 )
        //.attr( "transform", "rotate(-90)" )
        .style( "text-anchor", "middle" )
      
    indepFeatScatterxAxis
      .append( "text" )
        //.attr( "transform", "rotate(-90)" )
        .attr( "x", width - 30 )
        .attr( "y", -13 )
        .style( "fill", "black" )
        .attr( "dy", ".7em" )
        .style( "text-anchor", "end" )
        .text( friendly_names[ "area" ] );

    // Show the Y axis    
    indepFeatScatteryAxis = svg.append( "g" )
      .attr( "transform", "translate(0,0)" );

    indepFeatScatteryAxis
      .transition()
        .duration( transition_duration )
        .attr( "transform", "translate(30,0)" );

    indepFeatScatteryAxis
      .call( d3.axisLeft( yScaleScatter ).ticks( 5, "s" ) )
      .append( "text" )
        .attr( "transform", "rotate(-90)" )
        .attr( "x", -150 )
        .attr( "y", 7 )
        .style( "fill", "black" )
        .attr( "dy", ".7em" )
        .style( "text-anchor", "end" )
        .text( friendly_names[ "population_density" ] );

  }

  unitsPoints
    .transition()
      .duration( transition_duration )
      .style( "fill-opacity", 1 )
      .attr( "cx",  d => xScaleScatter( d[ "population_density" ] ) )
      .attr( "cy", d  => yScaleScatter( d[ "area" ] ) );


}

function doStep( step ) {

  if( step === "geo-distribution" ) geoDistribution( this );
  else if( step === "feat-distribution1" ) featDistribution( this, "intersection_density" )
  else if( step === "feat-distribution2" ) featDistribution( this, "street_length_average" )
  else if( step === "typo-distribution" ) typoDistribution( this )
  else if( step === "feat-typo-distribution" ) featTypoDistribution( this )
  else if( step === "indep-feat-distribution" ) indepFeatDistribution( this );

}

d3.selection.prototype.moveToFront = function() {  
  return this.each( function() {
    this.parentNode.appendChild( this );
  } );
}

d3.csv( "./data/base_l2_clean.csv", d => {
  
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
  csData.typologies = csData.dimension( d => d[ typology ] );

  csData.sumByCountry = csData.countries.group();
  csData.sumByL1Name =  csData.l1names.group();
  csData.sumByL2Name =  csData.l2names.group();
  csData.sumByTypology = csData.typologies.group();

} );

d3.json( "./data/custom.geo.json" ).then( data => {
  countriesGeoJSON = data;
  initializeMap();
} );