/* global d3, crossfilter, tip */

var level = "L1Name",
  typology = "stt_perfil";

var friendly_names = {
  "intersection_density" : "Intersection Density (?)",
  "street_length_average" : "Street Length Average (?)"
};

var svg,
  width = 500,
  height = 700,
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
  typologiesNumUnits;

var xScaleBox,
  yScaleBox,
  cScale = d3.scaleOrdinal( d3.schemeCategory10  )
   .domain( [ "0", "1", "2", "3", "", "4", "5", "6" ] );

var typologySimul;

var using_colors = false;

function doStep( step ) {

  if( step === "geo-distribution" ) geoDistribution( this );
  else if( step === "feat-distribution1" ) featDistribution( this, "intersection_density" )
  else if( step === "feat-distribution2" ) featDistribution( this, "street_length_average" )
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