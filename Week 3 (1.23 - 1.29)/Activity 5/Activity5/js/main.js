console.log("Hello world");

d3.csv('data/disasters.csv')
  .then(data => {
  	console.log('Data loading complete. Work with dataset.');
    console.log(data);

    //process the data - this is a forEach function.  You could also do a regular for loop.... 
    data.forEach(d => { //ARROW function - for each object in the array, pass it as a parameter to this function
      	d.cost = +d.cost; // convert string 'cost' to number
      	d.daysFromYrStart = computeDays(d.start); //note- I just created this field in each object in the array on the fly

				let tokens = d.start.split("-");
  			d.year = +tokens[0];

  		// updateMinMaxYear(d.year);
  	});

  	drawChart(data); 

})
.catch(error => {
    console.error('Error loading the data');
});


function drawChart(data){

	console.log("Let's draw a chart!!");
	

	// Margin object with properties for the four directions
	const margin = {top: 40, right: 50, bottom: 10, left: 50};

	// Width and height as the inner dimensions of the chart area
	const width = 1000 - margin.left - margin.right;
	const height = 1100 - margin.top - margin.bottom;

	// Define 'svg' as a child-element (g) from the drawing area and include spaces
	// Add <svg> element (drawing space)
	const svg = d3.select('body').append('svg')
	    .attr('width', width + margin.left + margin.right)
	    .attr('height', height + margin.top + margin.bottom)
	    .append('g')
	    .attr('transform', `translate(${margin.left}, ${margin.top})`);

	// Initialize linear and ordinal scales (input domain and output range)
	//TO DO
	// CREATE an xScale using d3.scaleLinear , with domain 0-365 and range 0-width
	// CREATE a yScale using d3.scaleLinear, with domain [ max year, min year] and range [0, height]  Note- why did I reverse the domain going from max to min? 
	// CREATE an rScale using d3.scaleLinear, with domain the extent of the cost field in data, and range 5, 100

	// Construct a new ordinal scale with a range of ten categorical colours
	const colorPalette = d3.scaleOrdinal(d3.schemeTableau10) //TRY OTHER COLOR SCHEMES.... https://github.com/d3/d3-scale-chromatic
	colorPalette.domain( "tropical-cyclone", "drought-wildfire", "severe-storm", "flooding" );

		// Initialize axes
		//TO DO 
		//  CREATE a top axis (xScale)
		//  CREATE a left axis (yScale)

		//CREATE an xAxisGroup and append it to the SVG
		//CREATE a yAxisGroup and append it to the SVG


		//Add circles for each event in the data
		svg.selectAll('circle')
	    .data(data)
	    .enter()
	  .append('circle')
	  	.attr('fill', 'black' ) //TO DO: use the color palette.  //(d) => colorPalette(d.category) )
	    .attr('opacity', .8)
	    .attr('stroke', "gray")
	    .attr('stroke-width', 2)
	    .attr('r', 10) //TO DO: use the rScale 
	    .attr('cy', 100) // TO DO:  use the yScale 
	    .attr('cx', 100) //TO DO: use the xScale 


}


function computeDays(disasterDate){
  	let tokens = disasterDate.split("-");

  	let year = +tokens[0];
  	let month = +tokens[1];
  	let day = +tokens[2];

    return (Date.UTC(year, month-1, day) - Date.UTC(year, 0, 0)) / 24 / 60 / 60 / 1000 ;

  }