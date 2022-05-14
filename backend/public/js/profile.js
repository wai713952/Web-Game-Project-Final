var objcompare ;
var newobj;
// check ว่ามีการ set cookies หรือยังถ้ามีจะไปยัง feed.html แต่ถ้าไม่มีจะกลับไปที่ login.html
var jsonpost;
function checkCookie(){
	var username = "";
	if(getCookie("username")==false){
		window.location = "login.html";
	}
}

checkCookie();
window.onload = pageLoad;

function getCookie(name){
	var value = "";
	try{
		value = document.cookie.split("; ").find(row => row.startsWith(name)).split('=')[1]
		return value
	}catch(err){
		return false
	} 
}

function pageLoad(){
	var table = document.getElementById("tables");
	setInterval(readtableinput,1000);
    readtable();
	document.getElementById('displayPic').onclick = fileUpload;
	document.getElementById('fileField').onchange = fileSubmit;
	var username = getCookie('username');
	document.getElementById("username").innerHTML = username;
	showImg('img/'+getCookie('img'));
	
}

async function readtable(){
	let response = await fetch("/readtableprofile");
	let content = await response.json();
	//console.log(content);
	/*if(typeof content !== "Object")
	{
		jsonpost = JSON.parse(content);
	}
	else
	{
		jsonpost = content;
	}*/
	newobj = content;
	showtable(content);
	const { status } = response; 
    return status;
	
}

async function readtableinput(){
	let response = await fetch("/sendSelectTable");
	let content = await response.json();
	//console.log(content);
	/*if(typeof content !== "Object")
	{
		jsonpost = JSON.parse(content);
	}
	else
	{
		jsonpost = content;
	}*/
	
	showtable(content);
	const { status } = response; 
    return status;
	
}


function showtable(data){
    
	var keys = Object.keys(data);
	var table = document.getElementById("tables");
	table.innerHTML = "";
	for (var i = keys.length-1; i >=0 ; i--) {

	var row = table.insertRow(0);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
   
    cell1.innerHTML = data[keys[i]]["ranking"];
    cell2.innerHTML = data[keys[i]]["gamescore"];
    cell3.innerHTML = data[keys[i]]["timestamps"];
	}
}


function fileUpload(){
	document.getElementById('fileField').click();
}

function fileSubmit(){
	document.getElementById('formId').submit();
}

function showImg(filename){
	if (filename !==""){
		var showpic = document.getElementById('displayPic');
		showpic.innerHTML = "";
		var temp = document.createElement("img");
		temp.src = filename;
		showpic.appendChild(temp);
	}
}


