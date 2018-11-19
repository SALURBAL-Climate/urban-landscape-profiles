/* global d3 */

function combobox() {
  
  var margin = { top: 20, right: 20, bottom: 20, left: 20 },
    width = 400,
    height = 100,
    textValue = function( d ) { return d[ 0 ]; };

  function chart( selection ) {

    selection.each( function( data ) {

      var select = d3.select( this ).append( "select" )
        .attr( "class", "select" );

      var options = select.selectAll( "option" )
        .data( data )
        .enter()
        .append( "option" )
          .text( d =>  textValue( d ) );

    } );

  }

  chart.margin = function( _ ) {
    if( !arguments.length ) return margin;
    margin = _;
    return chart;
  };

  chart.width = function( _ ) {
    if( !arguments.length ) return width;
    width = _;
    return chart;
  };

  chart.height = function( _ ) {
    if( !arguments.length ) return height;
    height = _;
    return chart;
  };

  chart.text = function( _ ) {
    if( !arguments.length ) return textValue;
    textValue = _;
    return chart;
  };

  return chart;

}