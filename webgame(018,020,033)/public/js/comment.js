var imgname;

function checkCookie(){
	var username = "";
	if(getCookie("commentuser")==false){
		window.location = "game-scoreboard.html";
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
	readPost();
	
	var ownername = document.getElementById("TropicName") ;
	var ownerINFO = document.getElementById("TropicINFO") ; 
	ownerINFO.innerHTML = "";
	ownername.innerHTML = "";
	ownername.innerHTML += '<h5>HIGH SCORE RECORD : '+getCookie('gamescore')+'</h5>' ;
	ownername.innerHTML += '<span class="ml-2">('+getCookie('usergamerecchar')+')</span>' ;
	ownerINFO.innerHTML += '<span class="bdge mr-1">'+getCookie('gamename')+'</span>';
	ownerINFO.innerHTML += '<span class="mr-2 comments">'+getCookie('commentN')+ ' comments&nbsp;</span>';
	ownerINFO.innerHTML += '<span class="mr-2 dot"></span>';
	var timedecpde = unescape(getCookie('scoreDATE'));
	ownerINFO.innerHTML += '<span>'+timedecpde+'</span>';
	timer = setInterval (readPost, 300);
	getlikes();

	document.getElementById('MVPplayerPIC').src = 'img/'+getCookie('usergamerecIMG');
    showImg('img/'+getCookie('img'));
	document.getElementById('postbutton').onclick = getData;
}

async function getlikes()
{
	let likeobj = await readPost();
	//if(likeobj.length)
	//console.log(Object.keys(likeobj[0]).length);
	document.getElementById("likesvar").innerHTML = Object.keys(likeobj[0]).length;
	document.getElementById("likebutt").onclick = likes;
	document.getElementById("dislikebutt").onclick = dislikes; 

}

async function likes()
{
	let response = await fetch("/likecomment",
	{
		method: "POST",
		headers: {
			'accept': 'application/json',
			'Content-Type' : 'application/json'
		},
		body : JSON.stringify({
			like : "like"
		})
	}
	);
	
	


	const { status } = response; 
    return status;
	
	
}	

async function dislikes()
{
	let response = await fetch("/likecomment",
	{
		method: "POST",
		headers: {
			'accept': 'application/json',
			'Content-Type' : 'application/json'
		},
		body : JSON.stringify({
			like : "dislike"
		})
	}
	);
	

	const { status } = response; 
    return status;
	
}	


function getData(){
	var msg = document.getElementById("textmsg").value;
	document.getElementById("textmsg").value = "";
	writecomment(msg);
}

async function readPost(){
	let response = await fetch("/requestcomment");
	let content = await response.json();
	//console.log();
	
	document.getElementById("likesvar").innerHTML = Object.keys(content[0]).length;	
	showPost(content[1]);
	
    return content;
}


async function writecomment(msg){

let response = await fetch("/writecomment",
	{
		method: "POST",
		headers: {
			'accept': 'application/json',
			'Content-Type' : 'application/json'
		},
		body : JSON.stringify({
			user:getCookie('username'),
			message : msg
		})
	}
	);
	
	const { status } = response; 
    return status;
	
}


function showImg(filename){
	if (filename !==""){
		document.getElementById('NormyplayerPIC').src = filename;
		// showpic.innerHTML = "";
		// var temp = document.createElement("img");
		// temp.src = filename;
		// showpic.appendChild(temp);
	}
}


function showPost(data){
	var keys = Object.keys(data);
	var divTag = document.getElementById("feed-container");	
	divTag.innerHTML = "";
	for (var i = keys.length-1; i >=0 ; i--) {

		var temp = document.createElement("div");
		temp.className = "commented-section mt-2";
		temp.id = "loopD";
		divTag.appendChild(temp);
		var temp1 = document.createElement("div");
		temp1.className = "d-flex flex-row align-items-center commented-user";
		temp1.innerHTML +=   '<h5 class="mr-2">' +data[keys[i]]["username"]+ '</h5>';
		temp1.innerHTML +=   '<span class="dot mb-1"></span>'; 
		temp1.innerHTML +=   '<span class="mb-1 ml-2">'+data[keys[i]]["timestampchar"]+'</span>'; 
		temp.appendChild(temp1);
		var temp1 = document.createElement("div");
		temp1.className = "d-flex flex-row align-items-center commented-user";
		temp1.innerHTML +=   '<span>'+data[keys[i]]["txt"]+'</span>';
		temp.appendChild(temp1);
		//imgname = data[keys[i]]["img"];
	
		//console.log(keys[i]);
	}
}