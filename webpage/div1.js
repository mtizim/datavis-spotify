d3.csv("data.csv", function (track) {
    box = d3.select("#div1")

    box.select("#div1" + track["whose"]).append("a")
        .attr("href", track["link"])
        .append("img")
        .attr("class", "track")
        .attr("title", track["name"])
        .attr("src", track["img"])
        .attr("alt", track["name"]);
});
