/**
 * Created by Maeda on 1/19/2015.
 * FlashExtract toolkits and javascript
 * Where invokation of learning happens!
 */

$(function() {
	/*$.ajax({
		url : "https://dl.dropboxusercontent.com/u/73002693/FlashExtract/TestSets/berkeley.txt",
		dataType: "text",
		success : function (data) {
			//$("#txt").text(data);
			$("#txt").text("DATASET 200:\nproteins (01)\ncalories 20\nproteins (80)\n" +
					"DATASET 100:\nproteins (90)\ncalories 90\nproteins (600)\n"
					+ "DATASET 400:\nproteins (102)\ncalories 432\nproteins (324)\n"
					//+ "DATASET 500:\nproteins (4345)\ncalories 55\nproteins (654)\n"
					//+ "DATASET 600:\nproteins (345)\ncalories 345\nproteins (89)\n"
			)
		}
	});*/

	//Setting up the brushes selection panel.
	var bpanel = d3.select("#color_panel")
			.append("svg")
			.attr("width", 180)
			.attr("height", 45)
			.append("g");

	var colors = d3.scale.category10().range();
	var hcolor = -1;
	var brushes = bpanel.selectAll("circle")
			.data(colors)
			.enter().append("circle")
			.attr("cx", function(d, i){return (i%5)*25 + 10})
			.attr("cy", function(d, i){return (i<5)? 10 : 35})
			.attr("r", 9)
			.attr("id", function(d, i){return "b" + i})
			.attr("fill-opacity", 0.3)
			.style("fill", function(d){return d;})
			.style("stroke", function(d){return d;})
			.style("stroke-width", 2)
			.on("click", function(d, i){
				//The brush selection interaction
				hcolor = i;
				bpanel.selectAll("circle")
						.attr("fill-opacity", 0.3);
				d3.select("#b" + hcolor)
						.attr("fill-opacity", 1);
			});

	//Set table colors!
	for(var i = 0; i < colors.length; i++){
		var c = d3.rgb(colors[i]);
		//console.log(c.r);
		$("#extracted th:nth-child(" + (i+1) + ")")
				.css("color", colors[i]);
		//.css("background-color", "rgba(" + c.r + "," + c.g + "," + c.b + ",0.05);");
	}

	var all_ranges = [];
	var seldata = [];
	$("#txt").bind('mouseup', function(event) {
		if (document.activeElement !== $(this)[0]) {
			return;
		}
		var range = $("#txt").textrange();
		//console.log(range.start);
		if(hcolor > -1){
			//TODO: code to merge ranges of same color.
			if(range.length > 0){
				var c = d3.rgb(colors[hcolor]);
				var h = {
					color: "rgba(" + c.r + "," + c.g + "," + c.b + ",0.2);",
					text: range.text,
					ranges: [[range.start, range.end]]
				};
				all_ranges.push(h);

				var layers = layerRanges(all_ranges);

				//The remove data is a hack to allow the higlighter to refresh
				$(".container").remove();
				while($("#txt").parent().is(".highlightTextarea")){
					$("#txt").unwrap();
				}

				//END OF HACK

				//For each layer add a highlight text area (this allows overlapping highlights)
				for(var l = 0; l < layers.length; l++){
					$("#txt").highlightTextarea({
						ranges: layers[l]
					});
					$("#txt").removeData();
				}

				//Insert highlighted data into tables:
				if(!seldata[hcolor]){
					seldata[hcolor] = [];
				}
				seldata[hcolor].push(range.text);

				updateTable();
			}
		}
	});


	function updateTable(){
		//Insert dummy with some selected data:
		$("tbody").empty();
		for(var i = 0; i < 7; i++){
			var row = "<tr>";
			for(var j = 0; j < 10; j++){
				var td = "<td>&nbsp</td>";
				if(seldata[j] && seldata[j][i]){
					td = "<td>" + seldata[j][i].substring(0, 30) + (seldata[j][i].length > 40 ? "..." : "") + "</td>";
				}
				row += td;
			}
			row +="</tr>";
			$("tbody").append(row);
		}
	}
	updateTable();

	function layerRanges(R){
		//console.log(R);
		var layers = [];
		for(var i = 0; i < R.length; i++){
			var a = R[i].ranges[0];
			var added = false;
			for(var j = 0; j < layers.length; j++){
				var layer = layers[j];
				var possible = true;
				for(var k = 0; k < layer.length; k++){
					var b = layer[k].ranges[0];
					if(a[0] <= b[1] && b[0] <= a[1])
						possible = false;
				}
				if(possible){
					added=true;
					layer.push(R[i]);
					break;
				}
			}
			if(!added){
				layers.push([R[i]])
			}
		}
		//console.log(layers);
		return layers;
	}

	function constructJSON(R){

	}

	//Run execution code
	$( "#execute_learn" ).click(function() {
		execute_learn(all_ranges)
	})

});
