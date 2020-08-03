var host = "https://git.dei.uc.pt/api/v3";
var private_token;
var name;
var avatar_url;
var username;
var xml;


function sessionStart() {
	var xml= new XMLHttpRequest();
	var JsonObject;
	xml.onreadystatechange = function () {
		if (xml.readyState == 4 && xml.status == 201) {
			JsonObject = JSON.parse(xml.responseText);
			console.log();
			private_token = JsonObject.private_token;
			name = JsonObject.name;
			avatar_url = JsonObject.avatar_url;
			console.log(JsonObject.private_token);
			setStorage();
			window.location.href = "Files/Home/index.html";
		}
		else if (xml.readyState == 4) {
			JsonObject = JSON.parse(xml.responseText);
			window.alert("sessionStart: " + JsonObject.message);
		}
	}
	username = document.getElementById("uname").value;
	pass = document.getElementById("psw").value;
	url=host + "/session?login=" + encodeURIComponent(username) + "&password=" + encodeURIComponent(pass);
	xml.open("POST", url, true);
	xml.send();
}



function setStorage() {
	sessionStorage.setItem("username", username);
	sessionStorage.setItem("name", name);
	sessionStorage.setItem("avatar_url", avatar_url);
	sessionStorage.setItem("private_token", private_token);
}