// Make API call.
const URLS = [
    'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json',
    'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json'
];
const xhr = new XMLHttpRequest();
xhr.open('GET', URLS[0], true);
xhr.send();
xhr.onload = () => {
    const json = JSON.parse(xhr.responseText);
    const dataset = json;
    console.log(json);
    choroplethMap(dataset);
}

function choroplethMap(dataset){
    // SVG constants.
    const height = 400;
    const width = 800;
    const padding = 60;

    // Create and append SVG.
    const svg = d3.select('.visContainer')
                  .append('svg')
                  .attr('width', width)
                  .attr('height', height);

    // Add title.
    svg.append('text')
       .attr('id', 'title')
       .attr('x', width / 2)
       .attr('y', padding / 2)
       .attr('text-anchor', 'middle')
       .attr('font-size', '25px')
       .text('US Educational Attainment')
}