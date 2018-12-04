function featDistribution( element, feature ) {

  // Resizing map and ountries list

  countriesProjection = d3.geoMercator()
    .scale( 170 / Math.PI )
    .translate( [ 120 , 40 ] );

  countriesPath.projection( countriesProjection );

  countriesFigure
    .transition()
      .duration( transition_duration )   
      .attr( "d", countriesPath );

  countriesList
    .transition()
      .duration( transition_duration )
      .attr( "x", 135 )
      .attr( "y", ( d, i ) => ( 15 + i * 10  ) )
      .style( "font-size", "0.2em" );

  countriesNumUnits
    .transition()
      .duration( transition_duration )
      .attr( "x", 140 )
      .attr( "y", ( d, i ) => ( 15 + i * 10  ) )
      .style( "font-size", "0.2em" );

  // Stoping simulation
  if( typologySimul != null ) typologySimul.stop();

  if( using_colors == true ) {

    if( typologiesList == null ) {
    
      typologiesList = svg.selectAll( "circle.typologiesList" )
        .data( csData.sumByTypology.all() )
        .enter().append( "circle" )
          .attr( "class", "typologiesList" )
          .attr( "cx", width - 20 )
          .attr( "cy", ( d, i ) => ( 15 + i * 20  ) )
          .attr( "r", point_radius_highlighted )
          .attr( "fill", d => cScale( d.key ) )
          .style( "fill-opacity", 0 );

      typologiesList
        .transition()
          .duration( transition_duration )
          .style( "fill-opacity", 1 );

    } else {

      typologiesList
        .transition()
          .duration( transition_duration )
          .style( "fill-opacity", 1 );

    }

    typologiesNumUnits
      .transition()
        .duration( transition_duration )
        .attr( "x", width - 30 )
        .attr( "y", ( d, i ) => ( 20 + i * 20 ) )
        .attr( "text-anchor", "end" )
        .style( "font-size", "0.3em" );

  }

  // Drawing boxplot

  sumstat = d3.nest()
    .key( d => d[ "Country" ] )
    .sortKeys( d3.ascending )
    .rollup( d => {
      
      q1 = d3.quantile( d.map( g => g[ feature ] ).sort( d3.ascending ), .25 );
      median = d3.quantile( d.map( g => g[ feature ] ).sort( d3.ascending ), .5 );
      q3 = d3.quantile(d.map( g => g[ feature ] ).sort( d3.ascending ), .75 );
      interQuantileRange = q3 - q1;
      min = q1 - 1.5 * interQuantileRange;
      max = q3 + 1.5 * interQuantileRange;

      if( min < d3.min( d, g => g[ feature ] ) ) min = d3.min( d, g => g[ feature ] );
      if( max > d3.max( d, g => g[ feature ] ) ) max = d3.max( d, g => g[ feature ] );

      return( { q1: q1, median: median, q3: q3, interQuantileRange: interQuantileRange, min: min, max: max } );

    } )
    .entries( csData.all() );

  xScaleBox = d3.scaleBand()
    .range( [ 30, width - 30 ] )
    .domain( sumstat.map( d => d.key ) )
    .paddingInner( 1 )
    .paddingOuter( .5 );

  yScaleBox = d3.scaleLinear()
    .domain( [ ( feature == "number_of_urban_patches" ) ? -200 : d3.min( csData.all(), d => d[ feature ] ), d3.max( csData.all(), d => d[ feature ] ) ] )
    .range( [ height - 70 , 150 ] );

  /*if( countriesBoxplotxAxis == null || update_axis == true ) {*/

    hide_boxplot();

    // Show the X axis
    countriesBoxplotxAxis = svg.append( "g" )
      .attr( "transform", "translate(0," + height + ")" );

    countriesBoxplotxAxis
      .transition()
        .duration( transition_duration )
        .attr( "transform", "translate(0," + ( height - 70 ) + ")" );
    
    countriesBoxplotxAxis
      .call( d3.axisBottom( xScaleBox ) )
      .selectAll( "text" )
        .attr( "y", -4 )
        .attr( "x", -12 )
        .attr( "transform", "rotate(-90)" )
        .attr( "font-size", "1em" )
        .style( "font-style", "'Montserrat', sans-serif" )
        .style( "text-anchor", "end" );

    // Show the Y axis    
    countriesBoxplotyAxis = svg.append( "g" )
      .attr( "transform", "translate(0,0)" );

    countriesBoxplotyAxis
      .transition()
        .duration( transition_duration )
        .attr( "transform", "translate(30,0)" );

    countriesBoxplotyAxis
      .call( d3.axisLeft( yScaleBox ).ticks( 10, "s" ) )
      .append( "text" )
        .attr( "transform", "rotate(-90)" )
        .attr( "x", -150 )
        .attr( "y", 12 )
        .style( "fill", "black" )
        .attr( "font-size", "1em" )
        .style( "font-style", "'Montserrat', sans-serif" )
        .style( "text-anchor", "end" )
        .text( friendly_names[ feature ] );

    // Show the main vertical line
    if( countriesBoxplotVertLines != null ) countriesBoxplotVertLines.remove();

    countriesBoxplotVertLines = svg.selectAll( "line.countriesBoxplot.vertline" )
      .data( sumstat )
      .enter()
      .append( "line" )
        .attr( "class", "countriesBoxplot vertline" )
        .attr( "x1", d => xScaleBox( d.key ) )
        .attr( "x2", d => xScaleBox( d.key ) )
        .attr( "y1", d => yScaleBox( d.value.min ) )
        .attr( "y2", d => yScaleBox( d.value.max ) )
        .attr( "stroke", "steelblue" )
        .style( "width", 40 );

    // rectangle for the main box
    var boxWidth = 30;
    
    if( countriesBoxplotBoxes != null ) countriesBoxplotBoxes.remove();

    countriesBoxplotBoxes = svg.selectAll( "boxes.countriesBoxplot.box" )
      .data( sumstat )
      .enter()
      .append( "rect" )
        .attr( "class", "countriesBoxplot box" )
        .attr( "x", d => xScaleBox( d.key ) - boxWidth / 2  )
        .attr( "y", d => yScaleBox( d.value.q3 ) )
        .attr( "height", d => yScaleBox( d.value.q1 ) - yScaleBox( d.value.q3 ) )
        .attr( "width", boxWidth )
        .attr( "stroke", "steelblue" )
        .style( "fill", "white" );

    // Show the median
    
    if( countriesBoxplotMedians != null ) countriesBoxplotMedians.remove();

    countriesBoxplotMedians = svg.selectAll( "line.countriesBoxplot.medians" )
      .data( sumstat )
      .enter()
      .append( "line" )
        .attr( "class", "countriesBoxplot medians" )
        .attr( "x1", d => xScaleBox( d.key ) - boxWidth / 2 )
        .attr( "x2", d => xScaleBox( d.key ) + boxWidth / 2 )
        .attr( "y1", d => yScaleBox( d.value.median ) )
        .attr( "y2", d => yScaleBox( d.value.median ) )
        .attr( "stroke", "steelblue" )
        .style( "width", 40 );

  //} else {

    show_boxplot();
    
  //}

  // Add individual points
  unitsPoints
    .moveToFront();

  typologySimul = d3.forceSimulation( csData.all() )
    .force( "collide", d3.forceCollide().radius( point_radius ) )
    .force( "x", d3.forceX( d => xScaleBox( d[ "Country" ] ) ).strength( .3 ) )
    .force( "y", d3.forceY( d => yScaleBox( d[ feature ] ) ).strength( .3 ) )
    .on( "tick", _ => {
        
        unitsPoints
          .attr( "cx", d => d.x )
          .attr( "cy", d => d.y );

    } );

  /*unitsPoints
    .transition()
      .duration( transition_duration )
      .attr( "cx",  d => xScaleBox( d[ "Country" ] ) - jitterWidth / 2 + Math.random() * jitterWidth )
      .attr( "cy", d  => yScaleBox( d[ feature ] ) );*/

}

function show_boxplot() {

  if( countriesBoxplotyAxis != null ) {

    countriesBoxplotxAxis.selectAll( "path,line,text" )
      .transition()
        .duration( transition_duration )
        .style( "stroke-opacity", 1 )
        .style( "fill-opacity", 1 );

    countriesBoxplotyAxis.selectAll( "path,line,text" )
      .transition()
        .duration( transition_duration )
        .style( "stroke-opacity", 1 )
        .style( "fill-opacity", 1 );

    countriesBoxplotVertLines
      .transition()
        .duration( transition_duration )
        .style( "stroke-opacity", 1 );

    countriesBoxplotBoxes
      .transition()
        .duration( transition_duration )
        .style( "stroke-opacity", 1 );

    countriesBoxplotMedians
      .transition()
        .duration( transition_duration )
        .style( "stroke-opacity", 1 );

  }

}

function hide_boxplot() {

  if( countriesBoxplotBoxes != null ) {

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