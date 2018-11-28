function initializeBoxPlot() {

  sumstat = d3.nest()
    .key( d => d[ "Country" ] )
    .sortKeys( d3.ascending )
    .rollup( d => {
      
      q1 = d3.quantile( d.map( g => g[ "intersection_density" ] ).sort( d3.ascending ), .25 );
      median = d3.quantile( d.map( g => g[ "intersection_density" ] ).sort( d3.ascending ), .5 );
      q3 = d3.quantile(d.map( g => g[ "intersection_density" ] ).sort( d3.ascending ), .75 );
      interQuantileRange = q3 - q1;
      min = q1 - 1.5 * interQuantileRange
      max = q3 + 1.5 * interQuantileRange
      return( { q1: q1, median: median, q3: q3, interQuantileRange: interQuantileRange, min: min, max: max } );

    } )
    .entries( csData.all() );

  console.log( sumstat );

  xScaleBox = d3.scaleBand()
    .range( [ 30, width - 30 ] )
    .domain( sumstat.map( d => d.key ) )
    .paddingInner( 1 )
    .paddingOuter( .5 );

  yScaleBox = d3.scaleLinear()
    .domain( [ 0, d3.max( csData.all(), d => d[ "intersection_density" ] ) ] )
    .range( [ height - 70 , 150 ] );

}

function featDistribution( element ) {

  // Resizing map anc ountries list

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
      .style( "font-size", "0.20em" );

  countriesNumUnits
    .transition()
      .duration( transition_duration )
      .attr( "x", 140 )
      .attr( "y", ( d, i ) => ( 15 + i * 10  ) )
      .style( "font-size", "0.20em" );

  // Drawing boxplot

  if( countriesBoxplotxAxis == null ) { 

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
        .style( "text-anchor", "end" );

    // Show the Y axis    
    countriesBoxplotyAxis = svg.append( "g" )
      .attr( "transform", "translate(0,0)" );

    countriesBoxplotyAxis
      .transition()
        .duration( transition_duration )
        .attr( "transform", "translate(30,0)" );

    countriesBoxplotyAxis
      .call( d3.axisLeft( yScaleBox ) );

    // Show the main vertical line
    countriesBoxplotVertLines = svg.selectAll( "line.countriesBoxplot.vertline" )
      .data( sumstat )
      .enter()
      .append( "line" )
        .attr( "class", "countriesBoxplot vertline" )
        .attr( "x1", d => xScaleBox( d.key ) )
        .attr( "x2", d => xScaleBox( d.key ) )
        .attr( "y1", d => yScaleBox( d.value.min ) )
        .attr( "y2", d => yScaleBox( d.value.max ) )
        .attr( "stroke", "black" )
        .style( "width", 40 );

    // rectangle for the main box
    var boxWidth = 30;
    
    countriesBoxplotBoxes = svg.selectAll( "boxes.countriesBoxplot.box" )
      .data( sumstat )
      .enter()
      .append( "rect" )
        .attr( "class", "countriesBoxplot box" )
        .attr( "x", d => xScaleBox( d.key ) - boxWidth / 2  )
        .attr( "y", d => yScaleBox( d.value.q3 ) )
        .attr( "height", d => yScaleBox( d.value.q1 ) - yScaleBox( d.value.q3 ) )
        .attr( "width", boxWidth )
        .attr( "stroke", "black" )
        .style( "fill", "white" );

    // Show the median
    countriesBoxplotMedians = svg.selectAll( "line.countriesBoxplot.medians" )
      .data( sumstat )
      .enter()
      .append( "line" )
        .attr( "class", "countriesBoxplot medians" )
        .attr( "x1", d => xScaleBox( d.key ) - boxWidth / 2 )
        .attr( "x2", d => xScaleBox( d.key ) + boxWidth / 2 )
        .attr( "y1", d => yScaleBox( d.value.median ) )
        .attr( "y2", d => yScaleBox( d.value.median ) )
        .attr( "stroke", "black" )
        .style( "width", 40 );

  } else {

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

  // Add individual points with jitter
  var jitterWidth = 30;
  
  unitsPoints
    .moveToFront();

  unitsPoints
  .transition()
    .duration( transition_duration )
    .attr( "cx",  d => xScaleBox( d[ "Country" ] ) - jitterWidth / 2 + Math.random() * jitterWidth )
    .attr( "cy", d  => yScaleBox( d[ "intersection_density" ] ) );

}