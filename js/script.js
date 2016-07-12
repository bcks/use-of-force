

var categories = ["Requires De-Escalation", "Has Force Continuum", "Bans Choking and Strangleholds", "Requires Warning Before Shooting", "Restricts Shooting at Moving Vehicles", "Requires Officers Exhaust All Means Before Shooting", "Duty to Intervene", "Requires Comprehensive Reporting" ];

var data = {};



function showData(id) {
	var infoBox = '<div id="close">&times;</div>';
	for (var d in data) {
		if (data[d].id == id) {		
			infoBox += '<h2>'+data[d]['Police Department']+'</h2>';
			infoBox += '<div class="row"><div class="label">Year of most recent policy</div><div class="info">'+data[d]['Year of most recent policy']+'</div></div>';
			
				for (var k in data[id]) {
					if (k.indexOf("(Policy Language)") >= 0) {
						var label = k.replace("(Policy Language)","").replace("(Y//N)","");
						var text = data[id][k].replace("Yes. ","");
						text= text.replace("No. ","");
						infoBox += '<hr>';
						infoBox += '<div class="row"><div class="label">' + label + '</div><div class="info">'+text+'</div></div>';
					}	
				}

		}
	}

  var newWin = window.open('', '', 'width=500,height=500,resizeable,scrollbars');
  if(!newWin || newWin.closed || typeof newWin.closed=='undefined')  { 
		$('#infobox').show();
		$('#infobox').html(infoBox);
		$('#infobox').css({ top: '', bottom: '0px' });
		if ( $('#infobox').height() >= window.innerHeight - 100 ) {
			$('#infobox').css({'top': "0px", bottom: ''});
		}
  } else {  
    var output = '<!DOCTYPE html> <html lang="en"> <head> <meta charset="utf-8" /> <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0"> <title>Use of Force</title><link rel="stylesheet" type="text/css" href="css/styles.css"></head><body id="popup">' + infoBox + '<p class="close-this"><a href="JavaScript:window.close()">Close this</a></p></body></html>';
    newWin.document.write(output);
    newWin.history.pushState(null, "Barriers to Accountability in Police Union Contracts and Police Bills of Rights", "http://www.checkthepolice.org/review");
    newWin.document.close(); // needed for chrome and safari
  }  

	$('#close').click(function(){
			$('#infobox').hide();
	});

}



function renderStates(states, label) {
	var output = '<table class="header-fixed">';
	output += '<thead><tr><th class="first"><h3>'+label+'</h3></th><th><div>Requires<span><br></span> De-Escalation</div></th><th><div>Has Force<span><br></span> Continuum</div></th><th><div>Bans Choking<span><br></span> and Strangleholds</div></th><th><div>Requires Warning<span><br></span> Before Shooting</div></th><th><div>Restricts Shooting<span><br></span> at Moving Vehicles</div></th><th><div>Requires Officers Exhaust All<span><br></span> Means Before Shooting</div></th><th><div>Duty to<span><br></span> Intervene</div></th><th><div>Requires Comprehensive<span><br></span> Reporting</div></th></tr></thead>';
	output += '<tbody>';

	for (var s in states) {
		output += '<tr>';
		output += '<td class="state">' + states[s] + '</td>';
		
		for (var c in categories) {			

			var cssClass = 0;
			var thisDataId = '';			

			for (var d in data) {
				if (data[d]['Police Department'] == states[s]) { 
					if (categories[c] in data[d]) { 
						//console.log( states[s], categories[c] , data[d][categories[c]]);
						cssClass = data[d][categories[c]] * 1;
						thisDataId = data[d].id;
					}
				}
			}
			
			if (cssClass) {
				output += '<td class="on" onClick="showData('+thisDataId+')">&nbsp;</td>';
			} else {
				output += '<td class="off" onClick="showData('+thisDataId+')">&nbsp;</td>';
			}

		}
	 output += '</tr>';
	}
	output += '</tbody>';
	output += '</table><p><br></p>';
	return output;
}



$(document).ready(function() {
    $('.header-fixed').stickyHeader() 
});




function getAjax(handleData) {
	var data = $.ajax({
			url: "./data/force.csv",
			async: false,
			success:function(csvd) {
				var data = $.csv.toObjects(csvd);
				handleData(data); 
			},
			dataType: "text"
	});
}

getAjax(function(ajaxData){
  // here you use the output
  var n = 0;
	for (var d in ajaxData) {
			ajaxData[d].id = n;
			n++;
	}
	data = ajaxData;
	console.log(data);
		
	// build atlas
	var atlas = []
	for (var d in ajaxData) {
		if (typeof data[d]['Police Department'] !== "undefined") {
			if (atlas.indexOf( data[d]['Police Department'] ) == -1) {
				atlas.push(data[d]['Police Department']);
			}
		}
	}
	atlas.sort();

	var output = '';
	output += renderStates(atlas, 'Use of Force Guidelines');
  $('#output').html(output);

});
