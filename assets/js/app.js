var svg_Width = 960;
var svg_Height = 500;

var svg_svg_svg_margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svg_Width - svg_margin.left - svg_margin.right;
var height = svg_Height - svg_margin.top - svg_margin.bottom;
// creation of wrapper
var svg = d3
  .select(".chart")
  .append("svg")
  .attr("width", svg_Width)
  .attr("height", svg_Height);

//   append SVG group
  var svg_group = svg.append("g")
  .attr("transform", `translate(${svg_margin.left}, ${svg_margin.top})`);
//   inital params 
var x_axis = "age";
// for updating x_axis on click
function xScale(csv_data, x_axis) {
    // create scales
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(csv_data, d => d[x_axis]) * 0.8,
        d3.max(csv_data, d => d[x_axis]) * 1.2
      ])
      .range([0, width]);
  
    return xLinearScale;