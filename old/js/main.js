/* global d3, crossfilter, tip */

var level = "L2",
  model;

var friendly_names = {
  "BECADCRCTYAVG" : "Circuity",
  "BECADINTDENS" : "Intersection Density",
};

var svg,
  width = 550,
  height = 650,
  point_radius = 1.5,
  transition_duration = 1000;

var csData, 
  //sumstat,
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
  typologiesList,
  typologiesNumUnits,
  indepFeatScatterxAxis,
  indepFeatScatteryAxis;

var zoomMap,
  xScaleBox,
  yScaleBox,
  xScaleScatter,
  yScaleScatter,
  cScale = d3.scaleOrdinal( d3.schemeCategory10  )
   .domain( [ "0", "1", "2", "r", "m", "3", "4", "", "5", "6" ] );

var typologySimul;

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
  else if( step === "feat-distribution1" ) featDistribution( this, "BECADCRCTYAVG" )
  else if( step === "feat-distribution2" ) featDistribution( this, "BECADINTDENS" )
  else if( step === "typo-distribution" ) typoDistribution( this )
  else if( step === "feat-typo-distribution" ) featTypoDistribution( this )
  else if( step === "indep-feat-distribution" ) indepFeatDistribution( this );

}

d3.selection.prototype.moveToFront = function() {  
  return this.each( function() {
    this.parentNode.appendChild( this );
  } );
}

d3.csv( "./data/l2.csv", d => {
  
  /* Transport model */
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

  csData = crossfilter( data );

  csData.countries = csData.dimension( d => d[ "COUNTRY" ] );
  csData.l1s = csData.dimension( d => d[ "L1" ] );
  csData.transProfiles = csData.dimension( d => d[ "TRANS_PROF" ] );
  csData.urbanProfiles = csData.dimension( d => d[ "URBAN_PROF" ] );

  csData.sumByCountry = csData.countries.group();
  csData.sumByL1 =  csData.l1s.group();
  csData.sumByTransProfiles = csData.transProfiles.group();
  csData.sumByUrbanProfiles = csData.urbanProfiles.group();

  initComboUnits( d3.map( data, d => d[ "L2" ] ).keys() );

} );

d3.json( "./data/custom.geo.json" ).then( data => {
  countriesGeoJSON = data;
  initializeMap();
} );