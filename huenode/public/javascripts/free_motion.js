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

var lightsObject = {"light1":currentLightState1, "light2":currentLightState2, "light3":currentLightState3};

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
    }, 5000);
}

function freeMotionStop(){
    window.removeEventListener('devicemotion', captureMotionFree, false);
    window.removeEventListener('deviceorientation', captureOrientationFree, false);
    window.clearInterval(reduceLightLevelsInterval);
}

function reduceLightLevels(){
    var lights = lightsObject;
    var minBright = 60;
    // Send messages to lights
    
    var level1 = (lights.light1.state.sat >= minBright) ? (lights.light1.state.sat - 10) : minBright;
    var level2 = (lights.light2.state.sat >= minBright) ? (lights.light2.state.sat - 10) : minBright;
    var level3 = (lights.light3.state.sat >= minBright) ? (lights.light3.state.sat - 10) : minBright;

    var message1 = '{"on":true, "sat":'+level1+', "bri":'+level1+'}';
    var message2 = '{"on":true, "sat":'+level2+', "bri":'+level2+'}';
    var message3 = '{"on":true, "sat":'+level3+', "bri":'+level3+'}';
   
    // Light 1
    var http1 = new XMLHttpRequest();
    var lightsAPIURL1 = ip + "/api/newdeveloper/lights/1/state"; 
    http1.open("PUT",lightsAPIURL1,true);
    http1.send(message1);
    console.log(message1);

    lightsObject.light1.state.bri = level1;
    lightsObject.light1.state.sat = level1;

    // Light 2
    var http2 = new XMLHttpRequest();
    var lightsAPIURL2 = ip + "/api/newdeveloper/lights/2/state"; 
    http2.open("PUT",lightsAPIURL2,true);
    http2.send(message2);
    console.log(message2);

    lightsObject.light2.state.bri = level2;
    lightsObject.light2.state.sat = level2;

    // Light 3
    var http3 = new XMLHttpRequest();
    var lightsAPIURL3 = ip + "/api/newdeveloper/lights/3/state"; 
    http3.open("PUT",lightsAPIURL3,true);
    http3.send(message3);
    console.log(message3);

    lightsObject.light3.state.bri = level3;
    lightsObject.light3.state.sat = level3;
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
    var sensitivity = 0;  // m/s2     
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

        // Send messages to lights
        var message = '{"on":true, "sat":'+saturation+', "bri":'+brightness+',"hue":'+hue+'}';
       
        if(activeLightInstance > 3){
            activeLightInstance = 1;
        }

        var http1 = new XMLHttpRequest();
        var http2 = new XMLHttpRequest();
        var http3 = new XMLHttpRequest();

        switch(activeLightInstance){
            case 1: 
                    var lightsAPIURL = ip + "/api/newdeveloper/lights/"+activeLightInstance+"/state"; 
                    http1.open("PUT",lightsAPIURL,true);
                    http1.send(message);
                    console.log(message);
                    lightsObject.light1 = {"state": {
                                "on": true,
                                "hue": hue,
                                "bri": brightness,
                                "sat": saturation
                            }};
                    break;
            case 2: 
                    var lightsAPIURL = ip + "/api/newdeveloper/lights/"+activeLightInstance+"/state"; 
                    http2.open("PUT",lightsAPIURL,true);
                    http2.send(message);
                    console.log(message);
                    lightsObject.light2 = {"state": {
                                "on": true,
                                "hue": hue,
                                "bri": brightness,
                                "sat": saturation
                            }};
                    break;
            case 3: 
                    var lightsAPIURL = ip + "/api/newdeveloper/lights/"+activeLightInstance+"/state"; 
                    http3.open("PUT",lightsAPIURL,true);
                    http3.send(message);
                    console.log(message);
                    lightsObject.light3 = {"state": {
                                "on": true,
                                "hue": hue,
                                "bri": brightness,
                                "sat": saturation
                            }};
                    break;
        }       

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
