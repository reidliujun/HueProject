/**
* Patterns Tab
*/
var x1, y1, z1, x2, y2, z2;
var alpha1, beta1, gamma1, alpha2, beta2, gamma2;
var orientationChange;
var orientationChangeAlpha;
var orientationChangeBeta;
var orientationChangeGamma;
var accelerationChange;
var accelerationChangeX;
var accelerationChangeY;
var accelerationChangeZ;

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

function patternsInit(){
    var has_touch = 'ontouchstart' in document.documentElement;

    // Position and orientation variables
    x1 = 0, y1 = 0, z1 = 0, x2 = 0, y2 = 0, z2 = 0;
    alpha1 = 0, beta1 = 0, gamma1 = 0, alpha2 = 0, beta2 = 0, gamma2 = 0;
    orientationChange = false;
    accelerationChange = false;

    if(has_touch) {   
        window.addEventListener('devicemotion', capture_motion, false);
        window.addEventListener('deviceorientation', capture_orientation, false);

        window.addEventListener("compassneedscalibration", function(event) {
            alert('Your compass needs calibrating! Wave your device in a figure-eight motion');
            event.preventDefault();
        }, true);
    } 

    // Stop the Free motion events
    freeMotionStop(); 
    
    /*
    // If the Flip switch is ON and we enter the "patterns" view, we need to turn OFF the switch...    
    if($('#freemotionslider').val() == "on"){
        $('#freemotionslider').val('off').slider('refresh');
    }
    */
}

function patternsStop(){
    window.removeEventListener('devicemotion', capture_motion, false);
    window.removeEventListener('deviceorientation', capture_orientation, false);
}

function capture_orientation (event) {
    var sensitivityAlpha = 60; // Degree
    var sensitivityBeta = 35; // Degree

     alpha1 = event.alpha;
     beta1 = event.beta;
     gamma1 = event.gamma;

    // Detect left-right movements
    var changeAlpha = alpha1-alpha2;    
    if (Math.abs(changeAlpha) > sensitivityAlpha) {
        orientationChangeAlpha = true;
        if(changeAlpha > 0){
            triggerMotion('right');
        } else {
            triggerMotion('left');
        }
    } else {
        orientationChangeAlpha = false;
    }

     // Detect up-down movements
     var changeBeta = beta1-beta2;
     if (Math.abs(changeBeta) > sensitivityBeta) {
        orientationChangeBeta = true;
        if(changeBeta > 0){
            triggerMotion('up');
        } else {
            triggerMotion('down');
        }
    } else {
        orientationChangeBeta = false;
    }

    alpha2 = alpha1;
    beta2 = beta1;
    gamma2 = gamma1;
}

function capture_motion() {    
    var sensitivity = 6;  // m/s2     
    x1 = event.accelerationIncludingGravity.x;  
    y1 = event.accelerationIncludingGravity.y;  
    z1 = event.accelerationIncludingGravity.z;        

    var change = Math.abs(x1-x2+y1-y2+z1-z2);
    var changeX = Math.abs(x1-x2);
    var changeY = Math.abs(y1-y2);
    var changeZ = Math.abs(z1-z2);

    if (change > sensitivity) {
       accelerationChange = true;
    } else {
        accelerationChange = false;
    }
    
    // X
    if (changeX > sensitivity) {
       accelerationChangeX = true;
    } else {
        accelerationChangeX = false;
    }

    // X
    if (changeY > sensitivity) {
       accelerationChangeY = true;
    } else {
        accelerationChangeY = false;
    }

    // Z
    if (changeZ > sensitivity) {
       accelerationChangeZ = true;
    } else {
        accelerationChangeZ = false;
    }

    // Update new position
    x2 = x1;
    y2 = y1;
    z2 = z1;    
}   

