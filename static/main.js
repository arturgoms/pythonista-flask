var ws, socketStr, tempIndex, lastPing, timeOut;

timeOut = 5000; //milliseconds

socketStr = window.location.hostname;
tempIndex = socketStr.indexOf(":");
socketStr = "ws://" + socketStr + ":2222/";

var control = new Object();

var outPackage = 0;
            function getIPs(callback){
                var ip_dups = {};
                //compatibility for firefox and chrome
                var RTCPeerConnection = window.RTCPeerConnection
                    || window.mozRTCPeerConnection
                    || window.webkitRTCPeerConnection;
                var useWebKit = !!window.webkitRTCPeerConnection;
                //bypass naive webrtc blocking using an iframe
                if(!RTCPeerConnection){
                    //NOTE: you need to have an iframe in the page right above the script tag
                    //
                    //<iframe id="iframe" sandbox="allow-same-origin" style="display: none"></iframe>
                    //<script>...getIPs called in here...
                    //
                    var win = iframe.contentWindow;
                    RTCPeerConnection = win.RTCPeerConnection
                        || win.mozRTCPeerConnection
                        || win.webkitRTCPeerConnection;
                    useWebKit = !!win.webkitRTCPeerConnection;
                }
                //minimal requirements for data connection
                var mediaConstraints = {
                    optional: [{RtpDataChannels: true}]
                };
                var servers = {iceServers: [{urls: "stun:stun.services.mozilla.com"}]};
                //construct a new RTCPeerConnection
                var pc = new RTCPeerConnection(servers, mediaConstraints);
                function handleCandidate(candidate){
                    //match just the IP address
                    var ip_regex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/
                    var ip_addr = ip_regex.exec(candidate)[1];
                    //remove duplicates
                    if(ip_dups[ip_addr] === undefined)
                        callback(ip_addr);
                    ip_dups[ip_addr] = true;
                }
                //listen for candidate events
                pc.onicecandidate = function(ice){
                    //skip non-candidate events
                    if(ice.candidate)
                        handleCandidate(ice.candidate.candidate);
                };
                //create a bogus data channel
                pc.createDataChannel("");
                //create an offer sdp
                pc.createOffer(function(result){
                    //trigger the stun server request
                    pc.setLocalDescription(result, function(){}, function(){});
                }, function(){});
                //wait for a while to let everything done
                setTimeout(function(){
                    //read candidate info from local description
                    var lines = pc.localDescription.sdp.split('\n');
                    lines.forEach(function(line){
                        if(line.indexOf('a=candidate:') === 0)
                            handleCandidate(line);
                    });
                }, 1000);
            }
            //insert IP addresses into the page
            
			
function decimel2HexStr(dec) {
    'use strict';
    var ret = Math.round(dec * 255).toString(16);

    while (ret.length < 2) { ret = "0" + ret; }
    
    return ret;
}

function hslHue2Rgb(h) { // assumes full satruation and lightness
    'use strict';
    var r, g, b, x, ret;
    
    r = g = b = 0;
    h =  h * 360;
    x = (h % 60) / 60;
    
    if (h <= 60) { r = 1; g = x; }
    if (60 < h && h <= 120) { r = 1 - x; g = 1; }
    if (120 < h && h <= 180) { g = 1; b = x; }
    if (180 < h && h <= 240) { g = 1 - x; b = 1; }
    if (240 < h && h <= 300) { r = x; b = 1; }
    if (300 < h && h < 360) { r = 1; b = 1 - x; }
    if (h === 360) { r = 1; }
    
    ret = "#" + decimel2HexStr(r) + decimel2HexStr(g) + decimel2HexStr(b);
    return ret;
}


function onOpenFunction(event) {
    'use strict';
    document.getElementById("hero").innerHTML = "WebSocket Open";
    outPackage = "wsOpened";
}

function onErrorFunction(event) {
    'use strict';
    var meshMsg = document.getElementById("meshMsg");
    meshMsg.innerHTML = "onErrorFunction<br>" + meshMsg.innerHTML;
}



function sliderChange(sliderNum) {
    'use strict';
    var newValue, thumb, width;
    
    newValue = document.getElementById("slider" + sliderNum).value;
    document.getElementById("footer").innerHTML = newValue.toString();
    
    control[sliderNum] = newValue;
        
    thumb = document.getElementById("sliderThumb" + sliderNum);
    width = document.getElementById("sliderContainer" + sliderNum).offsetWidth;
    width -= thumb.offsetWidth;
        
    thumb.style.left = width * newValue + 2;  // 2px is for boarder width
    thumb.style.backgroundColor = hslHue2Rgb(newValue);
    
    newValue = JSON.stringify(control);
    document.getElementById("header").innerHTML = newValue.toString();
    
    outPackage = newValue;
}


