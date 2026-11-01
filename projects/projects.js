import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';
const projects = await fetchJSON('../lib/projects.json');
const projectsContainer = document.querySelector('.projects');
const projectsTitle = document.querySelector('.projects-title');
projectsTitle.textContent = `${projects.length} Projects`
renderProjects(projects, projectsContainer, 'h2');


let SVG = d3.select('#projects-plot');
function renderPieChart(projectsGiven) {
    let rolledData = d3.rollups(
        projectsGiven,
        (v) => v.length,
        (d) => d.year,
    );
    rolledData.sort((a, b) => b[0] - a[0]);
    let data = rolledData.map(([year, count]) => {
        return { value: count, label: year };
    });
    let colors = d3.scaleOrdinal(d3.schemeTableau10);

    let sliceGenerator = d3.pie().value((d) => d.value);
    let arcData = sliceGenerator(data);
    let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
    let arcs = arcData.map((d) => arcGenerator(d));

    SVG.selectAll('path').remove();
    let selectedIndex = -1;
    arcs.forEach((arc, idx) => {
        SVG
        .append('path')
        .attr('d', arc)
        .attr('fill', colors(idx))
        .on('click', () => {
            selectedIndex = selectedIndex === idx ? -1 : idx;
            if (selectedIndex === -1) {
                renderProjects(projects, projectsContainer, 'h2');
            } else {
                const selectedYear = data[selectedIndex].label;
                const filteredByYear = projectsGiven.filter((p) => p.year === selectedYear);
                renderProjects(filteredByYear, projectsContainer, 'h2');
            }
            SVG
            .selectAll('path')
            .attr('class', (_, idx) => (
                idx === selectedIndex ? 'selected' : null
            ));

            legend
            .selectAll('li')
            .classed('selected', (_, idx) => idx === selectedIndex);
        });
    });

    let legend = d3.select('.legend');
    legend.selectAll('li').remove();
    data.forEach((d, idx) => {
    legend
        .append('li')
        .attr('class', 'legend-list')
        .attr('style', `--color:${colors(idx)}`)
        .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`);
    });
};

renderPieChart(projects);
let query = '';
let searchInput = document.querySelector('.searchBar');

searchInput.addEventListener('input', (event) => {
    query = event.target.value;
    let filteredProjects = projects.filter((project) => {
        let values = Object.values(project).join('\n').toLowerCase();
        return values.includes(query.toLowerCase());
    });
    if (filteredProjects.length === 0) {
        SVG.selectAll('path').remove();
    }
    renderProjects(filteredProjects, projectsContainer, 'h2');
    renderPieChart(filteredProjects);
});