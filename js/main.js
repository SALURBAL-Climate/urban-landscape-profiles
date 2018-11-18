/* global d3, crossfilter, dimredChart */

var myDimredChart = dimredChart()
  .x( d => d[ "TSNE_TR_X" ] )
  .y( d => d[ "TSNE_TR_Y" ] )
  .z( d => d[ "TR_PROFILE" ] )
  .text( d => d[ "L2Namev2" ] );

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

  var csData = crossfilter( data );

  csData.countries = csData.dimension( d => d[ "Country" ] );
  csData.profiles = csData.dimension( d => d[ "TR_PROFILE" ] );

  csData.sumByCountry = csData.countries.group();
  csData.sumByProfile = csData.profiles.group();

  console.log( csData.sumByProfile.all() );

  function update() {

    var dimred = d3.select( "#dimred" );
    
    myDimredChart
      .width( +dimred.style( "width" ).slice( 0, -2 ) );

    dimred
      .datum( csData.all() )
      .call( myDimredChart );

  }

  update();

} );