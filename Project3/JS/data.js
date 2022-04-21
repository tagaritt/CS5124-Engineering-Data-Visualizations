// Set the margins
var margin = { top: 60, right: 100, bottom: 20, left: 80 },
    width = 850 - margin.left - margin.right,
    height = 370 - margin.top - margin.bottom;

// Set the ranges
var x = d3.scaleOrdinal.domain([parseMonth("Jan"), parseMonth("Dec")]).range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

// Define the line
var valueLine = d3.line()
    .x(function(d) { return x(d.episode); })
    .y(function(d) { return y(+d.lines); })

// Create the svg canvas in the "graph" div
var svg = d3.select("#graph")
    .append("svg")
    .style("width", width + margin.left + margin.right + "px")
    .style("height", height + margin.top + margin.bottom + "px")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .attr("class", "svg");

// Import the CSV data
d3.csv("stats.csv", function(error, data) {
    if (error) throw error;

    // Format the data
    data.forEach(function(d) {
        d.season = +d.season;
        d.episode = +d.episode;
        d.speaker = d.speaker;
        d.lines = +d.lines;
    });

    var nest = d3.nest()
        .key(function(d) {
            return d.speaker;
        })
        .rollup(function(leaves) {
            var max = d3.max(leaves, function(d) {
                return d.lines
            })
            var season = d3.nest().key(function(d) {
                    return d.season
                })
                .entries(leaves);
            return { max: max, season: season };
        })
        .entries(data)

    // Scale the range of the data
    x.domain(d3.extent(data, function(d) { return d.episode; }));

    // Set up the x axis
    var xaxis = svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .attr("class", "x axis")
        .call(d3.axisBottom(x)
            .ticks(d3.episode)
            .tickSize(0, 0)
            .tickSizeInner(0)
            .tickPadding(10));

    // Create 1st dropdown
    var characterMenu = d3.select("#CharacterList")

    characterMenu
        .append("select")
        .selectAll("option")
        .data(function(d) { return d.Character; })
        .enter()
        .append("option")
        .attr("value", function(d) {
            return d.key;
        })
        .text(function(d) {
            return d.key;
        })

    // Create 2nd dropdown
    var seasonMenu = d3.select("#seasonList")

    seasonMenu
        .data(nest)
        .append("select")
        .selectAll("option")
        .data(function(d) { return d.value.year; })
        .enter()
        .append("option")
        .attr("value", function(d) {
            return d.key;
        })
        .text(function(d) {
            return d.key;
        })


    // Function to create the initial graph
    var initialGraph = function(speaker) {

        // Filter the data to include only fruit of interest
        var selectSpeaker = nest.filter(function(d) {
            return d.key == speaker;
        })

        var selectSpeakers = svg.selectAll(".speakers")
            .data(selectSpeaker, function(d) {
                return d ? d.key : this.key;
            })
            .enter()
            .append("g")
            .attr("class", "speakers")
            .each(function(d) {
                y.domain([0, d.value.max])
            });

        var initialPath = selectSpeakers.selectAll(".line")
            .data(function(d) { return d.value.season; })
            .enter()
            .append("path")

        initialPath
            .attr("d", function(d) {
                return valueLine(d.values)
            })
            .attr("class", "line")

        // Add the Y Axis
        var yaxis = svg.append("g")
            .attr("class", "y axis")
            .call(d3.axisLeft(y)
                .ticks(5)
                .tickSizeInner(0)
                .tickPadding(6)
                .tickSize(0, 0));

        // Add a label to the y axis
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - 60)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("# of Lines")
            .attr("class", "y axis label");

    }

    // Create initial graph
    initialGraph("Michael")


    // Update the data
    var updateGraph = function(speaker) {

        // Filter the data to include only fruit of interest
        var selectSpeaker = nest.filter(function(d) {
            return d.key == speaker;
        })

        // Select all of the grouped elements and update the data
        var selectSpeakers = svg.selectAll(".speakers")
            .data(selectSpeakers)
            .each(function(d) {
                y.domain([0, d.value.max])
            });

        // Select all the lines and transition to new positions
        selectSpeakers.selectAll("path.line")
            .data(function(d) { return d.value.season; },
                function(d) { return d.key; })
            .transition()
            .duration(1000)
            .attr("d", function(d) {
                return valueLine(d.values)
            })

        // Update the Y-axis
        d3.select(".y")
            .transition()
            .duration(1500)
            .call(d3.axisLeft(y)
                .ticks(5)
                .tickSizeInner(0)
                .tickPadding(6)
                .tickSize(0, 0));
    }

    // Run update function when dropdown selection changes
    characterMenu.on('change', function() {

        // Find which fruit was selected from the dropdown
        var selectedSpeaker = d3.select(this)
            .select("select")
            .property("value")

        // Run update function with the selected fruit
        updateGraph(selectedSpeaker)
    });


    // Change color of selected line when year dropdown changes
    seasonMenu.on('change', function() {

        // Find which year was selected
        var selectedSeason = d3.select(this)
            .select("select")
            .property("value")

        // Change the class of the matching line to "selected"
        var selLine = svg.selectAll(".line")
            // de-select all the lines
            .classed("selected", false)
            .filter(function(d) {
                return +d.key === +selectedSeason
            })
            // Set class to selected for matching line
            .classed("selected", true)
            .raise()
    })

})