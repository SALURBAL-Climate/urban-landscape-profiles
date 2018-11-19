/* global d3 */

function legendChart() {
  
  var margin = { top: 30, right: 10, bottom: 10, left: 10 },
    width = 400,
    height = 230,
    textValue = function( d ) { return d[ 0 ]; },
    quantityValue = function( d ) { return d[ 1 ]; },
    textAlias = "Text";
    quantityAlias = "Quantity";
    hueScale = d3.scaleOrdinal( d3.schemeCategory10  );

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
  
      hueScale
        .domain( [ "1", "2", "3", "", "4", "5", "6" ] );

      g.append( "rect" )
        .attr( "class", "rect" )
        .attr( "x", 0 )
        .attr( "y", "-2em" )
        .attr( "width", innerWidth )
        .attr( "height", "2em" )  
        .style( "fill", "white" );

      g.append( "text" )
        .attr( "class", "label title" )
        .attr( "x", ".5em" )
        .attr( "y", "-.5em" )
        .style( "font-size", "1em" )
        .style( "font-weight", "bold" )
        .style( "fill", "gray" )
        .text( textAlias );

      g.append( "text" )
        .attr( "class", "labeltitle" )
        .attr( "x", ( innerWidth / 2 ) )
        .attr( "y", "-.5em" )
        .style( "font-size", "1em" )
        .style( "font-weight", "bold" )
        .attr( "text-anchor", "middle" )
        .style( "fill", "gray" )
        .text( "Color" );
      
      g.append( "text" )
        .attr( "class", "labeltitle" )
        .attr( "x", innerWidth - 5 )
        .attr( "y", "-.5em" )
        .style( "font-size", "1em" )
        .style( "font-weight", "bold" )
        .attr( "text-anchor", "end" )
        .style( "fill", "gray" )
        .text( quantityAlias );

      g.append( "line" )
        .attr( "x1", 0 )
        .attr( "y1", -1 )
        .attr( "x2", innerWidth )
        .attr( "y2", -1 )
        .style( "stroke", "gray" )
        .style( "stroke-width", 1 );


      // Binding data
      var circles = g.selectAll( ".circle.category" )
        .data( function ( d ) { return d; } );

      circles
        .enter()
        .append( "circle" )
          .attr( "class", "circle category" )
        .merge( circles )
          .attr( "cx", ( d, i ) => ( innerWidth / 2 ) )
          .attr( "cy", ( d, i ) => ( ( 2 * i ) + 1 ) + "em" )
          .attr( "r", ".7em" )  
          .style( "fill", Hue );

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
          .style( "fill", "gray" )
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
          .style( "fill", "gray" )
          .attr( "text-anchor", "end" )
          .text( d => quantityValue( d ) );

      circles.exit().remove();
      texts.exit().remove();
      quantities.exit().remove();

    } );

  }

  function Hue( d ) {
    return hueScale( textValue( d ) );
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

  chart.textAlias = function( _ ) {
    if( !arguments.length ) return textAlias;
    textAlias = _;
    return chart;
  };

  chart.quantityAlias = function( _ ) {
    if( !arguments.length ) return quantityAlias;
    quantityAlias = _;
    return chart;
  };

  return chart;

}