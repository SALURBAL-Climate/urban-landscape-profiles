// InitFn Initialization function. Use it for creating your viz
function initFn () {
  
  // Append an svg and a circle
  d3.select( this )
    .append( "svg" )
    .attr( "width", 400 )
    .attr("height", 400 )
    .selectAll( "circle" )
      .data( d3.range( 0, 30 ) )
        .enter()
        .append( "circle" )
        .attr( "cx", 50 )
        .attr( "cy", ( d, i ) => i * ( 10 + 2 ) + 50 )
        .attr( "r", 5 )
        .attr( "fill", "steelblue" );

}

//StepFn Function called every step
function stepFn( step ) {
  
  if( step === "left" ) {
    
    d3.select( this )
      .selectAll( "circle" )
        .transition()
        .duration( 1000 )
        .attr( "cx", 50 )
        .attr( "cy", ( d, i ) => i * ( 10 + 2 ) + 50 )
        .attr( "r", 5 )
        .attr( "style", "steelblue" );

  } else if( step === "middle" ) {
    
    d3.select( this )
      .selectAll( "circle" )
        .transition()
        .duration( 1000 )
        .attr( "cx", _ => Math.random() * 350 )
        .attr( "cy", ( d, i ) => i * ( 10 + 2 ) + 50 )
        .style( "fill", "steelblue" );

  } else if( step === "down" ) {
    
    d3.select( this )
      .selectAll( "circle" )
        .transition()
        .duration( 1000 )
        .attr( "cy", 50 )
        .style( "fill", "darkblue" );
  }

}

// Stop function, what to do if the presentation moves away from the viz. Useful for stoping force simulations
function stopFn() {

  console.log( "Not scrolling anymore :(" );

}

function revealVizScrollCallback() {
  
  // Create a new scrollable named demo
  revealVizScroll.makeScrollable( "demo", stepFn, initFn, stopFn );

}

d3.csv( "./data/base_l2_clean.csv", d => {
  
  d[ 'BECADCRCTYAVG' ] = +d[ 'BECADCRCTYAVG' ];
  d[ 'BECADINTDENS' ] = +d[ 'BECADINTDENS' ];
  d[ 'BECADSTTDENS' ] = +d[ 'BECADSTTDENS' ];
  d[ 'BECADSTTLGAVG' ] = +d[ 'BECADSTTLGAVG' ];
  d[ 'BECADSTTPNODEAVG' ] = +d[ 'BECADSTTPNODEAVG' ];
  d[ 'BECAWAVGPTCHAREA' ] = +d[ 'BECAWAVGPTCHAREA' ];
  d[ 'BECAWEDGDENS' ] = +d[ 'BECAWEDGDENS' ];
  d[ 'BECAWMNNNGH' ] = +d[ 'BECAWMNNNGH' ];
  d[ 'BECAWMNSHPINDX' ] = +d[ 'BECAWMNSHPINDX' ];
  d[ 'BECEFFMESHSIZE' ] = +d[ 'BECEFFMESHSIZE' ];
  d[ 'BECNURBPTCH' ] = +d[ 'BECNURBPTCH' ];
  //d[ 'BECPRSBRT' ] = +d[ 'BECPRSBRT' ];
  //d[ 'BECPRSSUBWAY' ] = +d[ 'BECPRSSUBWAY' ];
  d[ 'BECPTCHDENS' ] = +d[ 'BECPTCHDENS' ];
  d[ 'BECURBTRVDELAYINDEX' ] = +d[ 'BECURBTRVDELAYINDEX' ];

  d[ 'CentLatitude' ] = +d[ 'CentLatitude' ];
  d[ 'CentLongitude' ] = +d[ 'CentLongitude' ];

  d[ 'TSNE_TR_X' ] = +d[ 'TSNE_TR_X' ];
  d[ 'TSNE_TR_Y' ] = +d[ 'TSNE_TR_Y' ];

  return d;

} ).then( data => {

  console.log( data );

  var csData = crossfilter( data );

  csData.countries = csData.dimension( d => d[ "Country" ] );
  csData.l1names = csData.dimension( d => d[ "L1Name" ] );
  csData.l2names = csData.dimension( d => d[ "L2Namev2" ] );
  csData.profiles = csData.dimension( d => d[ "TR_PROFILE" ] );

  csData.sumByCountry = csData.countries.group();
  csData.sumByL1Name =  csData.l1names.group();
  csData.sumByL2Name =  csData.l2names.group();
  csData.sumByProfile = csData.profiles.group();

  function update() {

    

  }

  update();

} );