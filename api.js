exports._createUser = (fb_id, email, fname, lname, fb_token) => {
    fetch('http://192.168.50.107:3000/api/v1/users', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                fb_id, email, fname, lname, fb_token
            })
        })
        .then((response) => response.text())
        .then((responseText) => {
            console.log(responseText);
        })
        .catch((error) => {
            console.warn(error);
        });
}
