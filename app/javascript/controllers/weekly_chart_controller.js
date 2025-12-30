import { Controller } from "@hotwired/stimulus"
import * as d3 from "d3"

export default class extends Controller {
  connect() {
    const margin = { top: 20, right: 0, bottom: 35, left: 50 }
    const width = 1250//this.element.clientWidth - margin.left - margin.right
    const height = 200 - margin.top - margin.bottom

    const svg = d3.select(this.element)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom + 30) // +30 for legend further down
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`)

    const color = d3.scaleOrdinal(d3.schemeCategory10)

    d3.json("/dashboard/weekly.json").then(data => {
      color.domain(data.map(d => d.name))

      //Alle Datums-Keys sammeln (STRING!)
      const dateKeys = Array.from(
        new Set(data.flatMap(d => Object.keys(d.values)))
      ).sort()

      //Mapping Key → Date
      const dates = dateKeys.map(k => new Date(k))

      //Stack-kompatible Datenstruktur
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

      //Zeichnen
      svg.selectAll(".area")
        .data(stackedData)
        .join("path")
        .attr("class", "area")
        .attr("d", area)
        .attr("fill", d => color(d.key))

      // Achsen
      const weekCenters = dateKeys.map(k => {
        const start = new Date(k)
        return d3.timeDay.offset(start,3) // Mitte der Woche (Mo+3 ≈ Do)
      })

      svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(
          d3.axisBottom(x)
          .tickValues(weekCenters)
          .tickFormat(d3.timeFormat("%V")))

      svg.append("g")
        .call(d3.axisLeft(y)
        .ticks(y.domain()[1])        // ungefähr so viele Ticks wie Max-Wert
        .tickFormat(d3.format("d")) // Integer ohne Dezimalstellen
      ) 

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

      // --- Stack value labels ---
      const labelGroup = svg.append("g")
        .attr("class", "stack-labels");

      stackedData.forEach(series => {
        labelGroup.selectAll(`.label-${series.key}`)
        .data(series.filter((_, i) => i % 2 === 0))
        .enter()
        .append("text")
        .attr("class", `stack-label label-${series.key.replace(/\s+/g, "-")}`)
        .attr("x", (d, i, nodes) => {
          const curr = d.data.x;
          const next = nodes[i + 1]?.__data__?.data?.x;
          if (next) {
            return (x(curr) + x(next)) / 2;
          }
          // letzter Punkt: halbe Segmentbreite nach rechts
          const prev = nodes[i - 1]?.__data__?.data?.x;
          if (prev) {
            const segmentWidth = x(curr) - x(prev);
            return x(curr) + segmentWidth / 2;
          }
          return x(curr);
        })
        .attr("y", d => (y(d[0]) + y(d[1])) / 2)
        .attr("dy", "0.35em")
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .style("fill", "#fff")
        .style("pointer-events", "none")
        .text(d => {
          const v = d[1] - d[0];
          return v > 0 ? v : "";
        });
      });
    })
  }
}
