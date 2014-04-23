//reference for the hue http command: http://developers.meethue.com/gettingstarted.html
//The config url of the hue is: http://<bridge ip address>/debug/clip.html
//in the following case with the ip, it can be: http://192.168.1.100/debug/clip.html

var ip = "http://192.168.1.100";
var tmp;
var lightsNumber;

function setHue1(){

    var color = $("#inputColor1").val();
    var brightness = $("#inputBright1").val();
    var inputSat = $("#inputSat1").val();
	var lights = ip + "/api/newdeveloper/lights/1/state";
	var http = new XMLHttpRequest();

	var message = '{"on":true, "sat":'+inputSat+', "bri":'+brightness+',"hue":'+color+'}';
	http.open("PUT",lights,true);
	http.send(message);
}


function setHue2(){

    var color = $("#inputColor2").val();
    var brightness = $("#inputBright2").val();
    var inputSat = $("#inputSat2").val();
    var lights = ip + "/api/newdeveloper/lights/2/state";
    var http = new XMLHttpRequest();

    var message = '{"on":true, "sat":'+inputSat+', "bri":'+brightness+',"hue":'+color+'}';
    http.open("PUT",lights,true);
    http.send(message);
}

function setHue3(){

    var color = $("#inputColor3").val();
    var brightness = $("#inputBright3").val();
    var inputSat = $("#inputSat3").val();
    var lights = ip + "/api/newdeveloper/lights/3/state";
    var http = new XMLHttpRequest();

    var message = '{"on":true, "sat":'+inputSat+', "bri":'+brightness+',"hue":'+color+'}';
    http.open("PUT",lights,true);
    http.send(message);
}