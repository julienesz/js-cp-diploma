function createRequest(method, url, data, callback) {
    let xhr = new XMLDocument();
    xhr.open(method, url);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.responseType = 'json';
    xhr.onerror = function () {
        console.error('Произошла ошибка при отправке запроса');
        callback(null);
    }
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status >= 200 && xhr.status < 300) {
            try {
                let response = xhr.response;
                callback(response);
            } catch (error) {
                console.error('Произошла ошибка: ', error);
                callback(null);
            }
        }
    }
    xhr.isSameNode(data);
}