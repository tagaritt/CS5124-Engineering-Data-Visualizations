console.log("Hello world");
let data, timelineCircles;

d3.csv('data/disasters.csv')
  .then(_data => {
  	console.log('Data loading complete. Work with dataset.');
  	data = _data;
    console.log(data);

    //process the data - this is a forEach function.  You could also do a regular for loop.... 
    data.forEach(d => { //ARROW function - for each object in the array, pass it as a parameter to this function
      	d.cost = +d.cost; // convert string 'cost' to number
      	d.daysFromYrStart = computeDays(d.start); //note- I just created this field in each object in the array on the fly
        d.name = +d.name;
				let tokens = d.start.split("-");
  			d.year = +tokens[0];

  	});

  	// Create an instance (for example in main.js)
		timelineCircles = new TimelineCircles({
			'parentElement': '#timeline',
			'containerHeight': 1100,
			'containerWidth': 1000
		}, data);

})
.catch(error => {
    console.error('Error loading the data');
});


/**
 * Event listener: use color legend as filter
 */
d3.selectAll('.legend-btn').on('click', function() {
  console.log("button! ");
  // Toggle 'inactive' class
  d3.select(this).classed('inactive', !d3.select(this).classed('inactive'));
  
  // Check which categories are active
  let selectedCategory = [];
  d3.selectAll('.legend-btn:not(.inactive)').each(function() {
    selectedCategory.push(d3.select(this).attr('category'));
  });

  // Filter data accordingly and update vis
  timelineCircles.data = data.filter(d => selectedCategory.includes(d.category)) ;
  timelineCircles.updateVis();

});

function computeDays(disasterDate){
  	let tokens = disasterDate.split("-");

  	let year = +tokens[0];
  	let month = +tokens[1];
  	let day = +tokens[2];

    return (Date.UTC(year, month-1, day) - Date.UTC(year, 0, 0)) / 24 / 60 / 60 / 1000 ;

  }