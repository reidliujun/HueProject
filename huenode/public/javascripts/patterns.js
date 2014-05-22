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
    var sensitivityAlpha = 90; // Degree
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
    var sensitivity = 7;  // m/s2     
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
    var http = new XMLHttpRequest();

    // Check which light we want to change
    var checkboxLight1 = $("#checkboxLight1").is(':checked');
    var checkboxLight2 = $("#checkboxLight2").is(':checked');
    var checkboxLight3 = $("#checkboxLight3").is(':checked');

    console.log("OnOffWithMotion:"+event);

    if(!event){ // Lights go off       
        var lights = getLights();
        if(typeof lights.light1 !== "undefined"){ currentLightState1 = lights.light1; }
        if(typeof lights.light2 !== "undefined"){ currentLightState2 = lights.light2; }
        if(typeof lights.light3 !== "undefined"){ currentLightState3 = lights.light3; }      

        if(checkboxLight1){
            // var lightsAPIURL1 = ip + "/api/newdeveloper/lights/1/state";
            // var message1 = '{"on":false}';
            // http.open("PUT",lightsAPIURL1,true);
            // http.send(message1);
            // console.log(message1);
            putParameter("1", currentLightState1.state.sat, currentLightState1.state.bri, currentLightState1.state.hue, false);
        }

        if(checkboxLight2){
            // var lightsAPIURL2 = ip + "/api/newdeveloper/lights/2/state";
            // var message2 = '{"on":false}';
            // http.open("PUT",lightsAPIURL2,true);
            // http.send(message2);
            // console.log(message2);
            putParameter("2", currentLightState2.state.sat, currentLightState2.state.bri, currentLightState2.state.hue, false);
        }

        if(checkboxLight3){
            // var lightsAPIURL3 = ip + "/api/newdeveloper/lights/3/state";
            // var message3 = '{"on":false}';
            // http.open("PUT",lightsAPIURL3,true);
            // http.send(message3);
            // console.log(message3);

            putParameter("3", currentLightState3.state.sat, currentLightState3.state.bri, currentLightState3.state.hue, false);
        }
    } else { // Lights go on
        // Light1
        if(checkboxLight1){
            // var lightsAPIURL1 = ip + "/api/newdeveloper/lights/1/state";
            // var message1 = '{"on":true, "sat":'+currentLightState1.state.sat+', "bri":'+currentLightState1.state.bri+', "hue":'+currentLightState1.state.hue+'}';         
            // http.open("PUT",lightsAPIURL1,true);
            // http.send(message1);
            // console.log(message1);
            putParameter("1", currentLightState1.state.sat, currentLightState1.state.bri, currentLightState1.state.hue, true);
        }

        // Light2
        if(checkboxLight2){
            // var lightsAPIURL2 = ip + "/api/newdeveloper/lights/2/state";
            // var message2 = '{"on":true, "sat":'+currentLightState2.state.sat+', "bri":'+currentLightState2.state.bri+', "hue":'+currentLightState2.state.hue+'}';         
            // http.open("PUT",lightsAPIURL2,true);
            // http.send(message2);
            // console.log(message2);
            putParameter("2", currentLightState2.state.sat, currentLightState2.state.bri, currentLightState2.state.hue, true);
        }

        // Light3
        if(checkboxLight3){
            // var lightsAPIURL3 = ip + "/api/newdeveloper/lights/3/state";
            // var message3 = '{"on":true, "sat":'+currentLightState3.state.sat+', "bri":'+currentLightState3.state.bri+', "hue":'+currentLightState3.state.hue+'}';         
            // http.open("PUT",lightsAPIURL3,true);
            // http.send(message3);
            // console.log(message3);
            putParameter("3", currentLightState3.state.sat, currentLightState3.state.bri, currentLightState3.state.hue, true);
        }
    }
}