function triggerMotion(eventString){ 
    if(accelerationChange){ 
        switch(eventString){
            case 'up':  if(orientationChangeBeta){
                            OnOffWithMotion(true);
                        }
                        break;
            case 'down': if(orientationChangeBeta){
                            OnOffWithMotion(false); 
                        }
                        break;
            case 'left':    if(orientationChangeAlpha && accelerationChangeX){
                                changeColorWithMotion('left');
                            }
                            break;
            case 'right':   if(orientationChangeAlpha && accelerationChangeX){
                                changeColorWithMotion('right');
                            }
                            break;
        }
    }
}

function OnOffWithMotion(event){   
    

    // Check which light we want to change
    var checkboxLight1 = $("#checkboxLight1").is(':checked');
    var checkboxLight2 = $("#checkboxLight2").is(':checked');
    var checkboxLight3 = $("#checkboxLight3").is(':checked');

    console.log("OnOffWithMotion:"+event);

    if(!event){ // Lights go off       
        var lights = lightsObject;//getLightsPattern();
        if(typeof lights.light1 !== "undefined"){ currentLightState1 = lights.light1; }
        if(typeof lights.light2 !== "undefined"){ currentLightState2 = lights.light2; }
        if(typeof lights.light3 !== "undefined"){ currentLightState3 = lights.light3; }      

        if(checkboxLight1){
            var http1 = new XMLHttpRequest();
            var lightsAPIURL1 = ip + "/api/newdeveloper/lights/1/state";
            var message1 = '{"on":false}';
            http1.open("PUT",lightsAPIURL1,true);
            http1.send(message1);
            console.log(message1);

            lightsObject.light1.state.on = false;
        }

        if(checkboxLight2){
            var http2 = new XMLHttpRequest();
            var lightsAPIURL2 = ip + "/api/newdeveloper/lights/2/state";
            var message2 = '{"on":false}';
            http2.open("PUT",lightsAPIURL2,true);
            http2.send(message2);
            console.log(message2);

            lightsObject.light2.state.on = false;

        }

        if(checkboxLight3){
            var http3 = new XMLHttpRequest();
            var lightsAPIURL3 = ip + "/api/newdeveloper/lights/3/state";
            var message3 = '{"on":false}';
            http3.open("PUT",lightsAPIURL3,true);
            http3.send(message3);
            console.log(message3);

            lightsObject.light3.state.on = false;

        }
    } else { // Lights go on
        // Light1
        if(checkboxLight1){
            var http1 = new XMLHttpRequest();
            var lightsAPIURL1 = ip + "/api/newdeveloper/lights/1/state";
            var message1 = '{"on":true, "sat":'+currentLightState1.state.sat+', "bri":'+currentLightState1.state.bri+', "hue":'+currentLightState1.state.hue+'}';         
            http1.open("PUT",lightsAPIURL1,true);
            http1.send(message1);
            console.log("Bulb1: "+message1);

            lightsObject.light1 = {"state": {
                                "on": true,
                                "hue": currentLightState1.state.hue,
                                "bri": currentLightState1.state.bri,
                                "sat": currentLightState1.state.sat
                            }};
        }

        // Light2
        if(checkboxLight2){
            var http2 = new XMLHttpRequest();
            var lightsAPIURL2 = ip + "/api/newdeveloper/lights/2/state";
            var message2 = '{"on":true, "sat":'+currentLightState2.state.sat+', "bri":'+currentLightState2.state.bri+', "hue":'+currentLightState2.state.hue+'}';         
            http2.open("PUT",lightsAPIURL2,true);
            http2.send(message2);
            console.log("Bulb2: "+message2);

            lightsObject.light2 = {"state": {
                                "on": true,
                                "hue": currentLightState2.state.hue,
                                "bri": currentLightState2.state.bri,
                                "sat": currentLightState2.state.sat
                            }};
        }

        // Light3
        if(checkboxLight3){
            var http3 = new XMLHttpRequest();
            var lightsAPIURL3 = ip + "/api/newdeveloper/lights/3/state";
            var message3 = '{"on":true, "sat":'+currentLightState3.state.sat+', "bri":'+currentLightState3.state.bri+', "hue":'+currentLightState3.state.hue+'}';         
            http3.open("PUT",lightsAPIURL3,true);
            http3.send(message3);
            console.log("Bulb3: "+message3);

            lightsObject.light3 = {"state": {
                                "on": true,
                                "hue": currentLightState3.state.hue,
                                "bri": currentLightState3.state.bri,
                                "sat": currentLightState3.state.sat
                            }};
        }
    }
}

