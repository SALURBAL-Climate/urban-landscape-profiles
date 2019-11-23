/* global d3 */

function SwarmModule(data, mode) {
  const featuresHierarchy = {
    "Street Design": [
      {
        key: "BECADSTTDENS",
        name: "Street density",
        subdomain: "Street connectivity",
        description: "Measures the length of streets per Km2 of area.",
        interpretation: "Higher values, higher connectivity",
        units: "streets / Km2"
      },
      {
        key: "BECADINTDENS",
        name: "Intersection density",
        subdomain: "Intersection connectivity",
        description: "Measures the amount of intersections per Km2 of area.",
        interpretation: "Higher values, higher connectivity",
        units: "intersections / Km2"
      },
      {
        key: "BECADSTTPNODEAVG",
        name: "Streets per node average",
        subdomain: "Intersection connectivity",
        description:
          "Measures the distribution of the number of streets that meet at each intersection of the street network.",
        interpretation: "Higher values, higher connectivity",
        units: "streets"
      },
      {
        key: "BECADSTTLGAVG",
        name: "Street length average",
        subdomain: "Street length",
        description: "Measures the length of streets in the street network.",
        interpretation: "Higher values, larger streets segments",
        units: "meters"
      },
      {
        key: "BECADCRCTYAVG",
        name: "Circuity average",
        subdomain: "Directness",
        description:
          "Measures the average ratio of network distances to straight-line distances.",
        interpretation: "Higher values, more curved streets",
        units: undefined
      }
    ],
    "Urban Landscape": [
      {
        key: "BECNURBPTCH",
        name: "Number of urban patches",
        subdomain: "Fragmentation",
        description:
          "Number of contiguous areas of urban development (urban patches hereafter).",
        interpretation: "Higher values, higher fragmentation",
        units: "urban patches"
      },
      {
        key: "BECPTCHDENS",
        name: "Patch density",
        subdomain: "Fragmentation",
        description:
          "Number of urban patches divided by the total area of the geographic unit (in 100 hectares).",
        interpretation: "Higher values, higher fragmentation",
        units: "urban patches / km2"
      },
      {
        key: "BECAWAVGPTCHAREA",
        name: "Area-weighted mean patch size",
        subdomain: "Fragmentation",
        description:
          "Weighted average of urban patch size (in km2). This value is weighted by the area of each patch.",
        interpretation: "Higher values, lower fragmentation",
        units: "km2"
      },
      {
        key: "BECEFFMESHSIZE",
        name: "Effective mesh size",
        subdomain: "Fragmentation",
        description:
          "The sum of squares of urban patch size, divided by the total area of the geographic unit.",
        interpretation: "Higher values, lower fragmentation",
        units: "km2"
      },
      {
        key: "BECAWMNSHPINDX",
        name: "Area-weighted mean shape index",
        subdomain: "Shape",
        description:
          "Shape index is a ratio of the actual perimeter of a patch to the minimum perimeter possible for a maximally compact patch with the same size. The area-weighted mean shape index is the weighted average of the shape index for each patch within the geographic boundary. This index is weighted by the area of each patch.",
        interpretation: "Higher values, more complex shape",
        units: undefined
      },
      {
        key: "BECAWMNNNGH",
        name: "Area-weighted mean nearest neighbor distance",
        subdomain: "Isolation",
        description:
          "Mean distance (in meters) to the nearest urban patch within the geographic boundary. This value is weighted by the area of each patch.",
        interpretation: "Higher values, higher isolation",
        units: "meters"
      }
    ]
  };
  function getProfileName(model, profile, level = "L1 Admin") {
    let name;
    if (model === "Street Design") {
      if (level === "L1 Admin") {
        if (profile === "1") name = "Semi-hyperbolic grid";
        else if (profile === "2") name = "Labyrinth";
        else if (profile === "3") name = "Spiderweb";
        else if (profile === "4") name = "Hyperbolic grid";
      } else if (level === "L1 UX") {
        if (profile === "1") name = "Semi-hyperbolic grid";
        else if (profile === "2") name = "Straight grid";
        else if (profile === "3") name = "Spiderweb";
        else if (profile === "4") name = "Labyrinth";
        else if (profile === "5") name = "Hyperbolic labyrinth";
      } else {
        if (profile === "1") name = "M Str. Connect./M Curved";
        else if (profile === "2") name = "L Str. Connect./H Curved";
        else if (profile === "3") name = "M Str. Connect./Straight";
        else if (profile === "4") name = "H Str. Connect./M Curved";
      }
    } else {
      if (level === "L1 Admin") {
        if (profile === "1") name = "Proximate stones";
        else if (profile === "2") name = "Scattered pixels";
        else if (profile === "3") name = "Proximate inkblots";
        else if (profile === "4") name = "Contiguous large inkblots";
      } else if (level === "L1 UX") {
        if (profile === "1") name = "Contiguous pixels";
        else if (profile === "2") name = "Proximate stones";
        else if (profile === "3") name = "Contiguous large inkblots";
        else if (profile === "4") name = "Scattered large inkblots";
      } else {
        if (profile === "1") name = "H Frag./Complex/M Iso.";
        else if (profile === "2") name = "M Frag./Irregular/L Iso.";
        else if (profile === "3") name = "L Frag./Complex/L Iso.";
        else if (profile === "4") name = "M Frag./Compact/H Iso.";
        else if (profile === "5") name = "L Frag./Irregular/L Iso.";
        else if (profile === "6") name = "H Frag./Compact/M Iso.";
      }
    }
    return name;
  }

  const swarm = (_data, attr, color) => {
    // console.log('swarm', _data.length, attr);

    const data = _data.slice().map(d => Object.assign({}, d));
    const width = 600,
      height = 100,
      r = 2,
      margin = { bottom: 30, top: 0, left: 0, right: 0 },
      iwidth = width - margin.left - margin.right,
      iheight = height - margin.top - margin.bottom;
    const xScale = d3.scaleSqrt();

    xScale
      .domain(d3.extent(data.map(d => +d[attr])))
      .range([0, iwidth])
      .nice();

    const svg = d3
      .create("svg")
      .style("overflow", "visible")
      .attr("width", width)
      .attr("height", height);

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const gCircles = g.append("g");

    const tooltip = g
      .append("text")
      .attr("class", "swarm_tooltip")
      .style("font-size", "16pt")
      .style("color", "#777");

    const circles = gCircles
      .selectAll("circle")
      .data(data)
      .join("circle")
      .attr("r", r)
      .attr("cx", d => d.x)
      .attr("cy", d => d.y)
      .style("fill", color)
      .on("mouseover", function(d) {
        console.log("onmouseover", d);
        circles.style("opacity", e => (e.COUNTRY === d.COUNTRY ? 0.1 : 0.5));
        d3.select(this).style("opacity", 1);
        tooltip
          .text(`${d.L1}: ${d[attr]}`)
          .attr("x", d.x + 20)
          .attr("y", d.y + 5);
      })
      .on("mouseout", () => {
        circles.style("opacity", 1);
        tooltip
          .text("")
          .attr("x", 0)
          .attr("y", 0);
      });

    g.append("g")
      .call(d3.axisBottom(xScale).ticks(5))
      .attr("transform", `translate(0, ${iheight})`);

    const simulation = d3
      .forceSimulation(data)
      .force("y", d3.forceY(iheight / 2).strength(0.1))
      .force("x", d3.forceX(d => xScale(+d[attr])).strength(1))
      .force("collide", d3.forceCollide(r).iterations(3))
      .on("tick", () => {
        circles.attr("cx", d => d.x).attr("cy", d => d.y);
      });

    for (let i = 0; i < 10; i++) simulation.tick();

    // invalidation.then(simulation.stop())

    return svg.node();
  };

  const addProfilesLegend = sel => {
    sel.each(data => {
      const option = sel
        .selectAll("div")
        .data(data)
        .join("div")
        .style("margin-left", "20px")
        .style("float", "left");

      // option.append("input")
      //   .attr("type", "checkbox")

      option
        .append("span")
        .attr("type", "checkbox")
        .style("min-width", "20px")
        .style("min-height", "20px")
        .style("display", "inline-block")
        .style("position", "relative")
        .style("top", "5px")
        .style("margin-right", "2px")
        .style("background-color", d => d.color);

      option
        .append("span")
        .style("display", "inline-block")
        .text(d => d.name);
    }); //each
  };

  const groupPlot = (keys, profiles) => {
    const div = d3.create("div").style("width", "100%");

    const color = d3.scaleOrdinal(
      d3.schemeCategory10.map(col => d3.interpolateRgb(col, "#fff")(0.2))
    );

    // div.append("h2").text(keys);

    const profilesObj = d3
      .set(data.map(d => d[profiles]))
      .values()
      .map(p => ({
        key: p,
        name: getProfileName(keys, p),
        color: color(p)
      }));

    div
      .append("div")
      .style("font-size", "10pt")
      .style("font", "sans-serif")
      .style("margin", "auto")
      .style("width", "60%")
      .datum(profilesObj)
      .call(addProfilesLegend);

    div.append("div")
      .style("clear", "both");

    const table = div
      .append("table")
      .style("table-layout", "fixed")
      .style("width", "100%");

    const facet = table
      .selectAll(".facet")
      .data(featuresHierarchy[keys])
      .join("tr")
      .attr("class", "facet");

    facet
      .append("td")
      .style("width", "30%")
      .text(d => d.name);
    facet.append("td").each(function(key) {
      d3.select(this)
        .node()
        .appendChild(swarm(data, key.key, d => color(d[profiles])));
    });

    return div.node();
  };

  if (mode === "Street Design") {
    return groupPlot("Street Design", "TRANS_PROF");
  } else {
    return groupPlot("Urban Landscape", "URBAN_PROF");
  }
} // SwarmModule
