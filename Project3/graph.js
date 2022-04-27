var margin = { top: 10, right: 30, bottom: 30, left: 60 },
    width = 600 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;
var selectedOption = "Jim",
    selectedOption1 = 1;
// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

//Read the data
d3.csv("Data/CSV/stats.csv", function(data) {
    // List of groups (here I have one group per column)
    var allGroup = d3.map(data, function(d) { return (d.name) }).keys()
    console.log("output: " + allGroup);
    var allSeason = d3.map(data, function(d) { return (d.season) }).keys()
    console.log("output: " + allSeason);
    // add the options to the button
    d3.select("#selectButton")
        .selectAll('myOptions')
        .data(allGroup)
        .enter()
        .append('option')
        .text(function(d) { return d; }) // text showed in the menu
        .attr("value", function(d) { return d; }) // corresponding value returned by the button

    d3.select("#selectButton1")
        .selectAll('myOptions')
        .data(allSeason)
        .enter()
        .append('option')
        .text(function(d) { return d; }) // text showed in the menu
        .attr("value", function(d) { return d; }) // corresponding value returned by the button

    // A color scale: one color for each group
    var myColor = d3.scaleOrdinal()
        .domain(allGroup)
        .range(d3.schemeSet2);

    // Add X axis --> it is a date format
    var x = d3.scaleLinear()
        .domain([1, 6])
        .range([0, width]);
    var xAxis = d3.axisBottom().scale(x);
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).ticks(7))
        .attr("class", "myXaxis");

    // Add Y axis
    var y = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) { return +d.lines; })])
        .range([height, 0]);
    var yAxis = d3.axisLeft().scale(y);
    svg.append("g")
        .call(d3.axisLeft(y))
        .attr("class", "myYaxis");

    // Initialize line with first group of the list
    var line = svg
        .append('g')
        .append("path")
        .datum(data.filter(function(d) { return d.name == selectedOption && d.season == selectedOption1 }))
        .attr("d", d3.line()
            .x(function(d) { return x(d.episode) })
            .y(function(d) { return y(+d.lines) })
        )
        .attr("stroke", function(d) { return myColor("valueA") })
        .style("stroke-width", 4)
        .style("fill", "none")

    // A function that update the chart
    function update(selectedGroup, selectedGroup1) {

        // Create new data with the selection?
        var dataFilter = data.filter(function(d) {
            if (d.name == selectedGroup && d.season == selectedGroup1) {
                return d;
            }
        })

        x.domain([1, d3.max(dataFilter, function(d) { return d.episode })]);
        svg.selectAll(".myXaxis").transition()
            .duration(30)
            .call(xAxis);

        // create the Y axis
        y.domain([0, d3.max(dataFilter, function(d) { return d.lines })]);
        svg.selectAll(".myYaxis")
            .transition()
            .duration(30)
            .call(yAxis);

        // Give these new data to update line
        line
            .datum(dataFilter)
            .transition()
            .duration(1000)
            .attr("d", d3.line()
                .x(function(d) { return x(d.episode) })
                .y(function(d) { return y(+d.lines) })
            )
            .attr("stroke", function(d) { return myColor(selectedGroup) })
    }

    // When the button is changed, run the updateChart function
    d3.select("#selectButton").on("change", function(d) {
        // recover the option that has been chosen
        selectedOption = d3.select(this).property("value");
        // run the updateChart function with this selected option
        update(selectedOption, selectedOption1);
        console.log("Selecting for Character: " + selectedOption + " and season: " + selectedOption1);
    });

    d3.select("#selectButton1").on("change", function(d) {
        // recover the option that has been chosen
        selectedOption1 = d3.select(this).property("value");
        // run the updateChart function with this selected option
        update(selectedOption, selectedOption1);
        console.log("Selecting for Character: " + selectedOption + " and season: " + selectedOption1);
    })


})