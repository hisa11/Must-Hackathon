// class.js
export function sendDataToServer(contentLists) {
    const jsonData = JSON.stringify(contentLists);
    return fetch('http://localhost:PORT/api/data',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: jsonData
    })
    .then(responce =>{
        if(!responce.ok){
            throw new Error("レスポンスが不正です");
        }
        return responce.json();
    })
    .then(data => {
        return data;
    })
    .catch((error) => console.log(error));
}