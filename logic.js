// ---- configuration ------
var emoncms_userid = 20722;

var emon = "proxy.php?csurl=http://emoncms.org/feed/list.json?userid=" + emoncms_userid;

var max_inactive_seconds = 180;

// feed names
var solar_watt_name = "solar_watt";
var solar_kwh_name = "solar_kwh";
var grid_watt_name = "grid_watt";
var grid_kwh_name = "grid_kwh";
var house_watt_name = "house_watt";
var house_kwh_name = "house_kwh";
var guest_watt_name = "guest_watt";
var guest_kwh_name = "guest_kwh";
var garage_watt_name = "garage_watt";
var garage_kwh_name = "garage_kwh";

var powerwall_watt_name = "shunt_watt";
var powerwall_soc_name = "shunt_soc";


//---------------------------------------------

var solar_watt = 0;
var solar_kwh = 0;
var grid_watt = 0;
var grid_kwhin = 0;
var grid_kwhut = 0;
var house_watt = 0;
var house_kwh = 0;
var guest_watt = 0;
var guest_kwh = 0;
var garage_watt = 0;
var garage_kwh = 0;
var powerwall_watt = 0;
var powerwall_soc = 0;


function loadData() {
    console.log("Lets output data");
    $.getJSON("proxy.php?csurl=http://localhost:1880/powerflow", function(data) {
        console.log(data);
        updateValuesFromEmonFeed(data);
        refresh_ui();
    });



}


function loadEmoncmsValues() {
    $.getJSON(emon, function(data) {
        updateValuesFromEmonFeed(data);
        refresh_ui();
    });
}



function updateValuesFromEmonFeed(data) {
    var now = Math.round(new Date().getTime() / 1000);

    for (var i = 0, len = data.length; i < len; i++) {
        // SOLAR
        if (data[i].name == solar_watt_name) {
            if(data[i].time + max_inactive_seconds >= now){
            solar_watt = data[i].value;
            } else {
              solar_watt = 0;
            }
        }
 
        if (data[i].name == solar_kwh_name) {
            solar_kwh = data[i].value;
        }
       // guest
        if (data[i].name == guest_watt_name) {
            if(data[i].time + max_inactive_seconds >= now){
            guest_watt = data[i].value;
            } else {
              guest_watt = 0;
            }
        }
 
        if (data[i].name == guest_kwh_name) {
            guest_kwh = data[i].value;
        }
       // garage
        if (data[i].name == garage_watt_name) {
            if(data[i].time + max_inactive_seconds >= now){
            garage_watt = data[i].value;
            } else {
               garage_watt = 0;
            }
        }
 
        if (data[i].name == garage_kwh_name) {
            garage_kwh = data[i].value;
        }
       // GRID
        if (data[i].name == grid_watt_name) {
            if(data[i].time + max_inactive_seconds >= now){
            grid_watt = data[i].value;
            } else {
               grid_watt = 0;
            }
        }
        if (data[i].name == grid_kwh_name) {
            grid_kwhin = parseFloat(data[i].valuein);
            grid_kwhut = parseFloat(data[i].valueut);
        }

        // HOUSE
        if (data[i].name == house_watt_name) {
            if(data[i].time + max_inactive_seconds >= now){
            house_watt = data[i].value;
            } else {
             house_watt = 0;
            }
        }
        if (data[i].name == house_kwh_name) {
            house_kwh = data[i].value;
        }
        // POWERWALL
        if (data[i].name == powerwall_watt_name) {
            if(data[i].time + max_inactive_seconds >= now){
            powerwall_watt = data[i].value;
            } else {
              powerwall_watt = 0;
             }
        }
        if (data[i].name == powerwall_soc_name) {
            powerwall_soc = data[i].value;
        }
    }
}

function electronTime(watt) {
    w = Math.abs(watt);
    if (w < 50) {
        return 6;
    }
    if (w < 200) {
        return 4;
    }
    if (w < 500) {
        return 2
    }
    if (w < 1000) {
        return 1;
    }
    if (w < 2000) {
        return 0.5;
    }

    if (w < 3000) {
        return 0.25;
    }
    if (w > 2999) {
        return 0.1;
    }

    return 0;
}

function setAnimationTime(watt, selector1, selector2) {
    var time = electronTime(watt) + "s";

    $(selector1).each(function(index) {
        if ($(this).attr("dur") != time) {
            $(this).attr("dur", time);
        }
    });
    $(selector2).each(function(index) {
        if ($(this).attr("begin") != time) {
            $(this).attr("begin", time);
            $(this).attr("dur", time);
        }
    });
}

function calc_losses() {
    main_watt = house_watt + guest_watt + garage_watt;
powerwall_watt
	grid_watt
	solar_watt

	var consumer = main_watt;
	var producer = solar_watt;
	if (powerwall_watt < 0 ) {
		producer += (powerwall_watt*-1);
	} else {
		consumer += (powerwall_watt);
	}
	if ( grid_watt > 0 ) {
		producer += grid_watt;
	} else {
		consumer += grid_watt*-1;
	}
	var losses = Math.round(((producer-consumer) / producer) * 100);
	console.log("Consumer: " + consumer + " producer: " + producer + " Losses: " + losses + " wattage lost: " + (producer-consumer));
	$("#losses").text("Lost: " + losses + "% (" + Math.round(producer-consumer) + "w)");



}

