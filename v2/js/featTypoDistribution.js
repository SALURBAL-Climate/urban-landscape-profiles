function featTypoDistribution( element ) {

  // Stoping simulation
  if( typologySimul != null ) typologySimul.stop();

  unitsPoints
    .transition()
      .duration( transition_duration )
      .style( "fill-opacity", 0 );

}