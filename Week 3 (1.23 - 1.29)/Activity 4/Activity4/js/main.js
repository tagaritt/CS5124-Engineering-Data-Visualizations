console.log("hello world!");

//---- DRAWING parameters
//	These tell you where to put things.  
const timelineX1 = 50; //the x coordinate where the timeline begins
const timelineX2 = 950;  // the x coordinate where the timeline ens
const startOfTimelinesY = 100; //the y coordinate of the 2017 (the top line)
const gapBetweenTimelines = 25; //how much space to put between lines 

//we will fill this in, based on the data
let minYear = 99999; 
let maxYear = 0; 
let years = [];

d3.csv('data/disasters.csv') //ASYNCHRONOUS LOADING
  .then(data => {
  	console.log('Data loading complete. Work with dataset.');
    console.log(data);

    //process the data - this is a forEach function.  You could also do a regular for loop.... 
    data.forEach(d => { //ARROW function - for each object in the array, pass it as a parameter to this function
      	d.cost = +d.cost; // convert string 'cost' to number
      	d.daysFromYrStart = computeDays(d.start); //note- I just created this field in each object in the array on the fly

		let tokens = d.start.split("-");
  		d.year = +tokens[0];

  		updateMinMaxYear(d.year);
  	});

  	//gotta create an array of years, for labeling.  
  	for(let y = minYear; y <= maxYear; y++){
  		years.push(y); 
  	}

  	console.log(years); //lets see if they are there. 

  	// Add <svg> element (drawing space)
	const svg = d3.select('body').append('svg')
	    .attr('width', 1000)
	    .attr('height', 1100);

	//label the years- use the list of years again
	svg.selectAll("text")
			.data(years)
			.enter()
		.append("text")
			.attr("x", timelineX1 - 50)
			.attr("y", (d) => (2017 - d) * gapBetweenTimelines + startOfTimelinesY )
			.text( (d) => ` ${d}` );

	//TO DO: lines- based on that list of years we generated
	// look at the syntax for adding a new element using d3
	// use the years array, as you did for the year labels above 
	// attributes: 
	//		stroke: black
	//		stroke-width: 2
	//		x1: timelineX1
	//		y1: (2017 - year) * gapBetweenTimelines + startOfTimelinesY)
	//		x2: timelineX2
	//		yr: (2017 - year) * gapBetweenTimelines + startOfTimelinesY)

	svg.selectAll("line")
		.data(years)
		.enter()
	.append("line")
		.attr("x1", timelineX1)
		.attr("y1", (d) => (2017 - d) * gapBetweenTimelines + startOfTimelinesY)
		.attr("x2", timelineX2)
		.attr("y2", (d) => (2017 - d) * gapBetweenTimelines + startOfTimelinesY)
		.attr("stroke", "black")
		.attr("stroke-width", 2);

	// TO DO:  Add circles for each event in the data
	// look at the syntax for adding a new element using d3
	// attributes:  
	//		opacity = .8
	//		radius: d.cost)/165 * (100) + 5  //mapping from domain (cost) to range (pixels)
	//		cx: d.daysFromYrStart/365 * (timelineX2-timelineX1) + timelineX1  //mapping from domain (days) to range (pixels 'x')
	//		cy: (2017 - d.year) * gapBetweenTimelines + startOfTimelinesY ) //mapping from domain (year) to range (pixels 'y')
	//		fill:  
				// if (d.category == "tropical-cyclone") {
				// 	return "#081d58";
				// } else if (d.category == "drought-wildfire") {
				// 	return "#ffffd9";
				// } else if (d.category == "severe-storm") {
				// 	return "#c7e9b4";
				// } else if (d.category == "winter-storm-freeze") {
				// 	return "#081d58";
				// } else if (d.category == "flooding") {
				// 	return "#41b6c4";
				// } else {
				// 	return "#000000";
				// }
		//	stroke: gray
		//	stroke-width: 2

	svg.selectAll("circle")
		.data(years)
		.enter()
	.append("circle")
		.attr("opacity", 0.8)
		.attr("r", (d) => (d/165) + 5)
		.attr("cx", (d) => (d.daysFromYrStart/365) * (timelineX2 - timelineX1) + timelineX1)
		.attr("cy", (d) => (2017 - d) * gapBetweenTimelines + startOfTimelinesY)
		.attr("fill", function(d) {
			if (d.category == "tropical-cyclone"){ return "#081D58"; }
			else if (d.category == "drought-wildfire"){ return "#FFFFD9"; }
			else if (d.category == "severe-storm"){ return "#C7E9B4"; }
			else if (d.category == "winter-storm-freeze"){ return "#081D58"; }
			else if (d.category == "flooding"){ return "#41B6C4"; }
			else { return "#000000"; }
		})
		.attr("stroke", "gray")
		.attr("stroke-width", 2);
  })

  .catch(error => {
    console.error('Error loading the data');
  });

 console.log("When do I execute??");

 function computeDays(disasterDate){
  	let tokens = disasterDate.split("-");

  	let year = +tokens[0];
  	let month = +tokens[1];
  	let day = +tokens[2];

    return (Date.UTC(year, month-1, day) - Date.UTC(year, 0, 0)) / 24 / 60 / 60 / 1000 ;

  }

  function updateMinMaxYear(year){
  	if( year < minYear)
  		minYear = year;
  	if( year > maxYear)
  		maxYear = year;
  	console.log("min year = " + minYear);
  	console.log("max year = " + maxYear);
  }
