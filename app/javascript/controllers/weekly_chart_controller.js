import { Controller } from "@hotwired/stimulus"
import * as d3 from "d3"

export default class extends Controller {
  connect() {
    const margin = { top: 20, right: 0, bottom: 35, left: 50 }
    const width = this.element.clientWidth - margin.left - margin.right
    const height = 200 - margin.top - margin.bottom

    const svg = d3.select(this.element)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`)

    const color = d3.scaleOrdinal(d3.schemeCategory10)

    d3.json("/dashboard/weekly.json").then(data => {
      color.domain(data.map(d => d.name))

      // 🔹 Alle Datums-Keys sammeln (STRING!)
      const dateKeys = Array.from(
        new Set(data.flatMap(d => Object.keys(d.values)))
      ).sort()

      // 🔹 Mapping Key → Date
      const dates = dateKeys.map(k => new Date(k))

      // 🔹 Stack-kompatible Datenstruktur
      const stackedInput = []

    dateKeys.forEach(key => {
    const weekStart = new Date(key)
    const weekEnd = d3.timeWeek.offset(weekStart, 1) // +1 Woche

  ;[weekStart, weekEnd].forEach(date => {
    const row = { x: date }
    data.forEach(d => {
      row[d.name] = d.values[key] ?? 0
    })
    stackedInput.push(row)
  })
})

      const stack = d3.stack()
        .keys(data.map(d => d.name))

      const stackedData = stack(stackedInput)

      const y = d3.scaleLinear()
        .domain([0, d3.max(stackedData.at(-1), d => d[1])])
        .range([height, 0])

      const x = d3.scaleTime()
        .domain(d3.extent(stackedInput, d => d.x))
  .range([0, width])

      const area = d3.area()
        .x(d => x(d.data.x))
        .y0(d => y(d[0]))
        .y1(d => y(d[1]))

      // 🔹 Zeichnen
      svg.selectAll(".area")
        .data(stackedData)
        .join("path")
        .attr("class", "area")
        .attr("d", area)
        .attr("fill", d => color(d.key))

      // Achsen
      svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%W")))

      svg.append("g")
        .call(d3.axisLeft(y))

      // Labels
      svg.append("text")
        .attr("transform", `translate(${width / 2},${height + margin.bottom})`)
        .style("text-anchor", "middle")
        .attr("fill", "#777")
        .text("week number")

      svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("fill", "#777")
        .style("text-anchor", "middle")
        .text("amount / week")

        svg.selectAll("circle.debug")
  .data(stackedInput)
  .join("circle")
  .attr("class", "debug")
  .attr("cx", d => x(d.x))
  .attr("cy", height - 2)
  .attr("r", 4)
  .attr("fill", "red")

    })
  }
}
