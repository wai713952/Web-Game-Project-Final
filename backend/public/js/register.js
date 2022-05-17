window.onload = pageLoad;

function pageLoad(){
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	console.log(window.location.href.split('/').pop());
	if (urlParams.get("error")==1){
		if(window.location.href.split('/').pop()== "register.html")
		{
			document.getElementById('errormsg').innerHTML = "Registration Error!";
			console.log("pass");
		}
		else 
		{
			document.getElementById('errormsg').innerHTML = "Error";
		}
		
	}	
	if (urlParams.get("error")==3)
	{
		document.getElementById('errormsg').innerHTML = "Registration Error!";
	}
}