
/**
 * Submits a form using ajax
 * @param { Object } form 
 * @param { Function } callback 
 */
function submitForm(form: HTMLFormElement,callback: Function) {
    let xhr = new XMLHttpRequest();
    xhr.onload = () => {
        callback(null, xhr.responseText);
    }
    xhr.open(form.method, form.action, true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send(new URLSearchParams(new FormData(form) as unknown as any));
}

/**
 * Makes a ajax get request
 * @param { string } action 
 * @param { Function } callback 
 */
function getData(action: string, callback: Function){
    let xhr = new XMLHttpRequest();
    xhr.onload = () => {
        callback(null, xhr.responseText);
    }
    xhr.open("get", action, true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send();
}

