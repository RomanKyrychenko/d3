(function(){		
		
var width = 700;		
var height = 500;		
var mapScale = 4;		
		
var svg2 = d3.select('#map').append('svg')		
    .attr('width', width)		
    .attr('height', height);		
		
var projection = d3.geo.albers()		
    .center([0, 48.5])		
    .rotate([-31.5, 0])		
    .parallels([44, 51])		
    .scale(width * mapScale)		
    .translate([width / 2, height / 2]);		
		
var path = d3.geo.path()		
    .projection(projection);		
		
var colorScale = d3.scale.linear().range(["#f7fcfd", "#00441b"]).interpolate(d3.interpolateLab);		
		
var countryById = d3.map();		
		
var tooltip = d3.select("body")		
  .append("div")		
  .attr("class", "tooltip1");		
		
queue()		
    .defer(d3.json, "Ukraine.json")		
    .defer(d3.csv, "plus.csv", typeAndSet) 		
    .await(loaded);		
		
function typeAndSet(d) {		
    d.plus = +d.plus;		
    countryById.set(d.name, d);		
    return d;		
}		
		
function getColor(d) {		
    var dataRow = countryById.get(d.properties.name);		
    if (dataRow) {		
        return colorScale(dataRow.plus);		
    } else {		
        return "#ccc";		
    }		
}		
		
function getContent(d) {		
  var content;		
  var dataRow = countryById.get(d.properties.name);		
     if (dataRow) {		
         content = "<p class='tooltipTitle'>" + dataRow.name + "</p><p>Пропонована зарплата відносно бажаної: <span class='tooltipText'> " + dataRow.plus + "</span></p>";		
     } else {		
         content = d.properties.name + ": Дані відсутні";		
     }		
     window.setTimeout(function(){		
       update_state_tooltip(d.properties.name)		
     });		
     return content + "<div><div class='usdot'></div> Україна <br> <div class='statedot'></div> " + d.properties.name+ "</div><span class='dotplot_title'>Бажана зарплата</span><span class='dotplot_title'>Порівняно із загальноукраїнським рівнем</span><div id='tooltip_graphs'></div>";		
}		
		
function loaded(error, Ukraine, plus) {		
		
    colorScale.domain(d3.extent(plus, function(d) {return d.plus;}));		
		
    var states = topojson.feature(Ukraine, Ukraine.objects.ukrainer).features;		
		
    svg2.selectAll('path.states')		
        .data(states)		
        .enter()		
        .append('path')		
        .attr("class", function(d){		
		
          var replacedStrings = d.properties.name.replace(" ","_");		
          console.log(replacedStrings);		
          return "states " + replacedStrings;		
        })		
        .attr('d', path)		
        .attr('fill', function(d,i) {		
            return getColor(d);		
        })		
        .on('mouseout.focus', function(d){		
          var replacedStrings = d.properties.name.replace(" ","_");		
          d3.selectAll(".wrapperMapMultiples ." + replacedStrings).classed("hoverFocus",false);		
        })		
        .on('mouseover.focus', function(d){		
          var replacedStrings = d.properties.name.replace(" ","_");		
          d3.selectAll(".wrapperMapMultiples ." + replacedStrings).classed("hoverFocus",true);		
        })		
        .call(d3.helper.tooltip(		
         function(d, i){		
           return getContent(d);		
         }		
         )); 		
		
    var linear = colorScale;		
    svg2.append("g")		
      .attr("class", "legendLinear")		
      .attr("transform", "translate(0,0)");		
		
    var legendLinear = d3.legend.color()		
      .shapeWidth(20)		
      .orient('horizontal')		
      .scale(linear);		
		
    svg2.select(".legendLinear")		
      .call(legendLinear);		
}		
})();
