//TODO:
// 1) Get the box to show and hover on node click (introduce bug during refactor)
// 2) Get the slider to auto redraw data when releaseing slider date
$(document).ready(function () {
    var pageLoadStartDate = new Date("01/01/1990");
    var pageLoadEndDate = new Date("04/01/2014");
    var data = [];

    var mouseX;
    var mouseY;
    $(document).mousemove( function(e) {
       mouseX = e.pageX + 10; 
       mouseY = e.pageY + 10;
    });  

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

    //helper methods
    function chooseColor(genre) {
        return color_code[genre];
    }

    var margin = {
        top: 20,
        right: 20,
        bottom: 40,
        left: 20
    };

    //Write Graph
    var width = 1000 - margin.left - margin.right;
    var height = 800 - margin.top - margin.bottom;

    //create the svg 
    var svg = d3.select("#canvas").append("svg").attr('id','graph').attr("height", (height + margin.top + margin.bottom)).attr("width", (width + margin.left + margin.right));


    //Write Slider
    $('#slider').css('width', width + 'px');
    $("#slider").dateRangeSlider({
        bounds: {
            min: pageLoadStartDate,
            max: pageLoadEndDate
        },
        defaultValues: {
            min: pageLoadStartDate,
            max: pageLoadEndDate
        }
    });


    //Used to write graph
    function writeData(startDate, endDate) {
            $('#graph').empty();
            var x1 = startDate;
            var x2 = endDate;

            filtered_data = [];
            data.forEach( function (d) {
                if (new Date(d['Date Peaked']) > new Date(startDate) && new Date(d['Date Peaked']) < new Date(endDate)) {
                    filtered_data.push(d);
                }
            });


            var y1 = d3.min(filtered_data, function (entry) {
                return +entry["Temp 1"];
            });

            var y2 = d3.max(filtered_data, function (entry) {
                return +entry["Temp 1"];
            });

            xScale = d3.time.scale().domain([x1, x2]).range([margin.left, width]);
            yScale = d3.scale.linear().domain([y1, y2]).range([height, margin.top]);
            var rScale = d3.scale.log().domain([100, 1]).range([0.5, 10]);

            var xAxis = d3.svg.axis().scale(xScale);
            svg.append("g").attr("class", "axis").attr("transform", "translate(0, " + yScale(0) + ")").call(xAxis);
            var yAxis = d3.svg.axis().scale(yScale).orient("left");
            svg.append("g").attr("class", "axis").attr("transform", "translate(" + xScale(x1) + ", 0)").call(yAxis);

            var points = svg.selectAll("circle").data(filtered_data).enter().append("circle");

            points
                .attr("data-track", function (p) {
                    return p['Track'];
                })
                .attr("data-artist", function (p) {
                    return p['Artist'];
                })
                .attr("data-album", function (p) {
                    return p['Album'];
                })
                .attr("data-year", function (p) {
                    return p['Year'];
                })
                .attr("data-entered", function (p) {
                    return p['Date Entered'];
                })
                .attr("data-peak", function (p) {
                    return p['Date Peaked'];
                })
                .attr("data-high", function (p) {
                    return p['High'];
                })
                .attr("data-time", function (p) {
                    return p['Time'];
                })
                .attr("data-genre", function (p) {
                    return p['Genre'];
                })
                .attr("data-temp1", function (p) {
                    return p['Temp 1'];
                })
                .attr("data-yearlyrank", function (p) {
                    return p['Yearly Rank'];
                })
                .attr("cx", function (w) {
                    return xScale(new Date(w['Date Peaked']));
                })
                .attr("cy", function (w) {
                    return yScale(w['Temp 1']);
                })
                .attr("r", function (p) {
                    return rScale(+p['High']);
                })
                .style("fill", function (p) {
                    return chooseColor(p['Genre']);
                })
                .attr("class", "node")
            //for mouseover animation
            .on("mouseover", function () {
                d3.select(this).transition()
                    .duration(250)
                    .attr("r", 20)
                    .attr('oldr', $(this).attr('r'));
            })
            .on("mouseout", function () {
                d3.select(this).transition()
                    .duration(250)
                    .attr("r", $(this).attr('oldr'))
                    .attr('oldr', null);

            });


            
            //Hide all nodes not of same artist
            var node_clicked = false;

            function changeStatus() {
                console.log('started ' + node_clicked);
                node_clicked = !node_clicked;
                console.log('now ' + node_clicked);
            }

            $('.node').on('click', function (e) {
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

                setTimeout(changeStatus, 100);

                //$('#popupBox').show();
                //$('#popupBox').attr("top", (e.clientY - 10) + "px").attr("left", (e.clientX + 10) + "px");
                $('#popupBox').css({'top':mouseY,'left':mouseX}).fadeIn('slow');
            });

            //Reset and show all nodes again
            function resetNodes() {
                $('.node').attr('visibility', 'visibile');
                setTimeout(changeStatus, 1000);
                $('#popupBox').hide();
            }

            $('#reset_nodes').on('click', function () {
                resetNodes();
            });
            $('body').on('click', function () {
                console.log(node_clicked);
                if (node_clicked === true) {
                    resetNodes();
                }
            });
    } //end writeData



    //Grab data asynchronously
    function getdata(){
        d3.json("data.json", function (error, unfiltered_data) {
            var filterInt = 0;
            unfiltered_data.forEach(function (d) {
                if (filterInt % 10 === 0) {
                    if (d['Date Peaked'] !== "" && d['Temp 1'] !== "" && d['High'] !== "0" && d['High'] !== "") {
                    // if (!(isNaN(xScale(new Date(d['Date Peaked']))) ||
                    //     isNaN(yScale(d['Temp 1']))) &&
                    //     (d['High'] !== "0" && d['High'] !== ""))
                        data.push(d);
                    }
                }
                filterInt++;
            });
            //Start of main stuff
            console.log("called");
            writeData(pageLoadStartDate, pageLoadEndDate);
        });
    }
    //get the data
    getdata();

    $('#home').on('click', function () {
        var audio = document.getElementById("audio");
        audio.play();
        alert("Do the Harlem Shake! The music can't be stopped!");
    });

    $('#submit').on('click', function (e) {
        e.preventDefault();
        // Date slider
        var dateSliderMin = $("#slider").dateRangeSlider("min");
        var dateSliderMax = $("#slider").dateRangeSlider("max");
        writeData(dateSliderMin, dateSliderMax);
    });

    //Hide all nodes not of same artist
    var node_clicked = false;

    function changeStatus() {
        node_clicked = !node_clicked;
    }

    //Reset and show all nodes again
    function resetNodes() {
        $('.node').attr('visibility', 'visibile');
        $('#popupBox').style("visibility", "hidden");
    }

    $('#reset_nodes').on('click', function () {
        resetNodes();
    }); $('body').on('click', function () {
        if (node_clicked === true) {
            resetNodes();
            setTimeout(changeStatus, 2000);
        }
    });

    //add $('#popupBox')
    // var $('#popupBox') = d3.select("body")
    // .append("div")
    // .style("position", "absolute")
    // .style("z-index", "10")
    // .style("visibility", "hidden")
    // .text("Alex doesn't even lift bro");

}); //end document

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