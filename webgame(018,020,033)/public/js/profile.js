var objcompare ;
var newobj;
var table,gamename,sortType,sortBy,button,sortTypegas,gamenamest,sortbye;
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
	table = document.getElementById("tables");
	 document.getElementById("requesttablebutt").onclick = onclickgas;
	 gamename = document.getElementById("gamename");
	sortType =  document.getElementById("sortType");
	sortbyes = document.getElementById("sortbygas");
	document.getElementById("displaygamename").innerHTML = gamename.value + " scoreboard";
	//setInterval(readtableinput,1000);
    readtable();
   
	document.getElementById('displayPic').onclick = fileUpload;
	document.getElementById('fileField').onchange = fileSubmit;
	var username = getCookie('username');
	document.getElementById("username").innerHTML = username;
	showImg('img/'+getCookie('img'));

	const tbody =document.getElementById('tables');
	//console.log(tbody);
	if(tbody)
	{
		tbody.addEventListener('click', function (e) {
			const cell = e.target.closest('td');
			if (!cell) {return;} // Quit, not clicked on a cell
			const row = cell.parentElement;
			console.log(cell.innerHTML, row.rowIndex, cell.cellIndex);
		  });
			  
	}
 
}
// console.log(gamenamest);

function onclickgas (){
	document.getElementById("displaygamename").innerHTML = gamename.value + " scoreboard";;
	 sortTypegas = sortType.value;
	gamenamest = gamename.value;
	 sortbye1 = sortbyes.value;

	
	readtable();
}
async function readtable(){
	sortTypegas = sortType.value;
	gamenamest = gamename.value;
	 sortbye1 = sortbyes.value;
let response = await fetch("/sendSelectTable",
	{
		method: "POST",
		headers: {
			'accept': 'application/json',
			'Content-Type' : 'application/json'
		},
		body : JSON.stringify({
			gamenames : gamenamest ,
			sortTypes : sortTypegas,
			sortBys   : sortbye1
		})
	}
	);
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

// async function readtableinput(){
// 	let response = await fetch("/sendSelectTable",
// 	{
// 		method: "GET",
// 		headers: {
// 			'accept': 'application/json',
// 			'Content-Type' : 'application/json'
// 		}
// 	});
// 	let content = await response.json();
// 	//console.log(content);
// 	/*if(typeof content !== "Object")
// 	{
// 		jsonpost = JSON.parse(content);
// 	}
// 	else
// 	{
// 		jsonpost = content;
// 	}*/
	
// 	showtable(content);
// 	const { status } = response; 
//     return status;
	
// }


function showtable(data)
{
   
	var keys = Object.keys(data);
	var table = document.getElementById("tables");
	table.innerHTML = "";
	var x = keys.length;
	for (var i = keys.length-1; i >=0 ; i--) {
	
	var row = table.insertRow(0);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
   
    cell1.innerHTML = ""+x;
    cell2.innerHTML = data[keys[i]]["gamescore"];
    cell3.innerHTML = data[keys[i]]["timestamps"];
	x--;
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


