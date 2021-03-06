function initPubnub() {
	PUBNUB.subscribe({
        channel: "library",
        restore: true,
        callback: pubnubCallback,
        disconnect: pubnubDisconnect,
        reconnect: pubnubReconnect,
        connect: pubnubConnect
    });
}

function pubnubDisconnect() {
	$("#pubnubIndicator").html('<span style="color: red;" >PN</span>');
}

function pubnubConnect() {
	$("#pubnubIndicator").html('<span style="color: green;" >PN</span>');
	
	PUBNUB.publish({
		channel : "system",
		message : "client-start"
	});
}

function pubnubRefresh() {
	$("#pubnubIndicator").html('<span style="color: orange;" >PN</span>');
	setInterval(function() { $("#pubnubIndicator").html('<span style="color: green;" >PN</span>'); }, 2000);
}

function pubnubReconnect() {
	$("#pubnubIndicator").html('<span style="color: gray;" >PN</span>');
}

function pubnubCallback(message) {
	if (message = "refresh") {
	  LIB.retrieveObjects();
	  LIB.generateHTML();
	}
}
