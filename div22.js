
function updateScatter() {
    var margin = { top: 10, right: 30, bottom: 30, left: 120 },
        width = 1300 - margin.left - margin.right,
        height = 1500 - margin.top - margin.bottom;


    xval = d3.select("#d22xval").node().value
    yval = d3.select("#d22yval").node().value


    data = dataArray.filter((el) => (!isNaN(el[xval] && !isNaN(el[yval]))))
    if (yval == "duration") {
        yval = "duration_ms"
        data = data.map((track) => {
            return [track,
                track[xval],
                track[yval] / 1000]
        })
    }
    else if (xval == "duration") {
        xval = "duration_ms"
        data = data.map((track) => {
            return [track,
                track[xval] / 1000,
                track[yval]]
        })

    }
    else {
        data = data.map((track) => {
            return [track,
                track[xval],
                track[yval]]
        })
    }
    scatter = d3.select("#d22scatter")
    scatter.selectAll("*").remove()
    svg = scatter
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    svg.append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    xs = data.map((t) => t[1])
    ys = data.map((t) => t[2])
    function padDomain(ax) {
        min = Math.min(...ax)
        max = Math.max(...ax)
        spread = Math.abs(min - max) * 0.1
        return [min - spread, max + spread]
    }
    var x = d3.scaleLinear()
        .domain(padDomain(xs))
        .range([0, width]);
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // Add Y axis
    var y = d3.scaleLinear()
        .domain(padDomain(ys))
        .range([height, 0]);
    svg.append("g")
        .call(d3.axisLeft(y));

    // Add dots
    var dots = svg.selectAll('g')
        .data(data)
        .enter()
        .append("g");

    size = 60
    data.forEach(d => {
        svg.append("defs").append("clipPath").attr("id", "scatterCircle" + d[0].id)
            .append("circle").attr("cx", x(d[1]) + size / 2).attr("cy", y(d[2]) + size / 2).attr("r", size / 2)

    });

    dots.append("svg:image")
        .attr("xlink:href", function (d) { return d[0]["img"] })
        .attr("height", "60")
        .attr("class", "circle")
        .attr("name", (d) => d["title"])
        .attr("clip-path", d => "url(#scatterCircle" + d[0].id + ")")
        .attr("width", size)
        .attr("x", function (d) {
            return x(d[1])
        })
        .attr("y", function (d) {
            return y(d[2])
        })
}