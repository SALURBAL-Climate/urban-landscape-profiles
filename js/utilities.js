function initComboUnits( units ) {

  var locateUnits = d3.select( '#combo-units' );
    
  locateUnits.selectAll( 'option' )
    .data( units.sort( ( a, b ) => d3.ascending( a, b ) ) )
    .enter()
    .append( 'option' )
      .attr( 'value', d => d )
      .html( d => d );

  locateUnits
    .on( 'click', function() {
      var selectedUnit = d3.select( '#combo-units' ).property( 'value' );
      
      unitsPoints
        .filter( ( d ) => d[ "L2" ] === selectedUnit )
        .transition()
        .duration( transition_duration / 10 )
          .attr( "r", point_radius * 15 )
          .attr( "fill", "red" )
          .style( "z-index", 2000 )
        .transition()
        .duration( transition_duration )
          .attr( "r", point_radius );

    } );

}

// Highlight points in all visualizations
function highlight( d ) {

  var element;
  if( d3.map( d ).size() > 2 ) {
    element = "POINT";
  } else {
    element = "COUNTRY";
  }

  // Change the pointer
  d3.select( this ).style( "cursor", "pointer" );

  // Highlight the country list
  countriesList
    .attr( "fill", "gray" )
    .style( "fill-opacity", .4 )
    .filter( k => ( element == "COUNTRY" ) ? k.key === d.key : k.key === d[ "COUNTRY" ] )
      .attr( "fill", "steelblue" )
      .style( "font-weight", "bold" )
      .style( "fill-opacity", 1 );

  // Highlight the number of units list
  countriesNumUnits
    .attr( "fill", "gray" )
    .style( "fill-opacity", .4 )
    .filter( k => ( element == "COUNTRY" ) ? k.key === d.key : k.key === d[ "COUNTRY" ] )
      .attr( "fill", "steelblue" )
      .style( "font-weight", "bold" )
      .style( "fill-opacity", 1 );

  // Highlight the points in the visualization
  unitsPoints
    .attr( "fill", "gray" )
    .style( "fill-opacity", .4 )
    .filter( k => ( element == "COUNTRY" ) ? k[ "COUNTRY" ] === d.key : k[ "L2" ] === d[ "L2" ] )
      .attr( "fill", d => cScale( model !== undefined ? d[ model ] : "0" ) )
      .style( "fill-opacity", 1 );

  // If model visualization is active
  if( model !== undefined ) {

    var typologies = d3.map( csData.all()
        .filter( l => l[ "COUNTRY" ] == d.key ), j => j[ model ] ).keys();
    
    typologiesList
      .attr( "fill", "gray" )
      .style( "fill-opacity", .4 )
      .filter( k => typologies.indexOf( k.key ) >= 0 )
        .attr( "fill", k => cScale( k.key ) )
        .style( "fill-opacity", 1 );

    typologiesNumUnits
      .attr( "fill", "gray" )
      .style( "fill-opacity", .4 )
      .filter( k => typologies.indexOf( k.key ) >= 0 )
        .attr( "fill", k => cScale( k.key ) )
        .style( "fill-opacity", 1 );

  }

}

// Unhighlight points in all visualizations
function unhighlight() {

  d3.select( this ).style( "cursor", "default" );

  countriesList
    .attr( "fill", cScale( "0" ) )
    .style( "fill-opacity", 1 )
    .style( "font-weight", "normal" );

  countriesNumUnits
    .attr( "fill", cScale( "0" ) )
    .style( "fill-opacity", 1 )
    .style( "font-weight", "normal" );

  unitsPoints
    .attr( "fill", d => cScale( model !== undefined ? d[ model ] : "0" ) )
    .style( "fill-opacity", 1 )
    .attr( "r", point_radius );

  // If model visualization is active
  if( model != undefined ) {

    typologiesNumUnits
      .attr( "fill", d => cScale( d.key ) )
      .style( "fill-opacity", 1 )
      .style( "font-weight", "normal" );

    typologiesList
      .attr( "fill", d => cScale( d.key ) )
      .style( "fill-opacity", 1 );

  }

}