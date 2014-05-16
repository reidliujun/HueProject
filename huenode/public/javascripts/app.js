//reference for the hue http command: http://developers.meethue.com/gettingstarted.html
//The config url of the hue is: http://<bridge ip address>/debug/clip.html
//in the following case with the ip, it can be: http://192.168.1.100/debug/clip.html

var ip = "http://192.168.1.100";
var tmp;
var lightsNumber = 3;
var currentLightState1 = {
    "state": {
        "hue": 0,
        "bri": 255,
        "sat": 255
    }
};
var currentLightState2 = {
    "state": {
        "hue": 0,
        "bri": 255,
        "sat": 255
    }
};
var currentLightState3 = {
    "state": {
        "hue": 0,
        "bri": 255,
        "sat": 255
    }
};

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

/**
* Patterns Tab
*/

function patternsInit(){

    var has_touch = 'ontouchstart' in document.documentElement;

    // Position and orientation variables
    var x1 = 0, y1 = 0, z1 = 0, x2 = 0, y2 = 0, z2 = 0;
    var alpha1 = 0, beta1 = 0, gamma1 = 0, alpha2 = 0, beta2 = 0, gamma2 = 0;
    var orientationChange = false;
    var accelerationChange = false;

    if(has_touch) {   
        window.addEventListener('devicemotion', capture_motion, false);
        window.addEventListener('deviceorientation', capture_orientation, false);
    }   

    function capture_orientation (event) {
        var sensitivity = 35; // Degree

         alpha1 = event.alpha;
         beta1 = event.beta;
         gamma1 = event.gamma;

         // Detect up-down movements
         var changeBeta = beta1-beta2;
         if (Math.abs(changeBeta) > sensitivity) {
            orientationChange = true;
            if(changeBeta > 0){
                triggerMotion('up');
            } else {
                triggerMotion('down');
            }
        } else {
            orientationChange = false;
        }

        // Detect left-right movements
        var changeAlpha = alpha1-alpha2;
        if (Math.abs(changeAlpha) > sensitivity) {
            orientationChange = true;
            if(changeAlpha > 0){
                triggerMotion('right');
            } else {
                triggerMotion('left');
            }
        } else {
            orientationChange = false;
        }

        alpha2 = alpha1;
        beta2 = beta1;
        gamma2 = gamma1;
    }

    function capture_motion() {    
        var sensitivity = 5;  // m/s2     
        x1 = event.accelerationIncludingGravity.x;  
        y1 = event.accelerationIncludingGravity.y;  
        z1 = event.accelerationIncludingGravity.z;        

        var change = Math.abs(x1-x2+y1-y2+z1-z2);

        if (change > sensitivity) {
           accelerationChange = true;
        } else {
            accelerationChange = false;
        }

        // Update new position
        x2 = x1;
        y2 = y1;
        z2 = z1;
        
    }   

    function triggerMotion(eventString){
        if(orientationChange && accelerationChange){

            setTimeout(function() {
                switch(eventString){
                    case 'up': OnOff(true); break;
                    case 'down': OnOff(false); break;
                    case 'left': sideColor('left'); break;
                    case 'right': sideColor('right'); break;
                }
            }, 1000);
        }
    }

    function OnOff(event){    
        var http = new XMLHttpRequest();

        // Check which light we want to change
        var checkboxLight1 = $("#checkboxLight1").is(':checked');
        var checkboxLight2 = $("#checkboxLight2").is(':checked');
        var checkboxLight3 = $("#checkboxLight3").is(':checked');

        if(!event){ // Lights go off
            var lights = getLights();
            currentLightState1 = lights.light1;
            currentLightState2 = lights.light2;
            currentLightState3 = lights.light3;

            if(checkboxLight1){
                var lightsAPIURL1 = ip + "/api/newdeveloper/lights/1/state";
                var message1 = '{"on":false}';
                http.open("PUT",lightsAPIURL1,true);
                http.send(message1);
            }

            if(checkboxLight2){
                var lightsAPIURL2 = ip + "/api/newdeveloper/lights/2/state";
                var message2 = '{"on":false}';
                http.open("PUT",lightsAPIURL2,true);
                http.send(message2);
            }

            if(checkboxLight3){
                var lightsAPIURL3 = ip + "/api/newdeveloper/lights/3/state";
                var message3 = '{"on":false}';
                http.open("PUT",lightsAPIURL3,true);
                http.send(message3);
            }
        } else { // Lights go on
            // Light1
            if(checkboxLight1){
                var lightsAPIURL1 = ip + "/api/newdeveloper/lights/1/state";
                var message1 = '{"on":true, "sat":'+currentLightState1.state.sat+', "bri":'+currentLightState1.state.bri+',"hue":'+currentLightState1.state.hue+'}';         
                http.open("PUT",lightsAPIURL1,true);
                http.send(message1);
            }

            // Light2
            if(checkboxLight2){
                var lightsAPIURL2 = ip + "/api/newdeveloper/lights/2/state";
                var message2 = '{"on":true, "sat":'+currentLightState2.state.sat+', "bri":'+currentLightState2.state.bri+',"hue":'+currentLightState2.state.hue+'}';         
                http.open("PUT",lightsAPIURL2,true);
                http.send(message2);
            }

            // Light3
            if(checkboxLight3){
                var lightsAPIURL3 = ip + "/api/newdeveloper/lights/3/state";
                var message3 = '{"on":true, "sat":'+currentLightState3.state.sat+', "bri":'+currentLightState3.state.bri+',"hue":'+currentLightState3.state.hue+'}';         
                http.open("PUT",lightsAPIURL3,true);
                http.send(message3);
            }
        }
    }

    function sideColor(event){
        var lights = getLights();
        var http = new XMLHttpRequest();

        // Check which light we want to change
        var checkboxLight1 = $("#checkboxLight1").is(':checked');
        var checkboxLight2 = $("#checkboxLight2").is(':checked');
        var checkboxLight3 = $("#checkboxLight3").is(':checked');

        if(checkboxLight1){
            // Light 1
            var lightsAPIURL1 = ip + "/api/newdeveloper/lights/1/state";        
            var saturation1 = 1; //lights.light1.state.sat; // Return to object value when the server is present
            var brightness1 = 1; //lights.light1.state.bri; // Return to object value when the server is present
            var hue1 = 60000; //lights.light1.state.hue; // Return to object value when the server is present

            if(event == 'left'){
                hue1 -= 10920;
                if(hue1 < 0){
                    hue1 += 65535;
                }
            } else if(event == 'right'){
                hue1 += 10920;
                if(hue1 > 65535){
                    hue1 -= 65535;
                }
            }

            var message1 = '{"on":true, "sat":'+saturation1+', "bri":'+brightness1+',"hue":'+hue1+'}';
            http.open("PUT",lightsAPIURL1,true);
            http.send(message1);
            console.log("light1: "+message1);
        }

        if(checkboxLight2){
            // Light 2
            var lightsAPIURL2 = ip + "/api/newdeveloper/lights/2/state";        
            var saturation2 = 1; //lights.light1.state.sat; // Return to object value when the server is present
            var brightness2 = 1; //lights.light1.state.bri; // Return to object value when the server is present
            var hue2 = 60000; //lights.light1.state.hue; // Return to object value when the server is present

            if(event == 'left'){
                hue2 -= 10920;
                if(hue2 < 0){
                    hue2 += 65535;
                }
            } else if(event == 'right'){
                hue2 += 10920;
                if(hue2 > 65535){
                    hue2 -= 65535;
                }
            }

            var message2 = '{"on":true, "sat":'+saturation2+', "bri":'+brightness2+',"hue":'+hue2+'}';
            http.open("PUT",lightsAPIURL2,true);
            http.send(message2);
            console.log("light2: "+message2);
        }

        if(checkboxLight3){
            // Light 3
            var lightsAPIURL3 = ip + "/api/newdeveloper/lights/3/state";        
            var saturation3 = 1; //lights.light1.state.sat; // Return to object value when the server is present
            var brightness3 = 1; //lights.light1.state.bri; // Return to object value when the server is present
            var hue3 = 60000; //lights.light1.state.hue; // Return to object value when the server is present

            if(event == 'left'){
                hue3 -= 10920;
                if(hue3 < 0){
                    hue3 += 65535;
                }
            } else if(event == 'right'){
                hue3 += 10920;
                if(hue3 > 65535){
                    hue3 -= 65535;
                }
            }

            var message3 = '{"on":true, "sat":'+saturation3+', "bri":'+brightness3+',"hue":'+hue3+'}';
            http.open("PUT",lightsAPIURL3,true);
            http.send(message3);
            console.log("light3: "+message3);
        }
    }
}

