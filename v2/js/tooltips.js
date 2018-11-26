function getTipTemplate( name, d ) {

	if( name == "map" ) return `<strong>Country:</strong> <span>${ d.Country }</span><br />` +
		`<strong>L1 Name:</strong> <span>${ d.L1Name }</span><br />` +
		`<strong>L2 Name:</strong> <span>${ d.L2Namev2 }</span>`;

}