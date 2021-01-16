var vals4 = ["danceability", "energy", "speechiness", "acousticness", "instrumentalness", "liveness", "valence"];

var selected1 = []
function ticks4(str) {
    var checked = [];
    d3.selectAll(".tickbox4").selectAll("input").each(function () {
        checked.push(this.checked);
    })


    selected1 = []
    for (let i = 0; i < checked.length; i++) {
        if (checked[i] ) {
            selected1.push(vals4[i]);
        }
    }
    drawPlot4()

}

var df = [];
// Read the data and compute summary statistics for each specie
d3.csv("data.csv", function (data) {

    var df1 = data.map(function (d) {
        return {
            danceability: d.danceability,
            energy: d.energy,
            speechiness: d.speechiness,
            acousticness: d.acousticness,
            instrumentalness: d.instrumentalness,
            liveness: d.liveness,
            valence: d.valence        }
    });
    df.splice(0, df.length, ...df1);
    ticks4()

});


function drawPlot4() {
    // remove last plot
    d3.select("#violinplot").remove()

    // if nothing selected than don't draw
    if(selected1.length === 0) return;

    // set the dimensions and margins of the graph
    var margin4 = {top: 30, right: 30, bottom: 40, left: 50},
        width4 = 500 + 170*selected1.length - margin4.left - margin4.right,
        height4 = 600 - margin4.top - margin4.bottom;


// append the svg object to the body of the page
    var svg = d3.select("#div4")
        .append("svg")
        .attr("id", "violinplot")
        .attr("width", width4 + margin4.left + margin4.right)
        .attr("height", height4 + margin4.top + margin4.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin4.left + "," + margin4.top + ")");

    // Build and Show the Y scale
    var y = d3.scaleLinear()
        .domain([0, 1])          // Y axis is [0,1]
        .range([height4, 0])
    svg.append("g").call(d3.axisLeft(y))

    // Build and Show the X scale.
    var x = d3.scaleBand()
        .range([0, width4])
        .domain(selected1)
        .padding(0.05)     // space between 2 groups. 0 means no padding. 1 is the maximum.
    svg.append("g")
        .attr("transform", "translate(0," + height4 + ")")
        .call(d3.axisBottom(x))
        .style("font-size","16px")

    // Features of the histogram
    var histogram = d3.histogram()
        .domain(y.domain())
        .thresholds(y.ticks(20))
        .value(d => d)


    // Compute the binning for each group of the dataset
    var sumstat = []

    for(i = 0; i<selected1.length; i++){
        sumstat.push({ key: selected1[i], value: histogram(df.map(function (d) {
                return d[selected1[i]]
            }))})
    }


// What is the biggest number of value in a bin? We need it cause this value will have a width of 100% of the bandwidth.
    var maxNum = 0
    for (i in sumstat) {
        allBins = sumstat[i].value
        lengths = allBins.map(function (a) {
            return a.length;
        })
        longuest = d3.max(lengths)
        if (longuest > maxNum) {
            maxNum = longuest
        }
    }

    // The maximum width of a violin must be x.bandwidth = the width dedicated to a group
    var xNum = d3.scaleLinear()
        .range([0, x.bandwidth()])
        .domain([-maxNum, maxNum ])

    // Add the shape to this svg!
    svg
        .selectAll("myViolin")
        .data(sumstat)
        .enter()
        .append("g")
        .attr("transform", function (d) {
            return ("translate(" + x(d.key) + " ,0)")
        })
        .append("path")
        .datum(function (d) {
            return (d.value)
        })
        .style("stroke", "none")
        .style("fill","#0099cc")
        .attr("d", d3.area()
            .x0(function (d) {
                return (xNum(-d.length))
            })
            .x1(function (d) {
                return (xNum(d.length))
            })
            .y(function (d) {
                return (y(d.x0))
            })
            .curve(d3.curveCatmullRom)    // This makes the line smoother to give the violin appearance.
        )

}