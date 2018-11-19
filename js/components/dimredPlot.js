/* global d3 */

function dimredPlot() {
  
  var margin = { top: 20, right: 20, bottom: 20, left: 20 },
    width = 400,
    height = 400,
    xValue = function( d ) { return d[ 0 ]; },
    yValue = function( d ) { return d[ 1 ]; },
    zValue = function( d ) { return d[ 2 ]; },
    textValue = function( d ) { return d[ 3 ]; },
    xScale = d3.scaleLinear(),
    yScale = d3.scaleLinear(),
    hueScale = d3.scaleOrdinal( d3.schemeCategory10  );

  function chart( selection ) {

    selection.each( function( data ) {

      /// Select the svg element, if it exists.
      var svg = d3.select( this ).selectAll( "svg" ).data( [ data ] );

      // Otherwise, create the skeletal chart.
      var svgEnter = svg.enter().append( "svg" );
      var gEnter = svgEnter.append( "g" );
      gEnter.append( "g" ).attr( "class", "x axis" );
      gEnter.append( "g" ).attr( "class", "y axis" );

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
  
      xScale.rangeRound( [ 0, innerWidth ] )
        .domain( [ d3.min( data, xValue ), d3.max( data, xValue ) ] );
      
      yScale.rangeRound( [ innerHeight, 0 ] )
        .domain( [ d3.min( data, yValue ), d3.max( data, yValue ) ] );

      hueScale
        .domain( [ "1", "2", "3", "", "4", "5", "6" ] );
      
      // Binding data
      var circles = g.selectAll( ".circle" )
        .data( function ( d ) { return d; } );

      circles
        .enter()
        .append( "circle" )
          .attr( "class", "circle" )
        .merge( circles )
          .attr( "cx", X )
          .attr( "cy", Y )  
          .style( "fill", Hue )
          .attr( "r", 2 )
          .append( "title" )
            .text( d => textValue( d ) );

      circles.exit().remove();

    } );

  }

  // The x-accessor for the path generator; xScale ∘ xValue.
  function X( d ) {
    return xScale( xValue( d ) );
  }

  // The y-accessor for the path generator; yScale ∘ yValue.
  function Y( d ) {
    return yScale( yValue( d ) );
  }

  function Hue( d ) {
    return hueScale( zValue( d ) );
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

  chart.x = function( _ ) {
    if( !arguments.length ) return xValue;
    xValue = _;
    return chart;
  };

  chart.y = function( _ ) {
    if( !arguments.length ) return yValue;
    yValue = _;
    return chart;
  };

  chart.z = function( _ ) {
    if( !arguments.length ) return zValue;
    zValue = _;
    return chart;
  };

  chart.text = function( _ ) {
    if( !arguments.length ) return textValue;
    textValue = _;
    return chart;
  };

  return chart;

}