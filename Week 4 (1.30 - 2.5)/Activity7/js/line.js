class Line {

  constructor(_config, _data) {
    this.config = {
      parentElement: _config.parentElement,
      containerWidth: _config.containerWidth || 500,
      containerHeight: _config.containerHeight || 140,
      margin: { top: 10, bottom: 30, right: 50, left: 50 }
    }

    this.data = _data;

    // Call a class function
    this.initVis();
  }

  initVis() {
      
    let vis = this; //this is a keyword that can go out of scope, especially in callback functions, 
                    //so it is good to create a variable that is a reference to 'this' class instance

    //set up the width and height of the area where visualizations will go- factoring in margins               
    vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
    vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;

    //reusable functions for x and y 
        //if you reuse a function frequetly, you can define it as a parameter
        //also, maybe someday you will want the user to be able to re-set it.
    vis.xValue = d => d.year; 
    vis.yValue = d => d.cost;

    //setup scales
    vis.xScale = d3.scaleLinear()
        .domain(d3.extent(vis.data, vis.xValue)) //d3.min(vis.data, d => d.year), d3.max(vis.data, d => d.year) );
        .range([0, vis.width]);

    vis.yScale = d3.scaleLinear()
        .domain( d3.extent(vis.data, vis.yValue) )
        .range([vis.height, 0])
        .nice(); //this just makes the y axes behave nicely by rounding up

    // Define size of SVG drawing area
    vis.svg = d3.select(vis.config.parentElement)
        .attr('width', vis.config.containerWidth)
        .attr('height', vis.config.containerHeight);

    // Append group element that will contain our actual chart (see margin convention)
    vis.chart = vis.svg.append('g')
        .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`);


    // Initialize axes
    vis.xAxis = d3.axisBottom(vis.xScale);
    vis.yAxis = d3.axisLeft(vis.yScale);

    // Append x-axis group and move it to the bottom of the chart
    vis.xAxisG = vis.chart.append('g')
        .attr('class', 'axis x-axis')
        .attr('transform', `translate(0,${vis.height})`)
        .call(vis.xAxis);
    
    // Append y-axis group
    vis.yAxisG = vis.chart.append('g')
        .attr('class', 'axis y-axis')
        .call(vis.yAxis); 

    //TO DO: create an area path

    //first create a helper function : vis.area
    // x should use the x scale created above
    // y should use the y scale created above
    // y0 should use vis.height, since this is the bottom of the chart 

    // Append an area path to your vis.chart.  
    // NOTE:   .data([vis.data])  needs to be structured like this
    //  Set the fill to  '#e9eff5'
    // using the helper function: .attr('d', vis.area);



    //TO DO- create a line path 
    
    // first, initialize line generator helper function : vis.line
    // x should use xScale
    // y should use yScale


    // Append a path to your vis.chart
    // NOTE:   .data([vis.data])  needs to be structured like this
    // stroke should be '#8693a0'
    // fill should be 'none'
    // stroke width should be 2 
    // using the helper function: .attr('d', vis.line);



  }


  //leave this empty for now
 updateVis() { 
   

 }


 //leave this empty for now...
 renderVis() { 

  }



}