/* global d3 */

function lacMap() {
  
  var margin = { top: 10, right: 10, bottom: 10, left: 10 },
    width = 400,
    height = 400,
    latlngValue = function( d ) { return d[ 0 ]; },
    zValue = function( d ) { return d[ 2 ]; },
    textValue = function( d ) { return d[ 3 ]; },
    zScale = d3.scaleOrdinal( d3.schemeCategory10 );

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

      // Configuring map

      var map = L.map( "map" ).setView( [ -16.64, -65.21 ], 2 );
      const mapLink = "<a href='http://openstreetmap.org'>OpenStreetMap</a>";
      L.tileLayer( "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution : "&copy; " + mapLink + " Contributors",
        maxZoom : 8,
      } ).addTo( map );

      //map._initPathRoot();

      // Defining the projection
      var projection = d3.geoMercator();
      
      // Binding data
      var circles = g.selectAll( ".circle" )
        .data( function ( d ) { return d; } );

      circles
        .enter()
        .append( "circle" )
          .attr( "class", "circle" )
        .merge( circles ) 
          .style( "fill", Z )
          .attr( "r", 2 )
          .append( "title" )
            .text( d => textValue( d ) );

      function update() {
        circles.attr( "transform", 
          function( d ) { 
            return "translate(" + map.latLngToLayerPoint( latlngValue( d ) ).x +","+ map.latLngToLayerPoint( latlngValue( d ) ).y +")";
          }
        );
      }

      map.on( "viewreset", update );
      update();

      circles.exit().remove();

    } );

  }

  function Z( d ) {
    return zScale( zValue( d ) );
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

  chart.latlng = function( _ ) {
    if( !arguments.length ) return latlngValue;
    latlngValue = _;
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