function changeColorWithMotion(event){
    var lights = getLights();
    if(typeof lights.light1 !== "undefined"){ currentLightState1 = lights.light1; }
    if(typeof lights.light2 !== "undefined"){ currentLightState2 = lights.light2; }
    if(typeof lights.light3 !== "undefined"){ currentLightState3 = lights.light3; } 

    var http = new XMLHttpRequest();

    console.log("changeColorWithMotion:"+event);

    // Check which light we want to change
    var checkboxLight1 = $("#checkboxLight1").is(':checked');
    var checkboxLight2 = $("#checkboxLight2").is(':checked');
    var checkboxLight3 = $("#checkboxLight3").is(':checked');

    if(checkboxLight1){
        // Light 1
        // var lightsAPIURL1 = ip + "/api/newdeveloper/lights/1/state";        
        var saturation1 = currentLightState1.state.sat; 
        var brightness1 = currentLightState1.state.bri; 
        var hue1 = currentLightState1.state.hue; 

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

        // var message1 = '{"on":true, "sat":'+saturation1+', "bri":'+brightness1+', "hue":'+hue1+'}';
        // http.open("PUT",lightsAPIURL1,true);
        // http.send(message1);
        // console.log("light1: "+message1);
        putParameter("1", saturation1, brightness1, hue1, true);
    }

    if(checkboxLight2){
        // Light 2
        // var lightsAPIURL2 = ip + "/api/newdeveloper/lights/2/state";        
        var saturation2 = currentLightState2.state.sat; 
        var brightness2 = currentLightState2.state.bri; 
        var hue2 = currentLightState2.state.hue; 

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

        // var message2 = '{"on":true, "sat":'+saturation2+', "bri":'+brightness2+',"hue":'+hue2+'}';
        // http.open("PUT",lightsAPIURL2,true);
        // http.send(message2);
        // console.log("light2: "+message2);
        putParameter("2", saturation2, brightness2, hue2, true);
    }

    if(checkboxLight3){
        // Light 3
        // var lightsAPIURL3 = ip + "/api/newdeveloper/lights/3/state";        
        var saturation3 = currentLightState3.state.sat; 
        var brightness3 = currentLightState3.state.bri; 
        var hue3 = currentLightState3.state.hue; 

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

        // var message3 = '{"on":true, "sat":'+saturation3+', "bri":'+brightness3+',"hue":'+hue3+'}';
        // http.open("PUT",lightsAPIURL3,true);
        // http.send(message3);
        putParameter("3", saturation3, brightness3, hue3, true);
        // console.log("light3: "+message3);
    }
}

// function getLights(){
//     var light1, light2, light3;

//     for(var i = 1; i <= lightsNumber; i++){
//         var lightsAPIURL = ip + "/api/newdeveloper/lights/"+i; 
//         var http = new XMLHttpRequest();
//         http.open("GET",lightsAPIURL,true);
//         http.send();

//         http.onreadystatechange=function(){
//           if (http.readyState==4 && http.status==200){
//                 switch(i){
//                     case 1: light1 = http.responseText; break;
//                     case 2: light2 = http.responseText; break;
//                     case 3: light3 = http.responseText; break;
//                 }                
//             }
//         }
//     }

//     var object = {"light1":light1, "light2":light2, "light3":light3};
//     return object;    
// }


function getLights(){
    var light1, light2, light3;
    // for(var i = 1; i <= lightsNumber; i++){
    //     var lightsAPIURL = ip + "/api/newdeveloper/lights/"+i; 
    //     var http = new XMLHttpRequest();
    //     http.open("GET",lightsAPIURL,true);
    //     http.send();
    //     // putParameter(i.toString(), saturation, brightness, hue, true);

    //     http.onreadystatechange=function(){
    //       if (http.readyState==4 && http.status==200){
    //             switch(i){
    //                 case 1: light1 = http.responseText; break;
    //                 case 2: light2 = http.responseText; break;
    //                 case 3: light3 = http.responseText; break;
    //             }                
    //         }
    //     }
    // }
    socket.emit('hue_state', "1", function(data){
        light1 = data;
    });

    socket.emit('hue_state', "2", function(data){
        light2 = data;
    });
    socket.emit('hue_state', "3", function(data){
        light3 = data;
    });
    
    console.log("light3:");
    console.log(light3);

    socket.on('hue_state_res', function (data) {
        // console.log(data);
    });

    var object = {"light1":light1, "light2":light2, "light3":light3};
    console.log("getlights state");
    console.log(object);
    // lights.light1.state.sat
    return object;    
}