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

  	});

    //for the line chart:
    //lets compute costs per year for the line chart
  	let minYear = d3.min( data, d => d.year);
  	let maxYear = d3.max( data, d=> d.year );

  	let costsPerYear = []; //this will be our data for the line chart
  	for(let i = minYear; i < maxYear; i++){

  		let justThisYear = data.filter( d => d.year == i ); //only include the selected year
  		let cost = d3.sum(justThisYear, d => d.cost); //sum over the filtered array, for the cost field

  		costsPerYear.push( {"year": date, "cost":cost});

  	}


  	// Create an instance (for example in main.js)
		let timelineCircles = new TimelineCircles({
			'parentElement': '#timeline',
			'containerHeight': 1100,
			'containerWidth': 1000
		}, data);


		// TO DO:  Make a line chart object.  Make it 200 pixels tall by 1000 pixels wide. 
		// Be sure to send it the costsPerYear data 
		// The svg for this element has already been created in index.html, above the timeline circles- check it out
		let lineChart = new LineChart({
			'parentElement': '#chart',
			'lineHeight': 200,
			'lineWidth': 1000
		}, data);

})
.catch(error => {
    console.error('Error loading the data');
});


/// OLD VERSION.... 
// function drawChart(data){

// 	console.log("Let's draw a chart!!");
	

// 	// Margin object with properties for the four directions
// 	const margin = {top: 40, right: 50, bottom: 10, left: 50};

// 	// Width and height as the inner dimensions of the chart area
// 	const width = 1000 - margin.left - margin.right;
// 	const height = 1100 - margin.top - margin.bottom;

// 	// Define 'svg' as a child-element (g) from the drawing area and include spaces
// 	// Add <svg> element (drawing space)
// 	const svg = d3.select('body').append('svg')
// 	    .attr('width', width + margin.left + margin.right)
// 	    .attr('height', height + margin.top + margin.bottom)
// 	    .append('g')
// 	    .attr('transform', `translate(${margin.left}, ${margin.top})`);

// 	// Initialize linear and ordinal scales (input domain and output range)
// 	const xScale = d3.scaleLinear()
// 		.domain([0, 365])
// 		.range([0, width]);

// 	console.log(d3.min(data, d => d.year) );

// 	const yScale = d3.scaleLinear()
// 		.domain([d3.max(data, d => d.year), d3.min( data, d => d.year)]) 
// 		.range([0, height]);

// 	const rScale = d3.scaleLinear()
// 		.domain(d3.extent(data, d=> d.cost))
// 		.range([5, 100]);

// 	// Construct a new ordinal scale with a range of ten categorical colours
// 	let colorPalette = d3.scaleOrdinal(d3.schemeTableau10)
// 	colorPalette.domain( "tropical-cyclone", "drought-wildfire", "severe-storm", "flooding" );

// 		// Initialize axes
// 		const xAxis = d3.axisTop(xScale);
// 		const yAxis = d3.axisLeft(yScale);

// 		// Draw the axis
// 		const xAxisGroup = svg.append('g')
// 		  .attr('class', 'axis x-axis') 
// 		  .call(xAxis);

// 		const yAxisGroup = svg.append('g')
// 		  .attr('class', 'axis y-axis')
// 		  .call(yAxis);

// 		//Add circles for each event in the data
// 	svg.selectAll('circle')
// 	    .data(data)
// 	    .enter()
// 	  .append('circle')
// 	  	.attr('fill', (d) => colorPalette(d.category) )
// 	    .attr('opacity', .8)
// 	    .attr('stroke', "gray")
// 	    .attr('stroke-width', 2)
// 	    .attr('r', (d) => rScale(d.cost) ) 
// 	    .attr('cy', (d) => yScale(d.year) ) 
// 	    .attr('cx',(d) =>  xScale(d.daysFromYrStart) );


// }

function computeDays(disasterDate){
  	let tokens = disasterDate.split("-");

  	let year = +tokens[0];
  	let month = +tokens[1];
  	let day = +tokens[2];

    return (Date.UTC(year, month-1, day) - Date.UTC(year, 0, 0)) / 24 / 60 / 60 / 1000 ;

  }