import { Controller } from "@hotwired/stimulus"
import * as d3 from "d3"

export default class extends Controller {
  connect() {
    const margin = {
	    top: 20,
	    right: 0,
	    bottom: 35,
	    left: 50
	  }

    //const containerWidth = this.element.clientWidth

    const width = 1250//containerWidth - margin.left - margin.right
    const height = 200 - margin.top - margin.bottom

    const svg = d3.select(this.element)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom + 30) //+30 for legend further down
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`)

    // Farben
    const color = d3.scaleOrdinal(d3.schemeCategory10)

    // Daten laden
    d3.json("/dashboard/hourly.json").then(data => {

    const categories = data.map(d => d.name)

    const dateKeys = Array.from(
      new Set(data.flatMap(d => Object.keys(d.values)))
    ).sort()

    const cumulativeByCategory = {}

    data.forEach(d => {
      let sum = 0
      cumulativeByCategory[d.name] = {}
      dateKeys.forEach(k => {
        sum += d.values[k] ?? 0
        cumulativeByCategory[d.name][k] = sum
      })
    })

    const stackedInput = dateKeys.map(k => {
      const row = { x: new Date(k) }
      categories.forEach(c => row[c] = cumulativeByCategory[c][k])
      return row
    })
    const stack = d3.stack().keys(categories)
    const stackedData = stack(stackedInput)
    const x = d3.scaleTime()
      .domain(d3.extent(stackedInput, d => d.x))
      .range([0, width])

    const y = d3.scaleLinear()
      .domain([0, d3.max(stackedData.at(-1), d => d[1])])
      .range([height, 0])
    const area = d3.area()
      .x(d => x(d.data.x))
      .y0(d => y(d[0]))
      .y1(d => y(d[1]))
    svg.selectAll(".area")
      .data(stackedData)
      .join("path")
      .attr("class", "area")
      .attr("d", area)
      .attr("fill", d => color(d.key))
    const labels = svg.append("g").attr("class", "labels")

    stackedData.forEach(series => {
      labels.selectAll(`.label-${series.key}`)
        .data(series)
        .enter()
        .append("text")
        .attr("x", d => x(d.data.x))
        .attr("y", d => (y(d[0]) + y(d[1])) / 2)
        .attr("dy", "0.35em")
        .attr("text-anchor", "middle")
        .style("font-size", "10px")
        .style("fill", "#333")
        .text(d => {
          const v = d[1] - d[0]  // <- tatsächlicher Segmentwert (nicht kumulativ)
          return v > 0 ? v : ""
        })
    })

    // x-Achse
    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%a, %b %d")))

    // y-Achse
    svg.append("g")
      .call(d3.axisLeft(y))
    // Achsenbeschriftung
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("fill", "#777")
      .style("text-anchor", "middle")
      .text("cumulative amount")

    // Legend
    const legend = svg.append("g")
      .attr("class", "legend")
      .attr("transform", `translate(0, ${height + 30})`);

    const legendItem = legend.selectAll(".legend-item")
      .data(color.domain())
      .enter()
      .append("g")
      .attr("class", "legend-item")
      .attr("transform", (d, i) => `translate(${i * 120}, 0)`);

    legendItem.append("rect")
      .attr("width", 14)
      .attr("height", 14)
      .attr("fill", d => color(d));

    legendItem.append("text")
      .attr("x", 20)
      .attr("y", 12)
      .style("font-size", "12px")
      .style("fill", "#555")
      .text(d => d);
    })
  }
}
