/**
* Free-motion Tab
*/
var x1, y1, z1, x2, y2, z2;
var alpha1, beta1, gamma1, alpha2, beta2, gamma2;
var orientationChange;
var accelerationChange;
var alphaFreeMotion;
var betaFreeMotion;
var gammaFreeMotion;
var accelerationFreeMotion;
var activeLightInstance = 1;
var reduceLightLevelsInterval;

function toggleFreeMotion(){
    var state = $('#freemotionslider').val();    
    if(state == "on"){
        freeMotionInit();
    } else {
        freeMotionStop();
    }
}

function freeMotionInit(){
    var has_touch = 'ontouchstart' in document.documentElement;

    // Position and orientation variables
    x1 = 0, y1 = 0, z1 = 0, x2 = 0, y2 = 0, z2 = 0;
    alpha1 = 0, beta1 = 0, gamma1 = 0, alpha2 = 0, beta2 = 0, gamma2 = 0;
    orientationChange = false;
    accelerationChange = false;

    if(has_touch) {   
        window.addEventListener('devicemotion', captureMotionFree, false);
        window.addEventListener('deviceorientation', captureOrientationFree, false);
    }   

    reduceLightLevelsInterval = window.setInterval(function(){
        reduceLightLevels();
    }, 2000);
}

function freeMotionStop(){
    window.removeEventListener('devicemotion', captureMotionFree, false);
    window.removeEventListener('deviceorientation', captureOrientationFree, false);
    window.clearInterval(reduceLightLevelsInterval);
}

function reduceLightLevels(){
    var lights = getLights();
    // Send messages to lights
    var http = new XMLHttpRequest();
    var level1 = (level1 >= 125) ? (lights.light1.state.sat - 10) : 125;
    var level2 = (level2 >= 125) ? (lights.light2.state.sat - 10) : 125;
    var level3 = (level3 >= 125) ? (lights.light3.state.sat - 10) : 125;

    var message1 = '{"on":true, "sat":'+level1+', "bri":'+level1+'}';
    var message2 = '{"on":true, "sat":'+level2+', "bri":'+level2+'}';
    var message3 = '{"on":true, "sat":'+level3+', "bri":'+level3+'}';
   
    // Light 1
    var lightsAPIURL1 = ip + "/api/newdeveloper/lights/1/state"; 
    http.open("PUT",lightsAPIURL1,true);
    http.send(message1);
    console.log(message1);

    // Light 2
    var lightsAPIURL2 = ip + "/api/newdeveloper/lights/2/state"; 
    http.open("PUT",lightsAPIURL2,true);
    http.send(message2);
    console.log(message2);

    // Light 3
    var lightsAPIURL3 = ip + "/api/newdeveloper/lights/3/state"; 
    http.open("PUT",lightsAPIURL3,true);
    http.send(message3);
    console.log(message3);
}

function captureOrientationFree (event) {
    var sensitivity = 10; // Degree

     alpha1 = event.alpha;
     beta1 = event.beta;
     gamma1 = event.gamma;

     var motionObject;

     // Detect left-right movements
    var changeAlpha = alpha1-alpha2;
    if (Math.abs(changeAlpha) > sensitivity) {
        orientationChange = true;
        alphaFreeMotion = alpha1;
        triggerMotionFree();
    } else {
        orientationChange = false;
    }

     // Detect up-down movements
     var changeBeta = beta1-beta2;
     if (Math.abs(changeBeta) > sensitivity) {
        orientationChange = true;
        betaFreeMotion = beta1;
        triggerMotionFree();
    } else {
        orientationChange = false;
    }

    // Detect rotation movements
    var changeGamma = gamma1-gamma2;
    if (Math.abs(changeGamma) > sensitivity) {
        orientationChange = true;
        gammaFreeMotion = gamma1;
        triggerMotionFree();
    } else {
        orientationChange = false;
    }

    alpha2 = alpha1;
    beta2 = beta1;
    gamma2 = gamma1;
}

function captureMotionFree() {    
    var sensitivity = 5;  // m/s2     
    x1 = event.accelerationIncludingGravity.x;  
    y1 = event.accelerationIncludingGravity.y;  
    z1 = event.accelerationIncludingGravity.z;        

    var change = Math.abs(x1-x2+y1-y2+z1-z2);

    if (change > sensitivity) {
        accelerationChange = true;
        accelerationFreeMotion = change;
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
        var hue = degreeToHUE(alphaFreeMotion, betaFreeMotion, gammaFreeMotion);

        // Min acceleration 5 m/s2 -> 0
        // Max acceleration 20 m/s2 -> 15
        var accelerationAdjustment = accelerationFreeMotion - 5;

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

        // Send messages to lights
        var http = new XMLHttpRequest();
        var message = '{"on":true, "sat":'+saturation+', "bri":'+brightness+',"hue":'+hue+'}';
       
        if(activeLightInstance > 3) activeLightInstance = 1;
        var lightsAPIURL = ip + "/api/newdeveloper/lights/"+activeLightInstance+"/state"; 
        http.open("PUT",lightsAPIURL,true);
        http.send(message);
        console.log(message);
        activeLightInstance += 1;
        
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