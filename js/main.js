/* global d3, crossfilter, dimredPlot, lacMap, heatlistChart */

var myDimredPlot = dimredPlot()
  .x( d => d[ "TSNE_TR_X" ] )
  .y( d => d[ "TSNE_TR_Y" ] )
  .z( d => d[ "TR_PROFILE" ] )
  .text( d => d[ "L2Namev2" ] );

/*var myLacMap = lacMap()
  .latlng( d => d[ "LatLng" ] )
  .z( d => d[ "TR_PROFILE" ] )
  .text( d => d[ "L2Namev2" ] );*/

var myHeatlistChart = heatlistChart()
  .text( d => d[ "key" ] )
  .quantity( d => d[ "value" ] );

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
  d[ "LatLng" ] = new L.LatLng( +d[ 'CentLatitude' ], +d[ 'CentLongitude' ] );

  d[ 'TSNE_TR_X' ] = +d[ 'TSNE_TR_X' ];
  d[ 'TSNE_TR_Y' ] = +d[ 'TSNE_TR_Y' ];

  return d;

} ).then( data => {

  console.log( data );

  var csData = crossfilter( data );

  csData.countries = csData.dimension( d => d[ "Country" ] );
  csData.profiles = csData.dimension( d => d[ "TR_PROFILE" ] );

  csData.sumByCountry = csData.countries.group();
  csData.sumByProfile = csData.profiles.group();

  console.log( csData.sumByProfile.all() );

  function update() {

    /* Dimensionality Reduction */
    var dimred = d3.select( "#dimred" );
    
    myDimredPlot
      .width( +dimred.style( "width" ).slice( 0, -2 ) );

    dimred
      .datum( csData.all() )
      .call( myDimredPlot );

    /* Units on Map */

    /*var map = d3.select( "#map" );
    
    myLacMap
      .width( +map.style( "width" ).slice( 0, -2 ) );

    map
      .datum( csData.all() )
      .call( myLacMap );*/

    /* List By Country */

    var heatlist = d3.select( "#listByCountry" );
    
    myHeatlistChart
      .width( +heatlist.style( "width" ).slice( 0, -2 ) );

    heatlist
      .datum( csData.sumByCountry.all() )
      .call( myHeatlistChart );

  }

  update();

} );