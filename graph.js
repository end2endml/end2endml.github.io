const nodes = [
  { id: 1, name: "Node 1" },
  { id: 2, name: "Node 2" },
  // ...
];

const links = [
  { source: 1, target: 2 },
  // ...
];

const svg = d3.select("#graph-container")
  .append("svg");

const nodeRadius = 20;
const linkStrokeWidth = 2;
const nodeColor = "#ccc";
const linkColor = "#888";

const width = svg.attr("width");
const height = svg.attr("height");

const xScale = d3.scaleLinear()
  .domain([0, d3.max(nodes, d => d.x || 0)]) // Use your node position data if available
  .range([0, width]);

const yScale = d3.scaleLinear()
  .domain([0, d3.max(nodes, d => d.y || 0)]) // Use your node position data if available
  .range([height, 0]); // Inverted for Y-axis

const nodeGroup = svg.append("g")
  .attr("class", "nodes");

const linkGroup = svg.append("g")
  .attr("class", "links");

nodeGroup.selectAll("circle")
  .data(nodes)
  .enter()
  .append("circle")
  .attr("r", nodeRadius)
  .attr("cx", d => xScale(d.x))
  .attr("cy", d => yScale(d.y))
  .attr("fill", nodeColor)
  .on("click", showPopup);

linkGroup.selectAll("line")
  .data(links)
  .enter()
  .append("line")
  .attr("x1", d => xScale(nodes[d.source].x))
  .attr("y1", d => yScale(nodes[d.source].y))
  .attr("x2", d => xScale(nodes[d.target].x))
  .attr("y2", d => yScale(nodes[d.target].y))
  .attr("stroke", linkColor)
  .attr("stroke-width", linkStrokeWidth);

function showPopup(d) {
  // Create the popup element
  const popup = document.createElement("div");
  popup.classList.add("popup");
  popup.innerHTML = `<h2>${d.name}</h2><p>Your text content...</p>`;

  // Position the popup near the clicked node
  const nodeCenterX = xScale(d.x);
  const nodeCenterY = yScale(d.y);
  popup.style.left = `${nodeCenterX - popup.offsetWidth / 2}px`; // Center horizontally
  popup.style.top = `${nodeCenterY - popup.offsetHeight}px`; // Position above the node

  // Append the popup to the body
  document.body.appendChild(popup);

  // Add click listener to close the popup
  popup.addEventListener("click", closePopup);
}

function closePopup(event) {
  if (event.target === this) { // Ensure click is on the popup itself
    this.remove();
  }
}

nodeGroup.selectAll("circle")
  .data(nodes)
  .enter()
  .append("circle")
  .attr("r", nodeRadius)
  .attr("cx", d => xScale(d.x))
  .attr("cy", d => yScale(d.y))
  .attr("fill", nodeColor)
  .on("click", function(d) {
    showPopup(d);
    d3.event.preventDefault(); // Prevent default browser behavior
  });

document.body.addEventListener("click", function(event) {
  const popup = document.querySelector(".popup");
  if (popup && !popup.contains(event.target)) {
    closePopup();
  }
});