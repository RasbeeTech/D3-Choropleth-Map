// Make API calls.
const education = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json';
const counties = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json';

d3.queue()
  .defer(d3.json, education)
  .defer(d3.json, counties)
  .await(choroplethMap);

function choroplethMap(error, education, counties){
    if (error) {
        throw error;
    }
    
    // SVG constants.
    const height = 600;
    const width = 1000;
    const padding = 60;

    // Coolor Scale.
    const color = d3.scaleThreshold()
                    .domain(d3.range(2.6, 75.1, (75.1 - 2.6) / 8))
                    .range(d3.schemeGreens[9])

    // Path.
    let path = d3.geoPath();
    
    // Tooltip.
    const tooltip = d3.select('.visContainer')
                      .append('div')
                      .attr('id', 'tooltip')
                      .style('opacity', 0);
    
    // Create and append SVG.
    const svg = d3.select('.visContainer')
                  .append('svg')
                  .attr('width', width)
                  .attr('height', height);

    // Create Map.
    svg.append('g')
       .attr('class', 'counties')
       .selectAll('path')
       .data(topojson.feature(counties, counties.objects.counties).features)
       .enter()
       .append('path')
       .attr('class', 'county')
       .attr('data-fips',(d) => d.id)
       .attr('fill', (d) => {
            let result = education.filter((obj) => obj.fips === d.id);
            console.log(result[0])
            if (result[0]) {return color(result[0].bachelorsOrHigher);}

            return color(0);
        })
        .attr('data-education', (d) => {
            let result = education.filter((obj) => obj.fips === d.id);

            if (result[0]) {return result[0].bachelorsOrHigher;}

            return 0;
        })
        .attr('d', path)
        .on('mouseover', (d) => {
            tooltip.transition().duration(200).style('opacity', 0.9);
            tooltip
                   .html(() => {
                       let result = education.filter((obj) => obj.fips === d.id);
                       if (result[0]) {
                        return (
                          result[0]['area_name'] +
                          ', ' +
                          result[0]['state'] +
                          ': ' +
                          result[0].bachelorsOrHigher +
                          '%'
                        );
                      }
                      return 0
                   })
                   .attr('data-education',() => {
                        let result = education.filter((obj) => obj.fips === d.id);
                        if (result[0]) {return result[0].bachelorsOrHigher;}
                        return 0;
                   })
                   .style('left', d3.event.pageX + 10 + 'px')
                   .style('top', d3.event.pageY - 28 + 'px');
        })
        .on('mouseout', () => {
            tooltip.transition().duration(200).style('opacity', 0);
        });
    
    // Legend.
    const keys = [2.6, 20.75, 38.87, 56, 75.1];
    const legendContainer = svg.append('g').attr('id', 'legend');
    legendContainer.selectAll('rect')
                   .data(keys)
                   .enter()
                   .append('rect')
                   .attr('x', (d, i) => i * 30 + padding * 10)
                   .attr('y', padding / 2)
                   .attr('width', 30)
                   .attr('height', 10)
                   .style('fill', (d) => color(d));
    
    const legendXAxisScale = d3.scaleLinear()
                               .domain(d3.extent(keys))
                               .range([padding * 10, padding * 10 + 150]);
                               
    const legendXAxis = d3.axisBottom(legendXAxisScale);

    legendContainer.append('g')
                   .attr(
                    'transform', 
                    'translate(0' + 
                    ', ' + (padding / 2 + 10) +
                    ')'
                   )
                   .call(legendXAxis);
    
        
}