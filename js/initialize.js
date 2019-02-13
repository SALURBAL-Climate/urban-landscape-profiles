/* global Reveal, revealVizScroll */

Reveal.initialize( {
  dependencies: [ { 
    src : "./lib/js/revealVizScroll.js",
    async : false,
    callback : _ => revealVizScroll.makeScrollable( "salurbal", doStep )
  } ],    
} );