var instance_id = '0';

function createcontainer() {
    async function postData(url = '', data = {}) {
	const response = await fetch(url, {
	    method: 'POST',
	    mode: 'cors',
	    cache: 'no-cache',
	    credentials: 'same-origin',
	    headers: {
		'Content-Type': 'application/json',
		"Host": "https://fj2g6x5vlh.execute-api.us-east-1.amazonaws.com",
		"Origin": window.location.orgin,
		"Connection": "keep-alive",
		"Accept": "*/*",
		"Accept-Encoding": "gzip, deflate",
	    },
	    redirect: 'follow',
	    referrerPolicy: 'no-referrer',
	    body: JSON.stringify(data)
	});
	return response.json();
    }

    postData("https://fj2g6x5vlh.execute-api.us-east-1.amazonaws.com/deploy1/initialization", {})
	.then(data => {
	    console.log(data);
	});
    /*
      var requestOptions = {
      method: 'POST',
      redirect: 'follow',
      mode: 'no-cors',
      headers: {
      "Host": "https://fj2g6x5vlh.execute-api.us-east-1.amazonaws.com",
      "Origin": window.location.orgin,
      "Connection": "keep-alive",
      "Content-length": "0",*/
    //    "Accept": "*/*",
    /* "Accept-Encoding": "gzip, deflate"
       },
       body: JSON.stringify(data)

       };

       fetch("https://fj2g6x5vlh.execute-api.us-east-1.amazonaws.com/deploy1/initialization", requestOptions)
       .then(result => console.log(result))
       .then(response => {
       console.log(response.body.json());
       console.log(response.text());
       })
       .then(response => {
       all = response.json();
       instance_id = response['id'];
       var link = document.getElementById("link");
       link.setAttribute("href", response["link"]);
       link.innerHTML = "click me";
       var del = document.getElementById("delete");
       del.innerHTML = "delete";
       })
       .catch(error => console.log('error', error));
    */
}

function deletecontainer() {
    var requestOptions = {
	method: 'POST',
	redirect: 'follow'
    };

    var url = "https://fj2g6x5vlh.execute-api.us-east-1.amazonaws.com/deploy1/delete?id=".concat(instance_id);
    fetch(url, requestOptions)
	.then(response => response.text())
	.then(result => console.log(result))
	.catch(error => console.log('error', error));
}