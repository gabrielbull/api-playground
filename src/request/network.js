export function removeRequestListener(requestCallback, successCallback, errorCallback) {
  window.XMLHttpRequest.requestCallbacks = window.XMLHttpRequest.requestCallbacks.filter(needle => needle !== requestCallback);
  window.XMLHttpRequest.successCallbacks = window.XMLHttpRequest.successCallbacks.filter(needle => needle !== successCallback);
  window.XMLHttpRequest.errorCallbacks = window.XMLHttpRequest.errorCallbacks.filter(needle => needle !== errorCallback);
}

export function addRequestListener(requestCallback, successCallback, errorCallback) {
  window.XMLHttpRequest.requestCallbacks.push(requestCallback);
  window.XMLHttpRequest.successCallbacks.push(successCallback);
  window.XMLHttpRequest.errorCallbacks.push(errorCallback);
}

window.XMLHttpRequest.requestCallbacks = [];
window.XMLHttpRequest.successCallbacks = [];
window.XMLHttpRequest.errorCallbacks = [];

const nextOpen = window.XMLHttpRequest.prototype.open;
window.XMLHttpRequest.prototype.open = function () {
  this._method = arguments[0];
  this._url = arguments[1];
  return nextOpen.apply(this, arguments);
};

const nextSend = window.XMLHttpRequest.prototype.send;
window.XMLHttpRequest.prototype.send = function () {
  window.XMLHttpRequest.requestCallbacks.forEach(callback => callback(this._url, { data: arguments[0], method: this._method }));
  const nextOnReadyStateChange = this.onreadystatechange;
  this.onreadystatechange = () => {
    if (this.readyState === XMLHttpRequest.DONE) {
      if(this.status === 200){
        window.XMLHttpRequest.successCallbacks.forEach(callback => callback());
      } else {
        window.XMLHttpRequest.errorCallbacks.forEach(callback => callback(new Error(this.statusText)));
      }
    }

    if (typeof nextOnReadyStateChange === 'function') nextOnReadyStateChange();
  };
  return nextSend.apply(this, arguments);
};

const nextFetch = window.fetch;
window.fetch = function () {
  return new Promise((resolve, reject) => {
    window.XMLHttpRequest.requestCallbacks.forEach(callback => callback(arguments[0], { data: arguments[1].body, method: arguments[1].method }));
    nextFetch.apply(this, arguments)
      .then(response => {
        let responseClone = response.clone();
        if (response.statusCode >= 200 && response.statusCode < 300) {
          window.XMLHttpRequest.successCallbacks.forEach(callback => callback(responseClone));
          resolve(response);
        } else {
          window.XMLHttpRequest.errorCallbacks.forEach(callback => callback(responseClone));
          reject(response);
        }
      })
      .catch(err => {
        window.XMLHttpRequest.errorCallbacks.forEach(callback => callback(err));
        reject(err);
      })
  });
};