function populateSliders(inControl) {
    'use strict';
    var sliderDiv, width, i, inputDiv, top, track, container, thumb, newSlider, sliderContainer, sliderTrack, sliderThumb, sliderRange;
    
    document.getElementById("hero").innerHTML = ""; // remove connectButton
    
    sliderDiv = document.getElementById("sliderDiv");
    sliderDiv.innerHTML = "";
    
    top = Object.keys(inControl).length;
    for (i = 0; i < top; i += 1) {  // dynamically place sliders
        inputDiv =  "<div class='sliderContainer' id='sliderContainer" + i + "'>";
        inputDiv += "<img class='sliderTrack' src='hsl.png' id='sliderTrack" + i + "'>";
        inputDiv += "<div class='sliderThumb' id='sliderThumb" + i + "'></div>";
        inputDiv += "<input class='sliderRange' type='range' id='slider" + i + "' ";
        inputDiv += "oninput='sliderChange(" + i + ");' min='0' max='1' step='0.001' ";
        inputDiv += "value='" + inControl[i.toString()] + "'></div>";
             
        sliderDiv.innerHTML += inputDiv;
        
        
/*        sliderContainer = document.createElement("div");
        sliderContainer.className = "sliderContainer";
        sliderContainer.id = "sliderContainer" + i;

        sliderTrack = document.createElement("img");
        sliderTrack.className = "sliderTrack";
        sliderTrack.id = "sliderTrack" + i;
        sliderTrack.src = "hsl.png";

        sliderThumb = document.createElement("div");
        sliderThumb.className = "sliderThumb";
        sliderThumb.id = "sliderThumb" + i;

        sliderRange = document.createElement("input");
        sliderRange.className = "sliderRange";
        sliderRange.id = "slider" + i;
        sliderRange.oninput = function () { sliderChange( i ); };
        sliderRange.min = 0;
        sliderRange.max = 1;
        sliderRange.step = 0.001;
        
        sliderContainer.appendChild( sliderTrack );
        sliderContainer.appendChild( sliderThumb );
        sliderContainer.appendChild( sliderRange );
        
        sliderDiv.appendChild( sliderContainer );
*/
    }
    
    track = document.getElementsByClassName("sliderTrack");
    container = document.getElementsByClassName("sliderContainer");
    thumb = document.getElementsByClassName("sliderThumb");
    
    for (i = 0; i < track.length; i += 1) {
        container[i].style.height = thumb[i].offsetHeight;
        track[i].width = container[i].offsetWidth - thumb[i].offsetWidth;
        
        track[i].style.left = (thumb[i].offsetWidth / 2);
        track[i].style.top = (thumb[i].offsetHeight - track[i].offsetHeight) / 2;

        track[i].style.top = (thumb[i].offsetHeight - track[i].offsetHeight) / 2;

        sliderChange(i);
    }
}

function onMessageFunction(event) {
    'use strict';
    var inControl, meshMsg;
    // add debug data
    meshMsg = document.getElementById("meshMsg");
    meshMsg.innerHTML = event.data + "<br>" + meshMsg.innerHTML;

    lastPing = Date.now();

    if ( event.data === "ping") {
        return;
    }
    
    inControl = JSON.parse(event.data);
    if (inControl.hasOwnProperty("0")) {
        // control msg
        populateSliders(inControl);
    }
}

function sendData() {
    'use strict';
    if (outPackage !== 0) {
        ws.send(outPackage);
        outPackage = 0;
    }
}

function keepAlive() {
    'use strict';
    if ( typeof ws !== 'undefined' ) {
        if ( ws.readyState === 1 && document.getElementsByClassName("sliderDiv").length > 0 ) {  //OPEN
            sliderChange(0);
        }
    }
}

function checkAlive() {
    if ( (lastPing + timeOut) < Date.now() ){
        if ( typeof ws !== 'undefined' ) {
            if ( ws.readyState === 1 ) {  //OPEN
                var meshMsg = document.getElementById("meshMsg");
                meshMsg.innerHTML = "Timeout<br>" + meshMsg.innerHTML;
                ws.close();
                addConnectToButton();
            }    
        }
    }
}

function startWebSocket() {
	
	 getIPs(function(ip){
		if (ip.match(/^(192\.168\.|169\.254\.|10\.|172\.(1[6-9]|2\d|3[01]))/))
			ipStr = ip.split(".");
			socketStr = "ws://" + ipStr[0]+ "." + ipStr[1]+ "." + ipStr[2]+ "." +"1" +":2222/";
			ws = new WebSocket(socketStr);
			ws.onmessage = function (event) {onMessageFunction(event); };
			ws.onopen = function (event) {onOpenFunction(event); };
			ws.onclose = function () {addConnectToButton(); };
			ws.onerror = function (event) {onErrorFunction(event); };
		 
			document.getElementById("buttonText").innerHTML = '<div class="loading bar"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>';    
			
			lastPing = Date.now();
            });
    //ws = new WebSocket(socketStr);
    //ws = new WebSocket('ws://192.168.226.1:2222/');// 19285794
    //ws = new WebSocket('ws://192.168.77.1:2222/'); // 1019625
        // 1019652


}

function addConnectToButton() {
    var button, buttonText;
    
    document.getElementById("sliderDiv").innerHTML = ""; // remove any sliders that might be hanging out
    document.getElementById("hero").innerHTML = ""; // clean up.
    
    button = document.createElement("div");
    button.className = "connectButton";
    button.id = "connectButton";
    button.onclick = function () { startWebSocket() };    
    
    buttonText = document.createElement("div");
    buttonText.className = "buttonText";
    buttonText.id = "buttonText";

	buttonText.innerHTML = "Connect<br>to<br>Mesh";
	
    button.appendChild( buttonText );
    document.getElementById("hero").appendChild( button );
}


setInterval(sendData, 200);
setInterval(keepAlive, 5000);
setInterval(checkAlive, 600);

//setInterval( addConnectToButton, 100 )

window.onload = addConnectToButton;

