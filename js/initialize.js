/* global Reveal, revealVizScroll */

Reveal.initialize( {
  dependencies: [ { 
    src : "./js/revealVizScroll.js",
    async : false,
    callback : _ => revealVizScroll.makeScrollable( "salurbal", doStep )
  } ],    
} );