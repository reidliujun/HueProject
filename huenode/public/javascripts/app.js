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

/**
* Acceleremoter tests
*/
function accelerometerInit(){

    var has_touch = 'ontouchstart' in document.documentElement;

    // Position and orientation variables
    var x1 = 0, y1 = 0, z1 = 0, x2 = 0, y2 = 0, z2 = 0;
    var alpha1 = 0, beta1 = 0, gamma1 = 0, alpha2 = 0, beta2 = 0, gamma2 = 0;

    if(has_touch) {   
        window.addEventListener('devicemotion', capture_motion, false);
        window.addEventListener('deviceorientation', capture_orientation, false);
    }   

    function capture_orientation (event) {
        var sensitivity = 25;

         alpha1 = event.alpha;
         beta1 = event.beta;
         gamma1 = event.gamma;

         var change = Math.abs(alpha1-alpha2+beta1-beta2+gamma1-gamma2);

         if (change > sensitivity) {
            console.log('Orientation - Alpha: '+alpha1+', Beta: '+beta1+', Gamma: '+gamma1);
        }

        alpha2 = alpha1;
        beta2 = beta1;
        gamma2 = gamma1;
    }

    function capture_motion() {    
        var sensitivity = 5;        
        x1 = event.acceleration.x;  
        y1 = event.acceleration.y;  
        z1 = event.acceleration.z;        

        var change = Math.abs(x1-x2+y1-y2+z1-z2);

        if (change > sensitivity) {
           console.log("Motion x: "+x1+", y: "+y1,", z: "+z1); 
        }

        // Update new position
        x2 = x1;
        y2 = y1;
        z2 = z1;
        
    }   
}