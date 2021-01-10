d3.csv("data.csv", function (track) {

    d3.select("#div1").append("a")
        .attr("href", track["link"])
        .append("img")
        .attr("class", "track")

        .attr("src", track["img"])
        .attr("alt", track["name"]);
});