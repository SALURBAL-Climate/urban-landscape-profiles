/* global d3, crossfilter, tip */

var level = "L1Name";

var svg,
  width = 500,
  height = 700,
  margin = { top: 20, right: 20, bottom: 20, left: 20 },
  iwidth = width - margin.left - margin.right,
  iheight = height - margin.top - margin.bottom,
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
  countriesBoxplotMedians;

var xScaleBox,
  yScaleBox;

function typoDistribution( element ) {

  countriesBoxplotxAxis.selectAll( "path,line,text" )
    .transition()
      .duration( transition_duration )
      .style( "stroke-opacity", 0 )
      .style( "fill-opacity", 0 );

  countriesBoxplotyAxis.selectAll( "path,line,text" )
    .transition()
      .duration( transition_duration )
      .style( "stroke-opacity", 0 )
      .style( "fill-opacity", 0 );

  countriesBoxplotVertLines
    .transition()
      .duration( transition_duration )
      .style( "stroke-opacity", 0 );

  countriesBoxplotBoxes
    .transition()
      .duration( transition_duration )
      .style( "stroke-opacity", 0 );

  countriesBoxplotMedians
    .transition()
      .duration( transition_duration )
      .style( "stroke-opacity", 0 );

}

function doStep( step ) {

  if( step === "geo-distribution" ) geoDistribution( this );
  else if( step === "feat-distribution" ) featDistribution( this )
  else if( step === "typo-distribution" ) typoDistribution( this );

}

d3.selection.prototype.moveToFront = function() {  
  return this.each( function() {
    this.parentNode.appendChild( this );
  } );
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

  d[ "highlighted" ] = false;

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

  initializeBoxPlot();

} );

d3.json( "./data/custom.geo.json" ).then( data => {
  countriesGeoJSON = data;
  initializeMap();
} );