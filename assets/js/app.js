var svg_Width = 960;
var svg_Height = 500;

var svg_margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svg_Width - svg_margin.left - svg_margin.right;
var height = svg_Height - svg_margin.top - svg_margin.bottom;

// creation of wrapper
var svg = d3
  .select("body")
  .append("svg")
  .attr("width", svg_Width)
  .attr("height", svg_Height);

//   append SVG group
var svg_group = svg.append("g")
  .attr("transform", `translate(${svg_margin.left}, ${svg_margin.top})`);

//   inital params 
var x_axis = "age";
var y_axis = "healthcare";

// for updating x_axis on click
function xScale(csv_data, x_axis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(csv_data, d => d[x_axis]) * 0.8,
    d3.max(csv_data, d => d[x_axis]) * 1.2
    ])
    .range([0, width]);

  return xLinearScale;
}
// render x_axis on click 
function renderAxes(new_scale, new_x) {
  var bottomAxis = d3.axisBottom(new_scale);

  new_x.transition()
    .duration(1000)
    .call(bottomAxis);

  return new_x;
}
// render circles
function renderCircles(circlesGroup, new_scale, x_axis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => new_scale(d[x_axis]));

  return circlesGroup;
}

// new tooltip to update circles
function updateToolTip(x_axis, circlesGroup) {
  if (x_axis === "age") {
    var label = "Age:";
  }
  else if (x_axis === "income") {
    var label = "Income ($)";
  }
  else {
    var label = "Poverty (%)";
  }

  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function (d) {
      return (`${d.state}<br>${label} ${d[x_axis]}`);
    });

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function (data) {
    toolTip.show(data);
  })
    // onmouseout event
    .on("mouseout", function (data, index) {
      toolTip.hide(data);
    });

  return circlesGroup;
}

// retrieve csv data
d3.csv("../assets/data/data.csv").then(function(csv_data){
  buildCharts(csv_data);
});

function buildCharts(csv_data) {
    csv_data.forEach(function (data) {
      data.age = +data.age;
      data.poverty = +data.poverty;
      data.income = +data.income;
      data.healthcare = +data.healthcare;
      data.obesity = +data.obesity;
      data.smoke = +data.smoke;
    });

    // import csv data to xlinear scale 
    var xLinearScale = xScale(csv_data, x_axis);

    // creation of y axis
    var yLinearScale = d3.scaleLinear()
      .domain([0, d3.max(csv_data, d => d.healthcare)])
      .range([height, 0]);

    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    //   append x axis
    var xAxis = svg_group.append("g")
      .classed("x-axis", true)
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    // append y axis
    svg_group.append("g")
      .call(leftAxis);

    // append initial circles
    var circlesGroup = svg_group.selectAll("circle")
      .data(csv_data)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d[x_axis]))
      .attr("cy", d => yLinearScale(d.healthcare))
      .attr("r", 10)
      .attr("fill", "teal")
      .attr("opacity", ".8");

    var circleLabels = svg_group.selectAll(null).
      data(csv_data).enter().append("text");

    circleLabels
      .attr("x", function (d) {
        return xLinearScale(d[x_axis]);
      })
      .attr("y", function (d) {
        return yLinearScale(d.healthcare);
      })
      .text(function (d) {
        return d.abbr;
      })
      .attr("font-family", "sans-serif")
      .attr("font-size", "10px")
      .attr("text-anchor", "middle")
      .attr("fill", "white");


    // Create group for x-axis labels
    var labelsGroup = svg_group.append("g")
      .attr("transform", `translate(${width / 2}, ${height + 20})`);

    var ageLabel = labelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 20)
      .attr("value", "povetry")
      .classed("active", true)
      .text("Age (Median):");

    var povertyLabel = labelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 20)
      .attr("value", "povetry")
      .classed("active", true)
      .text("In Povetry (%):");

    var householdLabel = labelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 40)
      .attr("value", "household")
      .classed("inactive", true)
      .text("Household Income (Median):");

    // append y axis
    svg_group.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .classed("axis-text", true)
      .text("Healthcare");

    var healthcareLabel = labelsGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", 0 - (height / 2))
      .attr("y", 0 - margin.left)
      .attr("dy", "1em")
      .attr("value", "healthcare") // value to grab for event listener
      .classed("axis-text", true)
      .text("Access to Healthcare");

    var obesityLabel = labelsGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", 0 - (height / 2))
      .attr("y", 0 - margin.left + 20)
      .attr("value", "obesity")
      .classed("inactive", true)
      .text("Obesity %");

    var smokeLabel = labelsGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", 0 - (height / 2))
      .attr("y", 0 - margin.left + 40)
      .attr("value", "smoke") // value to grab for event listener
      .classed("inactive", true)
      .text("Smoke (%)");

    // updateToolTip function above csv import
    var circlesGroup = updateToolTip(x_axis, circlesGroup);

    // x axis labels event listener
    labelsGroup.selectAll("text")
      .on("click", function () {
        // get value of selection
        var value = d3.select(this).attr("value");
        if (value !== x_axis) {

          // replaces chosenXAxis with value
          x_axis = value;

          console.log(x_axis)

          // functions here found above csv import
          // updates x scale for new data
          xLinearScale = xScale(csv_data, x_axis);

          // updates x axis with transition
          xAxis = renderAxes(xLinearScale, xAxis);

          // updates circles with new x values
          circlesGroup = renderCircles(circlesGroup, xLinearScale, x_axis);

          // updates tooltips with new info
          circlesGroup = updateToolTip(x_axis, circlesGroup);

          // changes classes to change bold text
          if (x_axis === "age") {
            ageLabel
              .classed("active", true)
              .classed("inactive", false);
            povertyLabel
              .classed("active", true)
              .classed("inactive", false);
            householdLabel
              .classed("active", false)
              .classed("inactive", true);
          }
          else if (x_axis === "income") {
            ageLabel
              .classed("active", true)
              .classed("inactive", false);
            povertyLabel
              .classed("active", false)
              .classed("inactive", true);
            householdLabel
              .classed("active", true)
              .classed("inactive", false);
          }
        else {
          ageLabel
            .classed("active", true)
            .classed("inactive", false);
          povertyLabel
            .classed("active", false)
            .classed("inactive", true);
          householdLabel
            .classed("active", true)
            .classed("inactive", false);
        }
      }
  });
}
