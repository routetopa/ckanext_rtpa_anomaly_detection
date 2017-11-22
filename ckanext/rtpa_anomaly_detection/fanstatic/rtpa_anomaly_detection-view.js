this.ckan.module('rtpa_anomaly_detection_view', function(jQuery, _) {
	
	return{
		initialize: function() {
            jQuery.proxyAll(this, /_on/);
            this.el.ready(this._onReady);
            },
        _onReady: function() {
			console.log(this.options.resource);
			
		}
		
}
});

function detectAnomaly(){
			

		var api_url = $( "#api-link" ).val();

		var field_name = $( "#field-name" ).val();

		$(".anomalyDetectionResults").fadeIn();
		$("#detectAnomaly").fadeOut();

		var response = $.getJSON(api_url, function(data) {
			data["x"] = "_id";
			data["y"] = "On_foot";
			data["resource_url"] = api_url;
			data["neighbours"]=1;
			data["analysisFeatures"] = [];
			amountOfRecords=data["result"]["total"]-1
			//getMaxNeighbours()
			json = JSON.stringify(data);
			// TODO dynamic links
			//var url = "http://10.2.17.4:8888/detectAnomalies/lof";
			var url = "http://vmrtpa05.deri.ie:8008/detectAnomalies/lof";
			var dataType ="aplication/json";

			x_axis = data["x"]
			y_axis = data["y"]
	
			source_data = data;

			$.ajax({
				type: "POST",
				url: url,
				data: json,
				success: function(data){

					json = JSON.parse(data);
	
					if (json.length == 0) {

						$(".anomalyDetectionResults").hide();
						$(".noAnomalyDetected").fadeIn();

					return false;

					}

					var table = "<tr><thead>"

					data_source_dimensions = []
					for (field in source_data.result.fields){
						data_source_dimensions.push(source_data.result.fields[field].id)
						table += "<th>" + source_data.result.fields[field].id + "</th>"
					}

					table += "<th> Anomaly Score </th> </thead> </tr>";

					for (index in json){
						//console.log(index,json[index])
						if (json[index][2] > 1.0){


							table += "<tr class='anomaly' anomaly-score='" + json[index][2] + "'>";

							for (dimension in data_source_dimensions) {
								table += "<td>" + source_data.result.records[index][data_source_dimensions[dimension]] + "</td>"
							}

							table += "<td>" + json[index][2] + "</td>"
							table += "</tr>"

						}
					}

					table = "<table class='col-12 table table-hover -table-striped table-anomalies'>" + table + "</table>";
					table = "<div class='alert alert-error top20'>The following values are detected as potential anomalies</div>" + table;

					$("#anomaly-output").html(table);

					updateTableTolerance(score_tolerance)
					updateAnomalyMetrics(score_tolerance)


					// Pares the data for the chart
					var column_x    = []
					var column_y    = []
					var column_a    = []
					column_as       = []

                //json["result"][i][j] :: j
                // 0 - _id
                // 1 - FirstNumericColumn
                // 2 - Score
                // 3 - flag (type)

                // Parse X + Y + make Anomalies null
					for(i=0; i < source_data.result.records.length; i++)
					{
						column_x[i] = source_data.result.records[i][x_axis];
						column_y[i] = source_data.result.records[i][y_axis];
						column_as[i] = json[i][2];

						if ( json[i][2] > 1 + score_tolerance ){
							column_a[i] = json[i][1];
						} else {
							column_a[i] = null;
						}
					}

					column_x.unshift(x_axis)
					column_y.unshift(y_axis)
					column_a.unshift("Anomaly")
					column_as.unshift("Anomaly Score")
				
					dimension_chart = c3.generate({
						bindto: '#dimension-chart',
						point: {
							r: function(d) {

								if (d.id == "Anomaly"){
									return 4 * column_as[d.index + 1];
								}
								return 3;
							}
						},
						data: {
							x: x_axis,
							columns: [
								column_x,
								column_y,
								column_a,
							],
							type: 'scatter'
						},
						grid: {
							x: {
								show: false,
							},
							y: {
								show: true,
							}
						},
						axis: {
							x: {
								type: 'category',
								show: true,
								tick: {
									rotate: 75,
									multiline: false,
									culling: {
										max: 40 // the number of tick texts will be adjusted to less than this value
									}
								},
							},
							y: {
								inner: true
							}
						},
						color: {
							pattern: [ '#66A4E0', "#FF360C" ]
						}
					});

					anomaly_chart = c3.generate({
						bindto: '#anomaly-chart',
						grid: {
							x: {
								show: false,
							},
							y: {
								show: true,
							}
						},
						data: {
							x: x_axis,
							columns: [
								column_x,
								column_as
							],
							//type: 'scatter'
						},
						axis: {
							x: {
								type: 'category',
								tick: {
									rotate: 75,
									multiline: false,
									culling: {
										max: 40 // the number of tick texts will be adjusted to less than this value
										}
								},
							},
							y: {
								inner: true
							}
						},
						color: {
							pattern: [ '#FF360C' ]
						},
						subchart: {
							show: true,
							onbrush: function (d) {
								dimension_chart.zoom(d);
								anomaly_chart.zoom(d);
							},
						}
					});

					$(".anomalyChatsControls").fadeIn();
					$("#recalculateAnomaly").fadeIn();

				},
				dataType: "text",
				contentType: "application/json; charset=utf-8",
				error: function(req, err){ console.log('my message' + err); }
			});
			

		});
		console.log(response);
	}
//});
		
		