function refresh_ui() {

    main_watt = house_watt + guest_watt + garage_watt;
    console.log(main_watt);
    if (main_watt > 0) {
        $("#main-dot").addClass("on");

    } else {
        $("#main-dot").removeClass("on");
    }
    setAnimationTime(main_watt, "#main-dot animate.dot1", "#main-dot animate.dot2");

    if (solar_watt > 0) {
        $("#solar").addClass("on");
        $("#solar_watt").text(solar_watt + " w");
        $("#solar-line").addClass("on");
        $("#solar-dot").addClass("on");
    } else {
        $("#solar").removeClass("on");
        $("#solar-line").removeClass("on");
        $("#solar-dot").removeClass("on");
    }
    prec = (solar_kwh > 0) ? 3 : 2;
    $("#solar_kwh").text(parseFloat(solar_kwh).toPrecision(prec) + " kWh");
    setAnimationTime(solar_watt, "#solar-dot animate.dot1", "#solar-dot animate.dot2");

    if (grid_watt != 0) {
        $("#grid").addClass("on");
        $("#grid_watt").text(Math.round(grid_watt) + " w");
        $("#grid-line").addClass("on");
        if (grid_watt > 0) {
            $("#grid-dot-out").addClass("on");
            $("#grid-dot-in").removeClass("on");
        } else {
            $("#grid-dot-in").addClass("on");
            $("#grid-dot-out").removeClass("on");
        }
    } else {
        $("#grid").removeClass("on");
        $("#grid-line").removeClass("on");
        $("#grid-dot-out").removeClass("on");
        $("#grid-dot-in").removeClass("on");
    }
    prec1 = (grid_kwhin > 0) ? 2 : 1;
    prec2 = (grid_kwhut > 0) ? 2 : 1;
    $("#grid_kwhimport").text("Import: " + parseFloat(grid_kwhin).toPrecision(prec1) + "kWh");
    $("#grid_kwhexport").text("Export:" + parseFloat(grid_kwhut).toPrecision(prec2) + "kWh ");
    setAnimationTime(grid_watt, "#grid-dot-in animate.dot1, #grid-dot-out animate.dot1", "#grid-dot-in animate.dot2, #grid-dot-out animate.dot2");

    if (house_watt > 0) {
        $("#house").addClass("on");
        $("#house_watt").text(Math.round(house_watt) + " w");
        $("#house2-line").addClass("on");
        $("#house-line").addClass("on");
        $("#house-dot").addClass("on");
        $("#house2-dot").addClass("on");
    } else {
        $("#house").removeClass("on");
        $("#house-line").removeClass("on");
        $("#house2-line").removeClass("on");
        $("#house-dot").removeClass("on");
        $("#house2-dot").removeClass("on");
    }
    prec = (house_kwh > 0) ? 2 : 1;
    $("#house_kwh").text(parseFloat(house_kwh).toPrecision(prec) + " kWh");
    setAnimationTime(house_watt, "#house-dot animate.dot1, #house animate.glow", "#house-dot animate.dot2");
    setAnimationTime(house_watt, "#house2-dot animate.dot1, #house animate.glow");


    // GUEST HOUSE SETTINGS
    if (guest_watt > 0) {
        $("#guest").addClass("on");
        $("#guest_watt").text(Math.round(guest_watt) + " w");
        $("#guest-line").addClass("on");
        $("#guest-dot").addClass("on");
    } else {
        $("#guest").removeClass("on");
        $("#guest-line").removeClass("on");
        $("#guest-dot").removeClass("on");
    }
    prec = (guest_kwh > 0) ? 3 : 1;
    $("#guest_kwh").text(parseFloat(guest_kwh).toPrecision(prec) + " kWh");
    setAnimationTime(guest_watt, "#guest-dot animate.dot1, #guest animate.glow", "#guest-dot animate.dot2");

    // GARAGE HOUSE SETTINGS
    if (garage_watt > 0) {
        $("#garage").addClass("on");
        $("#garage_watt").text(Math.round(garage_watt) + " w");
        $("#garage2-line").addClass("on");
        $("#garage-line").addClass("on");
        $("#garage-dot").addClass("on");
        $("#garage2-dot").addClass("on");
    } else {
        $("#garage").removeClass("on");
        $("#garage-line").removeClass("on");
        $("#garage2-line").removeClass("on");
        $("#garage-dot").removeClass("on");
        $("#garage2-dot").removeClass("on");
    }
    prec = (garage_kwh > 0) ? 3 : 1;
    $("#garage_kwh").text(parseFloat(garage_kwh).toPrecision(prec) + " kWh");
    setAnimationTime(garage_watt, "#garage-dot animate.dot1, #garage animate.glow", "#garage-dot animate.dot2");
    setAnimationTime(garage_watt, "#garage2-dot animate.dot1, #garage animate.glow", "#garage2-dot animate.dot2");

    if (powerwall_watt != 0) {
        $("#powerwall").addClass("on");
        $("#powerwall_watt").text(Math.round(powerwall_watt) + " w");
        $("#powerwall-line").addClass("on");
        if (powerwall_watt > 0) {
            $("#powerwall-dot-out").removeClass("on");
            $("#powerwall-dot-in").addClass("on");
        } else {
            $("#powerwall-dot-out").addClass("on");
            $("#powerwall-dot-in").removeClass("on");
        }
    } else {
        $("#powerwall").removeClass("on");
        $("#powerwall-line").removeClass("on");
        $("#powerwall-dot-out").removeClass("on");
        $("#powerwall-dot-in").removeClass("on");
    }
    $("#powerwall_soc").text(powerwall_soc + "%");

    setAnimationTime(powerwall_watt, "#powerwall-dot-in animate.dot1, #powerwall-dot-out animate.dot1, #powerwall animate.glow", "#powerwall-dot-in animate.dot2, #powerwall-dot-out animate.dot2");
}

//loadEmoncmsValues();
loadData();
var interval = setInterval(function() {
    loadData();
	calc_losses();
}, 1000);
