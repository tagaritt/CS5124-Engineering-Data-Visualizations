class TimelineCircles {

  constructor(_config, _data) {
    this.config = {
      parentElement: _config.parentElement,
      containerWidth: _config.containerWidth || 500,
      containerHeight: _config.containerHeight || 140,
      margin: {top: 40, right: 50, bottom: 10, left: 50}
    }

    this.data = _data; 

    this.initVis();
  }

  initVis() {
      //setting up the chart- things that won't need to update on user actions

      console.log("Let's draw a chart!!");

      // I recommend avoiding simply using the this keyword within complex class code
      // involving SVG elements because the scope of this will change and it will cause
      // undesirable side-effects. Instead, we recommend creating another variable at
      // the start of each function to store the this-accessor
      let vis = this; 
  

      // Width and height as the inner dimensions of the chart area- as before
      vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
      vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;

      // Define 'svg' as a child-element (g) from the drawing area and include spaces
      // Add <svg> element (drawing space)
      vis.svg = d3.select(vis.config.parentElement)
          .attr('width', vis.config.containerWidth)
          .attr('height', vis.config.containerHeight)

      vis.chart = vis.svg.append('g')
          .attr('transform', `translate(${vis.config.margin.left}, ${vis.config.margin.top})`);

      // Initialize linear and ordinal scales (input domain and output range)
      vis.xScale = d3.scaleLinear()
        .domain([0, 365])
        .range([0, vis.width]);


      vis.yScale = d3.scaleLinear()
        .domain([d3.max(vis.data, d => d.year), d3.min( vis.data, d => d.year)]) 
        .range([0, vis.height]);


      vis.rScale = d3.scaleLinear()
        .domain(d3.extent(vis.data, d=> d.cost))
        .range([5, 100]);


      // Construct a new ordinal scale with a range of ten categorical colours
      vis.colorPalette = d3.scaleOrdinal(d3.schemeTableau10);
      vis.colorPalette.domain( "tropical-cyclone", "drought-wildfire", "severe-storm", "flooding" );


        // Initialize axes
        vis.xAxis = d3.axisTop(vis.xScale);
        vis.yAxis = d3.axisLeft(vis.yScale);


        // Draw the axis
        vis.xAxisGroup = vis.chart.append('g')
          .attr('class', 'axis x-axis') 
          .call(vis.xAxis);

        vis.yAxisGroup = vis.chart.append('g')
          .attr('class', 'axis y-axis')
          .call(vis.yAxis);

        //Add circles for each event in the data
      vis.chart.selectAll('circle')
          .data(vis.data)
          .enter()
        .append('circle')
          .attr('fill', (d) => vis.colorPalette(d.category) )
          .attr('opacity', .8)
          .attr('stroke', "gray")
          .attr('stroke-width', 2)
          .attr('r', (d) => vis.rScale(d.cost) ) 
          .attr('cy', (d) => vis.yScale(d.year) ) 
          .attr('cx',(d) =>  vis.xScale(d.daysFromYrStart) );


      //updateVis(); //call updateVis() at the end - we aren't using this yet. 
  }

 updateVis() {

   
   renderVis(); 

 }

 renderVis() { 

  }



}