function patternsStop(){
    window.removeEventListener('devicemotion', capture_motion, false);
    window.removeEventListener('deviceorientation', capture_orientation, false);
}

/**
* Free-motion Tab
*/

var alphaFree;
var betaFree;
var gammaFree;
var accelerationFree;
var instanceFree = 1;

function freeMotionInit(){

    var has_touch = 'ontouchstart' in document.documentElement;

    // Position and orientation variables
    var x1 = 0, y1 = 0, z1 = 0, x2 = 0, y2 = 0, z2 = 0;
    var alpha1 = 0, beta1 = 0, gamma1 = 0, alpha2 = 0, beta2 = 0, gamma2 = 0;
    var orientationChange = false;
    var accelerationChange = false;

    if(has_touch) {   
        window.addEventListener('devicemotion', capture_motion_free, false);
        window.addEventListener('deviceorientation', capture_orientation_free, false);
    }   

    function capture_orientation_free (event) {
        var sensitivity = 10; // Degree

         alpha1 = event.alpha;
         beta1 = event.beta;
         gamma1 = event.gamma;

         var motionObject;

         // Detect left-right movements
        var changeAlpha = alpha1-alpha2;
        if (Math.abs(changeAlpha) > sensitivity) {
            orientationChange = true;
            alphaFree = alpha1;
            triggerMotionFree();
        } else {
            orientationChange = false;
        }

         // Detect up-down movements
         var changeBeta = beta1-beta2;
         if (Math.abs(changeBeta) > sensitivity) {
            orientationChange = true;
            betaFree = beta1;
            triggerMotionFree();
        } else {
            orientationChange = false;
        }

        // Detect rotation movements
        var changeGamma = gamma1-gamma2;
        if (Math.abs(changeGamma) > sensitivity) {
            orientationChange = true;
            gammaFree = gamma1;
            triggerMotionFree();
        } else {
            orientationChange = false;
        }

        alpha2 = alpha1;
        beta2 = beta1;
        gamma2 = gamma1;
    }

    function capture_motion_free() {    
        var sensitivity = 5;  // m/s2     
        x1 = event.accelerationIncludingGravity.x;  
        y1 = event.accelerationIncludingGravity.y;  
        z1 = event.accelerationIncludingGravity.z;        

        var change = Math.abs(x1-x2+y1-y2+z1-z2);

        if (change > sensitivity) {
            accelerationChange = true;
            accelerationFree = change;
            triggerMotionFree();
        } else {
            accelerationChange = false;
        }

        // Update new position
        x2 = x1;
        y2 = y1;
        z2 = z1;
        
    }  

    function triggerMotionFree(){
        if(orientationChange && accelerationChange){   
            var hue = degreeToHUE(alphaFree, betaFree, gammaFree);

            // Min acceleration 5 m/s2 -> 0
            // Max acceleration 20 m/s2 -> 15
            var accelerationAdjustment = accelerationFree - 5;

            // Min brightness 75
            // Max brightness 255
            var range = 75 + (accelerationAdjustment * 8.5);
            if(range > 255){ range = 255; }
            if(range < 0){ range = 0; }
            var brightness = range;
            var saturation = range;

            /*
            console.log("Hue: "+hue);
            console.log("Brightness: "+brightness);
            console.log("Saturation: "+saturation);
            console.log(" --- ");
            */

            // Light 1
            var http = new XMLHttpRequest();
            var message = '{"on":true, "sat":'+saturation+', "bri":'+brightness+',"hue":'+hue+'}';
            
            setInterval(function(){
                if(instanceFree > 3) instanceFree = 1;
                var lightsAPIURL = ip + "/api/newdeveloper/lights/"+instanceFree+"/state"; 
                http.open("PUT",lightsAPIURL,true);
                http.send(message);
                console.log(message);
                instanceFree += 1;
            },3000);
            
        }
    }

    function degreeToHUE(alpha, beta, gamma){
        var r = Math.abs(alpha) / 360;
        var g = Math.abs(beta) / 90;
        var b = Math.abs(gamma) / 180;
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

}

function freeMotionStop(){
    window.removeEventListener('devicemotion', capture_motion_free, false);
    window.removeEventListener('deviceorientation', capture_orientation_free, false);
}

// General functions
function getLights(){
    var light1, light2, light3;

    for(var i = 1; i <= lightsNumber; i++){
        var lightsAPIURL = ip + "/api/newdeveloper/lights/"+i+"/state"; 
        var http = new XMLHttpRequest();
        http.open("GET",lightsAPIURL,true);
        http.send();

        http.onreadystatechange=function(){
          if (http.readyState==4 && http.status==200){
                switch(i){
                    case 1: light1 = http.responseText; break;
                    case 2: light2 = http.responseText; break;
                    case 3: light3 = http.responseText; break;
                }                
            }
        }
    }

    var object = {"light1":light1, "light2":light2, "light3":light3};
    return object;    
}

