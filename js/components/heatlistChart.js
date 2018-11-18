/* global d3 */

function heatlistChart() {
  
  var margin = { top: 10, right: 10, bottom: 10, left: 10 },
    width = 400,
    height = 400,
    textValue = function( d ) { return d[ 0 ]; },
    quantityValue = function( d ) { return d[ 1 ]; },
    zScale = d3.scaleSequential( d3.interpolateBlues );
    zScaleInv = d3.scaleSequential( d3.interpolateBlues );

  function chart( selection ) {

    selection.each( function( data ) {

      console.log( data );

      /// Select the svg element, if it exists.
      var svg = d3.select( this ).selectAll( "svg" ).data( [ data ] );

      // Otherwise, create the skeletal chart.
      var svgEnter = svg.enter().append( "svg" );
      var gEnter = svgEnter.append( "g" );
      //gEnter.append( "g" ).attr( "class", "x axis" );
      //gEnter.append( "g" ).attr( "class", "y axis" );

      innerWidth = width - margin.left - margin.right;
      innerHeight = height - margin.top - margin.bottom;

      // Update the outer dimensions.
      svg.merge( svgEnter )
        .attr( "width", width )
        .attr( "height", height );

      // Update the inner dimensions.
      var g = svg.merge( svgEnter ).select( "g" )
          .attr( "transform", "translate(" + margin.left + "," + margin.top + ")" );

      // Defining the scales
  
      zScale
        .domain( [ d3.min( data, quantityValue ), d3.max( data, quantityValue ) ] );

      zScaleInv
        .domain( [ d3.max( data, quantityValue ), d3.min( data, quantityValue ) ] );

      // Binding data
      var rects = g.selectAll( ".rect" )
        .data( function ( d ) { return d; } );

      rects
        .enter()
        .append( "rect" )
          .attr( "class", "rect" )
        .merge( rects )
          .attr( "x", ( d, i ) => ( innerWidth / 2 ) )
          .attr( "y", ( d, i ) => ( 2 * i ) + "em" )
          .attr( "width", ( innerWidth / 2 ) )
          .attr( "height", "2em" )  
          .style( "fill", Z );

      var texts = g.selectAll( ".label.text" )
        .data( function ( d ) { return d; } );

      texts
        .enter()
        .append( "text" )
          .attr( "class", "label text" )
        .merge( texts )
          .attr( "x", ( d, i ) => ".5em" )
          .attr( "y", ( d, i ) => ( ( 2 * i ) + 1.5 ) + "em" )
          .style( "font-size", "1em" )
          .text( d => textValue( d ) );

      var quantities = g.selectAll( ".label.quantity" )
        .data( function ( d ) { return d; } );

      quantities
        .enter()
        .append( "text" )
          .attr( "class", "label quantity" )
        .merge( quantities )
          .attr( "x", ( d, i ) => innerWidth - 5 )
          .attr( "y", ( d, i ) => ( ( 2 * i ) + 1.5 ) + "em" )
          .style( "font-size", "1em" )
          .style( "fill", ZInv )
          .attr( "text-anchor", "end" )
          .text( d => quantityValue( d ) );

      rects.exit().remove();
      texts.exit().remove();
      quantities.exit().remove();

    } );

  }

  function Z( d ) {
    return zScale( quantityValue( d ) );
  }

  function ZInv( d ) {
    return zScaleInv( quantityValue( d ) );
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

  chart.quantity = function( _ ) {
    if( !arguments.length ) return quantityValue;
    quantityValue = _;
    return chart;
  };

  return chart;

}