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
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`)

    // Farben
    const color = d3.scaleOrdinal(d3.schemeCategory10)

    // Daten laden
    d3.json("/dashboard/hourly.json").then(data => {
      // x-domain: alle Datumswerte
      const xDomain = Object.keys(data[0].values).map(d => new Date(d))
      const x = d3.scaleTime()
                  .domain(d3.extent(xDomain))
                  .range([0, width])

      // Transformiere Werte in kumulierte Summe
      data = data.map(d => {
        const keys = Object.keys(d.values).sort()
        let sum = 0
        const values = keys.map(k => {
          sum += d.values[k]
          return { x: new Date(k), y: sum }
        })
        return { name: d.name, values: values }
      })

      // y-Domain bestimmen (gestapelte Summe)
      const yMax = d3.max(data, d => d.values[d.values.length - 1].y)
      const y = d3.scaleLinear()
                  .domain([0, yMax])
                  .range([height, 0])

      // Stack-Generator
      const stack = d3.stack()
                      .keys(data.map(d => d.name))
                      .value((d, key) => {
                        const item = d.find(e => e.name === key)
                        return item ? item.values[item.values.length - 1].y : 0
                      })

      // Area-Generator
      const area = d3.area()
                     .x(d => x(d.data.x))
                     .y0(d => y(d[0]))
                     .y1(d => y(d[1]))

      // Lineare Struktur für gestapelte Area
      const series = data.map(d => d.values.map(v => ({ x: v.x, y: v.y })))
      const stacked = d3.stack()
                        .keys(d3.range(data.length))
                        .value((d, key) => series[key].find(s => s.x.getTime() === d.x.getTime())?.y || 0)
      const xValues = series[0].map(v => ({ x: v.x }))

      const stackedData = stacked(xValues)

      // Area zeichnen
      svg.selectAll(".area")
        .data(stackedData)
        .join("path")
        .attr("class", "area")
        .attr("d", d => area(d))
        .attr("fill", (d, i) => color(data[i].name))

      // x-Achse
      svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%b, %a %d")))

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
    })

  }

}
