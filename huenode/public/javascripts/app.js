//reference for the hue http command: http://developers.meethue.com/gettingstarted.html
//The config url of the hue is: http://<bridge ip address>/debug/clip.html
//in the following case with the ip, it can be: http://192.168.1.100/debug/clip.html

var ip = "http://192.168.1.100";
var tmp;
var lightsNumber = 3;

/***********************************************************
* REFERENCE:http://snipplr.com/view.php?codeview&id=37974  *
************************************************************/
function hexToRGB(hex) {
  if (hex[0]=="#") hex=hex.substr(1);
  if (hex.length==3) {
    var temp=hex; hex='';
    temp = /^([a-f0-9])([a-f0-9])([a-f0-9])$/i.exec(temp).slice(1);
    for (var i=0;i<3;i++) hex+=temp[i]+temp[i];
  }
  var triplets = /^([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})$/i.exec(hex).slice(1);
  return {
    red:   parseInt(triplets[0],16),
    green: parseInt(triplets[1],16),
    blue:  parseInt(triplets[2],16)
  }
}

/***********************************************************
* REFERENCE:http://www.cs.rit.edu/~ncs/color/t_convert.html  *
************************************************************/
function getHUE(rgbc){
    var r = rgbc.red / 255;
    var g = rgbc.green / 255;
    var b = rgbc.blue / 255;
    var h = 0;

    var min = Math.min(r, g, b);
    var max = Math.max(r, g, b);
    var delta = max - min;

    if(r == max){
        h = (g - b) / delta; // between yellown and magenta
    } else if (g == max){
        h = 2 + (b - r) / delta; // between cyan and yellown
    } else if (b == max){
        h = 4 + (r - g) / delta; // between magenta and cyan
    }

    // Degrees
    h *= 60;
    if(h < 0){
        h += 360;
    }

    // Degrees to HUE
    h *= 182;

    return Math.round(h);
}

function setHue1(){
    var color = $("#inputColor1").val();
    var brightness = $("#inputBright1").val();
    var inputSat = $("#inputSat1").val();
	var rgbc = hexToRGB(color);
    var hue = getHUE(rgbc);
	var lightsAPIURL = ip + "/api/newdeveloper/lights/1/state";
	var http = new XMLHttpRequest();

	var message = '{"on":true, "sat":'+inputSat+', "bri":'+brightness+',"hue":'+hue+'}';

    console.log(message);

	http.open("PUT",lightsAPIURL,true);
	http.send(message);
}


function setHue2(){

    var color = $("#inputColor2").val();
    var brightness = $("#inputBright2").val();
    var inputSat = $("#inputSat2").val();
	var rgbc =hexToRGB(color);
    var hue = getHUE(rgbc);
    var lightsAPIURL = ip + "/api/newdeveloper/lights/2/state";
    var http = new XMLHttpRequest();

    var message = '{"on":true, "sat":'+inputSat+', "bri":'+brightness+',"hue":'+hue+'}';
    http.open("PUT",lightsAPIURL,true);
    http.send(message);
}

function setHue3(){

    var color = $("#inputColor3").val();
    var brightness = $("#inputBright3").val();
    var inputSat = $("#inputSat3").val();
	var rgbc =hexToRGB(color);
    var hue = getHUE(rgbc);
    var lightsAPIURL = ip + "/api/newdeveloper/lights/3/state";
    var http = new XMLHttpRequest();

    var message = '{"on":true, "sat":'+inputSat+', "bri":'+brightness+',"hue":'+hue+'}';
    http.open("PUT",lightsAPIURL,true);
    http.send(message);
}


