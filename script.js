$(document).ready(function() {
    var pageLoadStartDate = new Date("01/01/1990");
    var pageLoadEndDate = new Date("04/01/2014");
    writeGraph(pageLoadStartDate, pageLoadEndDate);

    var color_code = {};
    color_code['Alternative'] = '#000080';
    color_code['Benefit'] = '#808080';
    color_code['Blues'] = '#C0C0C0';
    color_code['Club'] = '#0000FF';
    color_code['Comedy'] = '#008080';
    color_code['Country'] = '#00FFFF';
    color_code['Dance'] = '#800080';
    color_code['Easy'] = '#800000';
    color_code['Electronica'] = '#FF0000';
    color_code['Ensemble'] = '#FF00FF';
    color_code['Folk'] = '#008000';
    color_code['Gospel'] = '#00FF00';
    color_code['Jazz'] = '#808000';
    color_code['Latin'] = '#FFFF00';
    color_code['Newage'] = '#33FF33';
    color_code['Pop'] = '#CC9933';
    color_code['R&B'] = '#CC3366';
    color_code['Rap'] = '#CC0033';
    color_code['Reggae'] = '#999966';
    color_code['Rock'] = '#FF99CC';
    color_code['Singer-Songwriter'] = '#9933CC';
    color_code['Techno'] = '#FFFFCC';
    color_code['Vocal'] = '#99999';
    color_code['World'] = '#009999';

    function chooseColor(genre){
        return color_code[genre];
    }

    function writeGraph(startDate, endDate){
        d3.json("data.json", function(error,unfiltered_data) {

             var x1 = startDate;
             var x2 = endDate;

             var y1 = d3.min(unfiltered_data, function(entry) { return +entry["Temp 1"]; });
             var y2 = d3.max(unfiltered_data, function(entry) { return +entry["Temp 1"]; });

             var margin = {top: 20, right: 20, bottom: 40, left: 20};
             var width = 1000 - margin.left - margin.right;
             var height = 800 - margin.top - margin.bottom;
             
             //create the svg 
             var svg = d3.select("#canvas").append("svg").attr("height", (height + margin.top + margin.bottom)).attr("width", (width + margin.left + margin.right));

             var xScale = d3.time.scale().domain([x1, x2]).range([margin.left, width]);
             var yScale = d3.scale.linear().domain([y1,y2]).range([height, margin.top]);
             var rScale = d3.scale.log().domain([100,1]).range([0.5,10]);

             var data = [];
             var filterInt = 0;
             unfiltered_data.forEach( function (d) {
                if (filterInt%10 == 0) {
                    if (!( isNaN(xScale(new Date(d['Date Peaked']))) || isNaN(yScale(d['Temp 1'])) ) && 
                     (d['High'] !== "0" && d['High'] !== "") && 
                     (new Date(d['Date Peaked']) > new Date(startDate) && new Date(d['Date Peaked']) < new Date(endDate))) { 
                       data.push(d);
                    }   
                } 
                filterInt++;
            });

             var xAxis = d3.svg.axis().scale(xScale);
             svg.append("g").attr("class", "axis").attr("transform", "translate(0, " + yScale(0) + ")").call(xAxis);
             var yAxis = d3.svg.axis().scale(yScale).orient("left");
             svg.append("g").attr("class", "axis").attr("transform", "translate(" + xScale(x1) + ", 0)").call(yAxis);

             var points = svg.selectAll("circle").data(data).enter().append("circle");

             points
                 .attr("data-track", function(p) {return p['Track'];})
                 .attr("data-artist", function(p) {return p['Artist'];})
                 .attr("data-album", function(p) {return p['Album'];})
                 .attr("data-year", function(p) {return p['Year'];})
                 .attr("data-entered", function(p) {return p['Date Entered'];})
                 .attr("data-peak", function(p) {return p['Date Peaked'];})
                 .attr("data-high", function(p) {return p['High'];})
                 .attr("data-time", function(p) {return p['Time'];})
                 .attr("data-genre", function(p) {return p['Genre'];})
                 .attr("data-temp1", function(p) {return p['Temp 1'];})
                 .attr("data-yearlyrank", function(p) {return p['Yearly Rank'];})
                 .attr("cx", function(w) {return xScale(new Date(w['Date Peaked']));})
                 .attr("cy", function(w) {return yScale(w['Temp 1']);})
                 .attr("r", function(p) {return rScale(+p['High']);})
                 .style("fill", function(p){ return chooseColor(p['Genre']);})
                 .attr("class", "node"); 

                //Write Slider
                $('#slider').css('width', width + 'px');
                $("#slider").dateRangeSlider({
                  bounds:{
                    min: x1,
                    max: x2
                  },
                  defaultValues:{
                    min: x1,
                    max: x2
                  }
                });


                $('.node').mouseover(function(){
                    var node = $(this);
                    node.attr('class', 'node animated bounce');
                    window.setTimeout(removeClass, 2000);
                    function removeClass(){
                       node.attr('class', 'node'); 
                    } 
                });

                //add popupbox
                var popupBox = $('#popupBox');

                //Hide all nodes not of same artist
                var node_clicked = false;
                function changeStatus(){
                    node_clicked = !node_clicked;
                }
                
                $('.node').on('click', function(e){
                    var artist = $(this).data('artist');
                    var artist_nodes = $(".node[data-artist='" + artist + "']");
                    $('.node').attr('visibility', 'hidden');
                    artist_nodes.attr('visibility', 'visibile');

                    $('#name').empty();
                    $('#name').append($(this).data('track'));
                    $('#artist').empty();
                    $('#artist').append($(this).data('artist'));
                    $('#genre').empty();
                    $('#genre').append($(this).data('genre'));
                    $('#album').empty();
                    $('#album').append($(this).data('album'));
                    $('#year').empty();
                    $('#year').append($(this).data('year'));
                    $('#peak').empty();
                    $('#peak').append($(this).data('peak'));
                    $('#high').empty();
                    $('#high').append($(this).data('high'));
                    $('#length').empty();
                    $('#length').append($(this).data('length'));
                    $('#temp1').empty();
                    $('#temp1').append($(this).data('temp1'));
                    $('#yearlyrank').empty();
                    $('#yearlyrank').append($(this).data('yearlyrank'));

                    popupBox.show();
                    popupBox.attr("top", (e.clientY-10)+"px").attr("left",(e.clientX+10)+"px");
                
                    setTimeout(changeStatus, 2000);
                });

                //Reset and show all nodes again
                function resetNodes() {
                    $('.node').attr('visibility', 'visibile');
                    popupBox.hide();
                }

                $('#reset_nodes').on('click', function(){
                    resetNodes();
                });
                $('body').on('click', function(){
                    if(node_clicked === true){
                        resetNodes();
                        setTimeout(changeStatus, 2000);
                    }
                });

             }); // end d3.json
    }//end writeGraph

    $('#home').on('click', function(){
        var audio = document.getElementById("audio");
        audio.play();
        alert("Do the Harlem Shake! The music can't be stopped!");
    });

   $('#submit').on('click', function(e){
        e.preventDefault();
        // Date slider
        var dateSliderMin = $("#slider").dateRangeSlider("min");
        var dateSliderMax = $("#slider").dateRangeSlider("max");
        // console.log(dateSliderMin);
        // console.log(dateSliderMax);
        $('#canvas').empty();
        writeGraph(dateSliderMin, dateSliderMax);
    });

	//Hide all nodes not of same artist
    var node_clicked = false;
    function changeStatus(){
        node_clicked = !node_clicked;
    }

    //Reset and show all nodes again
    function resetNodes() {
        $('.node').attr('visibility', 'visibile');
        popupBox.style("visibility", "hidden");
    }

    $('#reset_nodes').on('click', function(){
        resetNodes();
    });
    $('body').on('click', function(){
        if(node_clicked === true){
            resetNodes();
            setTimeout(changeStatus, 2000);
        }
    });

    //add popupbox
    var popupBox = d3.select("body")
      .append("div")
      .style("position", "absolute")
      .style("z-index", "10")
      .style("visibility", "hidden")
      .text("Alex doesn't even lift bro");
});//end document

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


// Black or 000000  Gray or 808080  Silver or C0C0C0    White or FFFFFF
//  Navy or 000080  Blue or 0000FF  Teal or 008080  Aqua or 00FFFF
//  Purple or 800080    Maroon or 800000    Red or FF0000   Fuschia or FF00FF
//  Green or 008000     Lime or 00FF00  Olive or 808000     Yellow or FFFF00

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
