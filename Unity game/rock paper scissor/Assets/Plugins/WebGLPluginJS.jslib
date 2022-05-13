mergeInto(LibraryManager.library, {

   
    PassNumberParam:async function (number) {
        let response = await fetch("/game3", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                {
                    score:number
                }
            )
        });
        console.log(number);
       
    },

    
    
});