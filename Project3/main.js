let character_selection = document.querySelector('#character');
let character_result = document.querySelector('#display_character');

character_selection.addEventListener('change', () => {
    character_result.innerText = character_selection.options[character_selection.selectedIndex].text;
});

let season_selection = document.querySelector('#season');
let season_result = document.querySelector('#display_season');

season_selection.addEventListener('change', () => {
    season_result.innerText = season_selection.options[season_selection.selectedIndex].text;
});

var fileName = "./Data/CSV/stats.csv";
var showInfo = ["season", "episode", "title", "scene", "speaker", "line"];
var episodeInfo = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30"];

d3.csv(fileName, function (error, data) {
    var characterMap = {};
    data.forEach(function (d) {
        console.log("Character Result: " + d.speaker);
        if (d.speaker == "Jim") {
            var speaker = d.speaker;
            //Needs to check if speaker is already in characterMap
            characterMap[speaker] = [];
            //console.log(data);
        }
        // { cerealName: [ bar1Val, bar2Val, ... ] }
        episodeInfo.forEach(function (field) {
            characterMap[speaker].push(+d[field]);
        });

    });
    data.filter(function (d) { return d.speaker == "Jim" })
    console.log(data);
    makeVis(characterMap);
});

var makeVis = function (characterMap) {
    // Define dimensions of vis
    var margin = { top: 30, right: 50, bottom: 30, left: 50 },
        width = 550 - margin.left - margin.right,
        height = 250 - margin.top - margin.bottom;

    // Make x scale
    var xScale = d3.scale.ordinal()
        .domain(episodeInfo)
        .rangeRoundBands([0, width], 0.1);

    // Make y scale, the domain will be defined on bar update
    var yScale = d3.scale.linear()
        .range([height, 0]);

    // Create canvas
    var canvas = d3.select("#vis-container")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Make x-axis and add to canvas
    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom");

    canvas.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    // Make y-axis and add to canvas
    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left");

    var yAxisHandleForUpdate = canvas.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    yAxisHandleForUpdate.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Value");

    var updateBars = function (data) {
        // First update the y-axis domain to match data
        yScale.domain(d3.extent(data));
        yAxisHandleForUpdate.call(yAxis);

        var bars = canvas.selectAll(".bar").data(data);

        // Add bars for new data
        bars.enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", function (d, i) { return xScale(episodeInfo[i]); })
            .attr("width", xScale.rangeBand())
            .attr("y", function (d, i) { return yScale(d); })
            .attr("height", function (d, i) { return height - yScale(d); });

        // Update old ones, already have x / width from before
        bars
            .transition().duration(250)
            .attr("y", function (d, i) { return yScale(d); })
            .attr("height", function (d, i) { return height - yScale(d); });

        // Remove old ones
        bars.exit().remove();
    };

    // Handler for dropdown value change
    var dropdownChange = function () {
        var newCharacter = d3.select(this).property('value'),
            newData = characterMap[newCharacter];

        updateBars(newData);
    };

    // Get names of cereals, for dropdown
    var characters = Object.keys(characterMap).sort();

    var dropdown = d3.select("#vis-container")
        .insert("select", "svg")
        .on("change", dropdownChange);

    dropdown.selectAll("option")
        .data(characters)
        .enter().append("option")
        .attr("value", function (d) { return d; })
        .text(function (d) {
            return d[0].toUpperCase() + d.slice(1, d.length); // capitalize 1st letter
        });

    var initialData = characterMap[characters[0]];
    updateBars(initialData);
};