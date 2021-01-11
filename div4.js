// set the dimensions and margins of the graph
var margin4 = {top: 10, right: 30, bottom: 30, left: 40},
    width4 = 900 - margin4.left - margin4.right,
    height4 = 600 - margin4.top - margin4.bottom;



var selected1 = []
function ticks4(str) {
    var checked = [];
    d3.selectAll(".tickbox4").selectAll("input").each(function (e) {
        checked.push(this.checked);
    })
    //console.log(checked);


    selected1 = []
    for (let i = 0; i < checked.length; i++) {
        if (checked[i]) {
            selected1.push(vals[i]);
        };
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
            loudness: d.loudness,
            speechiness: d.speechiness,
            acousticness: d.acousticness,
            instrumentalness: d.instrumentalness,
            liveness: d.liveness,
            valence: d.valence,
            tempo: d.tempo,
            duration_ms: d.duration_ms
        }
    });
    df.splice(0, df.length, ...df1);
    console.log(df);
    ticks4()

});

console.log(df);

function drawPlot4() {
    console.log(selected1);

    d3.select("#violinplot").remove()




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
        .domain([0, 1])          // Note that here the Y scale is set manually
        .range([height4, 0])
    svg.append("g").call(d3.axisLeft(y))

    // Build and Show the X scale. It is a band scale like for a boxplot: each group has an dedicated RANGE on the axis. This range has a length of x.bandwidth
    var x = d3.scaleBand()
        .range([0, width4])
        .domain(selected1)
        .padding(0)     // This is important: it is the space between 2 groups. 0 means no padding. 1 is the maximum.
    svg.append("g")
        .attr("transform", "translate(0," + height4 + ")")
        .call(d3.axisBottom(x))

    // Features of the histogram
    var histogram = d3.histogram()
        .domain(y.domain())
        .thresholds(y.ticks(20))    // Important: how many bins approx are going to be made? It is the 'resolution' of the violin plot
        .value(d => d)


    // Compute the binning for each group of the dataset
    var sumstat = []

    for(i = 0; i<selected1.length; i++){
        sumstat.push({ key: selected1[i], value: histogram(df.map(function (d) {
                return d[selected1[i]]
            }))})
    }

    console.log(sumstat);




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
        .domain([-maxNum -1, maxNum+1])

    // Add the shape to this svg!
    svg
        .selectAll("myViolin")
        .data(sumstat)
        .enter()        // So now we are working group per group
        .append("g")
        .attr("transform", function (d) {
            return ("translate(" + x(d.key) + " ,0)")
        }) // Translation on the right to be at the group position
        .append("path")
        .datum(function (d) {
            return (d.value)
        })     // So now we are working bin per bin
        .style("stroke", "none")
        .style("fill", "#6666ff")
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
            .curve(d3.curveCatmullRom)    // This makes the line smoother to give the violin appearance. Try d3.curveStep to see the difference
        )

}