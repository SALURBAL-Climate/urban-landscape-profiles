
function initializeMap() {

  var scale0 = 950 / Math.PI;

  countriesProjection = d3.geoMercator()
    .scale( scale0 )
    .translate( [ 650 , 250 ] );

  countriesPath = d3.geoPath()
    .projection( countriesProjection );

  zoomMap = d3.zoom()
    .scaleExtent( [ 1, 18 ] )
    .on( "zoom", zoomed );

}

function zoomed() {

  var transform = d3.event.transform;

  countriesFigure
    .attr('transform', transform );

  unitsPoints
    .attr('transform', transform );

}

function geoDistribution( element ) {

  svg = d3.select( element ).select( "svg" );

  // Drawing geoJSON
  
  if( countriesFigure == null ) {

    svg.call( zoomMap );

    countriesFigure = svg.selectAll( "path.countriesFigure" )
      .data( countriesGeoJSON.features )
      .enter()
      .append( "path" )
        .attr( "class", "countriesFigure" )
        .attr( "d", countriesPath )
        .style( "stroke-opacity", 0 )
        .style( "stroke", "gray" );

    countriesFigure
      .transition()
        .duration( transition_duration )
        .style( "stroke-opacity", 1 );

  } else {

    countriesProjection = d3.geoMercator()
      .scale( 950 / Math.PI )
      .translate( [ 650 , 250 ] );

    countriesPath.projection( countriesProjection );

    countriesFigure
      .transition()
        .duration( transition_duration )   
          .attr( "d", countriesPath );

  }
  
  // Drawing unitsPoints

  if( unitsPoints == null ) {

    unitsPoints = svg.selectAll( "circle.unitsPoints" )
      .data( csData.all() )
      .enter().append( "circle" )
        .attr( "class", "unitsPoints" )
        .attr( "cx", d => countriesProjection( d.point )[ 0 ] )
        .attr( "cy", d => countriesProjection( d.point )[ 1 ] )
        .attr( "r", point_radius )
        .attr( "fill", d => cScale( "0" ) )
        .style( "fill-opacity", 0 )
        .on( "mouseover", highlight )
        .on( "mouseout", unhighlight );

     unitsPoints   
      .append( "title" )
          .text( d => d[ "COUNTRY" ] + " - " + d[ "L1" ] + " - " + d[ "L2" ] );

    unitsPoints
      .transition()
        .duration( transition_duration )
        .style( "fill-opacity", 1 );

  }

  typologySimul = d3.forceSimulation( csData.all() )
    .force( "collide", d3.forceCollide().radius( point_radius ) )
    .force( "x", d3.forceX( d => countriesProjection( d.point )[ 0 ] ) )
    .force( "y", d3.forceY( d => countriesProjection( d.point )[ 1 ] ) )
    .on( "tick", _ => {
        unitsPoints
          .attr( "cx", d => d.x )
          .attr( "cy", d => d.y );
    } );

  // Drawing countries list
  
  if( countriesList == null ) { 

    countriesList = svg.selectAll( "text.countriesList" )
      .data( csData.sumByCountry.all() )
      .enter().append( "text" )
        .attr( "class", "countriesList" )
        .attr( "x", width - 50 )
        .attr( "y", ( d, i ) => ( 20 + i * 20 ) )
        .attr( "fill", "steelblue" )
        .attr( "text-anchor", "end" )
        .text( d => d.key )
        .style( "font-size", "0.4em" )
        .style( "fill-opacity", 0 )
        .on( "mouseover", highlight )
        .on( "mouseout", unhighlight );

    countriesNumUnits = svg.selectAll( "text.countriesNumUnits" )
      .data( csData.sumByCountry.all() )
      .enter().append( "text" )
        .attr( "class", "countriesNumUnits" )
        .attr( "x", width - 40 )
        .attr( "y", ( d, i ) => ( 20 + i * 20 ) )
        .attr( "fill", cScale( "0" ) )
        .attr( "text-anchor", "start" )
        .text( d => d.value )
        .style( "font-size", "0.4em" )
        .style( "fill-opacity", 0 )
        .on( "mouseover", highlight )
        .on( "mouseout", unhighlight );

    countriesList
      .transition()
        .duration( transition_duration )
        .style( "fill-opacity", 1 );

    countriesNumUnits
      .transition()
        .duration( transition_duration )
        .style( "fill-opacity", 1 );


  } else {

    countriesList
      .transition()
        .duration( transition_duration )
        .attr( "x", width - ( ( using_colors ) ? 140 : 50 ) )
        .attr( "y", ( d, i ) => ( 20 + i * 20  ) )
        .style( "font-size", "0.3em" );

    countriesNumUnits
      .transition()
        .duration( transition_duration )
        .attr( "x", width - ( ( using_colors ) ? 130 : 40 ) )
        .attr( "y", ( d, i ) => ( 20 + i * 20  ) )
        .style( "font-size", "0.3em" );

  }

  if( countriesBoxplotxAxis != null ) {

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

}