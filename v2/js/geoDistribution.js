function initializeMap() {

  countriesProjection = d3.geoMercator()
    .scale( 950 / Math.PI )
    .translate( [ 650 , 250 ] );

  countriesPath = d3.geoPath()
    .projection( countriesProjection );

}

function geoDistribution( element ) {

  svg = d3.select( element ).select( "svg" );

  // Drawing geoJSON
  
  if( countriesFigure == null ) {

    countriesFigure = svg.selectAll( "path.countriesFigure" )
      .data( countriesGeoJSON.features )
      .enter()
      .append( "path" )
        .attr( "class", "countriesFigure" )
        .attr( "d", countriesPath )
        .style( "stroke-opacity", 0 );

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
  
  // Drawing countries list
  
  if( countriesList == null ) { 

    countriesList = svg.selectAll( "text.countriesList" )
      .data( csData.sumByCountry.all() )
      .enter().append( "text" )
        .attr( "class", "countriesList" )
        .attr( "x", 450 )
        .attr( "y", ( d, i ) => ( 15 + i * 20 ) )
        .attr( "fill", "steelblue" )
        .attr( "text-anchor", "end" )
        .text( d => d.key )
        .style( "font-size", "0.4em" )
        .style( "fill-opacity", 0 )
        .on( "mouseover", function( d ) {

          countriesList
            .attr( "fill", "gray" )
            .style( "fill-opacity", .4 )
            .filter( k => k.key === d.key )
              .attr( "fill", "steelblue" )
              .style( "font-weight", "bold" )
              .style( "fill-opacity", 1 );

          countriesNumUnits
            .attr( "fill", "gray" )
            .style( "fill-opacity", .4 )
            .filter( k => k.key === d.key )
              .attr( "fill", "steelblue" )
              .style( "font-weight", "bold" )
              .style( "fill-opacity", 1 );

          unitsPoints
            .attr( "fill", "gray" )
            .style( "fill-opacity", .4 )
            .filter( k => k[ "Country" ] === d.key )
              .attr( "fill", d => cScale( using_colors ? d[ "stt_perfil" ] : "0" ) )
              .style( "fill-opacity", 1 );

        } )
        .on( "mouseout", unhighlight );

    countriesNumUnits = svg.selectAll( "text.countriesNumUnits" )
      .data( csData.sumByCountry.all() )
      .enter().append( "text" )
        .attr( "class", "countriesNumUnits" )
        .attr( "x", 460 )
        .attr( "y", ( d, i ) => ( 15 + i * 20 ) )
        .attr( "fill", cScale( "0" ) )
        .attr( "text-anchor", "start" )
        .text( d => d.value )
        .style( "font-size", "0.4em" )
        .style( "fill-opacity", 0 )
        .on( "mouseover", function( d ) {
          
          countriesList
            .attr( "fill", "gray" )
            .style( "fill-opacity", .4 )
            .filter( k => k.key === d.key )
              .attr( "fill", "steelblue" )
              .style( "font-weight", "bold" )
              .style( "fill-opacity", 1 );

          countriesNumUnits
            .attr( "fill", "gray" )
            .style( "fill-opacity", .4 )
            .filter( k => k.key === d.key )
              .attr( "fill", "steelblue" )
              .style( "font-weight", "bold" )
              .style( "fill-opacity", 1 );

          unitsPoints
            .attr( "fill", "gray" )
            .style( "fill-opacity", .4 )
            .filter( k => k[ "Country" ] === d.key )
              .attr( "fill", d => cScale( using_colors ? d[ "stt_perfil" ] : "0" ) )
              .style( "fill-opacity", 1 );              

        } )
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
        .attr( "x", 450 )
        .attr( "y", ( d, i ) => ( 15 + i * 20  ) )
        .style( "font-size", "0.4em" );

    countriesNumUnits
      .transition()
        .duration( transition_duration )
        .attr( "x", 460 )
        .attr( "y", ( d, i ) => ( 15 + i * 20  ) )
        .style( "font-size", "0.4em" );

  }

  // Drawing unitsPoints

  if( unitsPoints == null ) {

    unitsPoints = svg.selectAll( "circle.unitsPoints" )
      .data( csData.all() )
      .enter().append( "circle" )
        .attr( "class", "unitsPoints" )
        .attr( "cx", d => countriesProjection( d.point )[ 0 ] )
        .attr( "cy", d => countriesProjection( d.point )[ 1 ] )
        .attr( "r", 2 )
        .attr( "fill", d => cScale( "0" ) )
        .style( "fill-opacity", 0 )
        .on( "mouseover", d => {

           countriesList
            .attr( "fill", "gray" )
            .style( "fill-opacity", .4 )
            .filter( k => k.key === d[ "Country" ] )
              .attr( "fill", "steelblue" )
              .style( "font-weight", "bold" )
              .style( "fill-opacity", 1 );

          countriesNumUnits
            .attr( "fill", "gray" )
            .style( "fill-opacity", .4 )
            .filter( k => k.key === d[ "Country" ] )
              .attr( "fill", "steelblue" )
              .style( "font-weight", "bold" )
              .style( "fill-opacity", 1 );

          unitsPoints
            .attr( "fill", "gray" )
            .style( "fill-opacity", .4 )
            .filter( k => k[ level ] === d[ level ] )
              .attr( "fill", d => cScale( using_colors ? d[ "stt_perfil" ] : "0" ) )
              .style( "fill-opacity", 1 )
              .attr( "r", 5 );

          if( typologiesNumUnits != null ) {

            typologiesNumUnits
              .attr( "fill", "gray" )
              .style( "fill-opacity", .4 )
              .filter( k => k.key === d[ typology ] )
                .attr( "fill", k => cScale( k.key ) )
                .style( "font-weight", "bold" )
                .style( "fill-opacity", 1 );

          }

        } )
        .on( "mouseout", unhighlight );

     unitsPoints   
      .append( "title" )
          .text( d => d[ "Country" ] + " - " + d[ "L1Name" ] );

    unitsPoints
      .transition()
        .duration( transition_duration )
        .style( "fill-opacity", 1 );

  } else {

     unitsPoints
      .transition()
        .duration( transition_duration )
        .attr( "cx", d => countriesProjection( d.point )[ 0 ] )
        .attr( "cy", d => countriesProjection( d.point )[ 1 ] );

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

function unhighlight( element ) {

  countriesList
    .attr( "fill", cScale( "0" ) )
    .style( "fill-opacity", 1 )
    .style( "font-weight", "normal" );

  countriesNumUnits
    .attr( "fill", cScale( "0" ) )
    .style( "fill-opacity", 1 )
    .style( "font-weight", "normal" );

  unitsPoints
    .attr( "fill", d => cScale( using_colors ? d[ "stt_perfil" ] : "0" ) )
    .style( "fill-opacity", 1 )
    .attr( "r", 2 );

  if( typologiesNumUnits != null ) {

    typologiesNumUnits
      .attr( "fill", d => cScale( d.key ) )
      .style( "fill-opacity", 1 )
      .style( "font-weight", "normal" );

  }

}