function changeColorWithMotion(event){
    var lights = lightsObject;//getLightsPattern();
    if(typeof lights.light1 !== "undefined"){ currentLightState1 = lights.light1; }
    if(typeof lights.light2 !== "undefined"){ currentLightState2 = lights.light2; }
    if(typeof lights.light3 !== "undefined"){ currentLightState3 = lights.light3; } 

    console.log("changeColorWithMotion:"+event);

    // Check which light we want to change
    var checkboxLight1 = $("#checkboxLight1").is(':checked');
    var checkboxLight2 = $("#checkboxLight2").is(':checked');
    var checkboxLight3 = $("#checkboxLight3").is(':checked');

    if(checkboxLight1){
        // Light 1
        var http1 = new XMLHttpRequest();
        var lightsAPIURL1 = ip + "/api/newdeveloper/lights/1/state";        
        var saturation1 = lights.light1.state.sat; 
        var brightness1 = lights.light1.state.bri; 
        var hue1 = lights.light1.state.hue; 

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

        //var message1 = '{"on":true, "sat":'+saturation1+', "bri":'+brightness1+', "hue":'+hue1+'}';
        var message1 = '{"sat":'+saturation1+', "bri":'+brightness1+', "hue":'+hue1+'}';
        http1.open("PUT",lightsAPIURL1,true);
        http1.send(message1);
        console.log("light1: "+message1);

        lightsObject.light1 = {"state": {
                                //"on": true,
                                "hue": hue1,
                                "bri": brightness1,
                                "sat": saturation1
                            }};
    }

    if(checkboxLight2){
        // Light 2
        var http2 = new XMLHttpRequest();
        var lightsAPIURL2 = ip + "/api/newdeveloper/lights/2/state";        
        var saturation2 = lights.light2.state.sat; 
        var brightness2 = lights.light2.state.bri; 
        var hue2 = lights.light2.state.hue; 

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

        //var message2 = '{"on":true, "sat":'+saturation2+', "bri":'+brightness2+',"hue":'+hue2+'}';
        var message2 = '{"sat":'+saturation2+', "bri":'+brightness2+', "hue":'+hue2+'}';
        http2.open("PUT",lightsAPIURL2,true);
        http2.send(message2);
        console.log("light2: "+message2);

        lightsObject.light2 = {"state": {
                                //"on": true,
                                "hue": hue2,
                                "bri": brightness2,
                                "sat": saturation2
                            }};
    }

    if(checkboxLight3){
        // Light 3
        var http3 = new XMLHttpRequest();
        var lightsAPIURL3 = ip + "/api/newdeveloper/lights/3/state";        
        var saturation3 = lights.light3.state.sat; 
        var brightness3 = lights.light3.state.bri; 
        var hue3 = lights.light3.state.hue; 

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

        //var message3 = '{"on":true, "sat":'+saturation3+', "bri":'+brightness3+',"hue":'+hue3+'}';
        var message3 = '{"sat":'+saturation3+', "bri":'+brightness3+', "hue":'+hue3+'}';
        http3.open("PUT",lightsAPIURL3,true);
        http3.send(message3);
        console.log("light3: "+message3);

        lightsObject.light3 = {"state": {
                                //"on": true,
                                "hue": hue3,
                                "bri": brightness3,
                                "sat": saturation3
                            }};
    }
}