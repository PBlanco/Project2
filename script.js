$(document).ready(function(){    
     //Scale variables
     var x1 = 0; //Start year
     var x2 = 24; //End year
     var y1 = 0; //Lowest Lancefer score
     var y2 = 3400; //Highest Lancefer score
     var svgXlen = 1050;
     var svgYlen = 800;
     var xPadding = 20;
     var yPadding = 20;

     //create the x and y scale
     var xScale = d3.scale.linear().domain([x1, x2]).range([xPadding, svgXlen - xPadding]);
     var yScale = d3.scale.linear().domain([y1,y2]).range([svgYlen-yPadding, yPadding]);
     //create the svg 
     var svg = d3.select("#canvas").append("svg").attr("height", svgYlen).attr("width", svgXlen);
     console.log(svg);

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

     // //****Write the graph
     //     //create the x and y scale
     //     var xScale = d3.scale.linear().domain([-1, 15]).range([950,50]);
     //     var yScale = d3.scale.linear().domain([-0.02,0.02]).range([750,20]);
     //     //create the svg 
     //     var svg = d3.select("#canvas").append("svg").attr("height", 800).attr("width", 1050);

     //     //grab the information to be plotted
     //     globalAllWordsInfo.updateAll();


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
     //     var xAxis = d3.svg.axis().scale(xScale).tickFormat(formatTime);
     //     svg.append("g").attr("class", "axis").attr("transform", "translate(0, " + yScale(0) + ")").call(xAxis);
     //     var yAxis = d3.svg.axis().scale(yScale).orient("left");
     //     svg.append("g").attr("class", "axis").attr("transform", "translate(" + xScale(-1) + ", 0)").call(yAxis);

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
