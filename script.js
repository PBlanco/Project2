$(document).ready(function() {
d3.json("data.json", function(error,unfiltered_data) {

     var colors = {};
     var x1 = new Date("01/01/1990");
     var x2 = new Date("04/01/2014");

     var y1 = d3.min(unfiltered_data, function(entry) { return +entry["Temp 1"]; });
     var y2 = d3.max(unfiltered_data, function(entry) { return +entry["Temp 1"]; });

     var svgXlen = 1050;
     var svgYlen = 800;
     var xPadding = 50;
     var yPadding = 20;
     
     //create the svg 
     var svg = d3.select("#canvas").append("svg").attr("height", svgYlen).attr("width", svgXlen);

     var xScale = d3.time.scale().domain([x1, x2]).range([xPadding, svgXlen - xPadding]);
     var yScale = d3.scale.linear().domain([y1,y2]).range([svgYlen-yPadding, yPadding]);

     var data = [];
     unfiltered_data.forEach( function (d) {
          if(!( isNaN(xScale(new Date(d['Date Peaked']))) || isNaN(yScale(d['Temp 1'])) )) {
               data.push(d);
               colors[d['Genre']] = 0;
     }});
     console.log(colors);

     var xAxis = d3.svg.axis().scale(xScale);
     svg.append("g").attr("class", "axis").attr("transform", "translate(0, " + yScale(0) + ")").call(xAxis);
     var yAxis = d3.svg.axis().scale(yScale).orient("left");
     svg.append("g").attr("class", "axis").attr("transform", "translate(" + xScale(x1) + ", 0)").call(yAxis);

     var points = svg.selectAll("circle").data(data).enter().append("circle");

     points
         .attr("data-track", function(p) {return p['Track'];})
         .attr("data-artist", function(p) {return p['Artist'];})
         .attr("data-year", function(p) {return p['Year'];})
         .attr("data-entered", function(p) {return p['Date Entered'];})
         .attr("data-peak", function(p) {return p['Date Peaked'];})
         .attr("data-pk", function(p) {return p['PK'];})
         .attr("data-time", function(p) {return p['Time'];})
         .attr("data-genre", function(p) {return p['Genre'];})
         .attr("data-temp1", function(p) {return p['Temp 1'];})
         .attr("data-yearlyrank", function(p) {return p['Yearly Rank'];})
         .attr("cx", function(w) {return xScale(new Date(w['Date Peaked']));})
         .attr("cy", function(w) {return yScale(w['Temp 1']);})
         .attr("r", function(p) {return 5;})
         .style("fill", function(w){ return "black";});

     }); // dont delete this you boner
     //*******Graph functionality
     // function writeGraph(){

     // //****Helper Functions:
     //     //Changes font size based on the z attribute of the input
     //     function fontSizeScale(z){
     //         if (z<.00001){
     //             return 2;
     //         } else if (z<.00005){
     //             return 4;
     //         } else if (z<.00009){
     //             return 7;
     //         } else if (z<.00015){
     //             return 12;
     //         } else if (z<.00021){
     //             return 18;
     //         } else if (z<.00027){
     //             return 22;
     //         } else {
     //             return 26;
     //         }
     //     }
     //     //changes the opacity based on relative position to 0 on the y-axis
     //     function opacityScale(y){
     //         if(y==0){
     //             return 0.3;
     //         } else {
     //             return (200*y);
     //         }
     //     }
     //     //changes color based on whether the word is gaining popularity (orange like reddit upvote) or losing popularity (blue like reddit downvote)
     //     function chooseColor(y){
     //         if(y>0){return "orange"}else if(y<0){return "blue"}else{return "grey"}
     //     }
    //grab the information to be plotted
    // globalAllWordsInfo.updateAll();


     //     relWordFreqDataPoints.makeDataPoints(NUMDATAPOINTS);


     //     var input = relWordFreqDataPoints.dataPoints;
     //     var words = svg.selectAll("text").data(input).enter().append("text");

     //     //plot words
     //     words
     //         .attr("class", "trending_words")
     //         .attr("x", function(w) {return xScale(w.x);})
     //         .attr("y", function(w) {return yScale(w.y);})
     //         .style("fill", function(w){ return chooseColor(w.y);})
     //         .style("font-size", function(w){ return fontSizeScale(w.z);})
     //         .text(function (w) { return w.word; })
     //         .style("opacity", function(w){return opacityScale(Math.abs(w.y))})
     //         .style("z-index", 5);

     //     //plot scales
     //     svg.append("text").attr("x", 955).attr("y", yScale(0)).text("Time Blocks");
     //     svg.append("text").attr("x", 955).attr("y", yScale(-0.001)).text("(minute increments)").attr("font-size", "8pt");
     //     svg.append("text").attr("x", 200).attr("y", -1000).text("Trending Status").attr("transform", "rotate(90)");
     //     svg.append("text").attr("x", 150).attr("y", -980).text("(relative word frequency to see if the word").attr("transform", "rotate(90)").attr("font-size", "8pt");
     //     svg.append("text").attr("x", 150).attr("y", -960).text("popularity increases or decreases over time)").attr("transform", "rotate(90)").attr("font-size", "8pt");

     //     var formatTime = function(d) {
     //         return  (NUMDATAPOINTS*d/60*-1);      
     //     }


     //     d3.selectAll(".trending_words").on('mouseover', mouseover).on('mouseout', mouseout);
     //     //on mouse over, make more apparent the word being viewed
     //     function mouseover(){
     //         d3.selectAll('.trending_words').style('z-index', 1);
     //         d3.select(this).style("opacity", "1.0").style("fill", "green").style("z-index", 99);
     //     }
     //     // on mouse out, return the word to its initial state
     //     function mouseout(){
     //         d3.select(this).style("opacity", function(w){return opacityScale(Math.abs(w.y))}).style("fill", function(w){return chooseColor(w.y)}).style("z-index", 5);
     //     }
     //     //on mouse click, only show the word in question, hide all others
     //     d3.selectAll(".trending_words").on('click', function(){
     //         var selected_word = d3.select(this).text();
     //         console.log(selected_word);
     //         words.attr('opacity', 1.0).attr('display', function(w){ if(w.word==selected_word){ return 'block';} else  { return 'none';}});
     //     });
     //     //return the graph to its initial state
     //     $('#reset').on('click', function(){
     //         console.log('clicky');
     //         words.attr('display', 'inline').attr('opacity', function(w){return opacityScale(Math.abs(w.y))});
     //     });

     // }//End Write Graph
});


// Object {"": 0, Rock: 0, Rap: 0, Country: 0, Newage: 0…}
// "": 0
// Alternative: 0
// Benefit: 0
// Blues: 0
// Club: 0
// Comedy: 0
// Country: 0
// Dance: 0
// Easy: 0
// Electronica: 0
// Ensemble: 0
// Folk: 0
// Gospel: 0
// Jazz: 0
// Latin: 0
// Newage: 0
// Pop: 0
// R&B: 0
// Rap: 0
// Reggae: 0
// Rock: 0
// Singer-Songwriter: 0
// Techno: 0
// Vocal: 0
// World: 0
