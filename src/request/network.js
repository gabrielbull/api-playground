export function removeRequestListener(callback) {
  window.XMLHttpRequest.callbacks = window.XMLHttpRequest.callbacks.filter(needle => needle !== callback);
}

export function addRequestListener(callback) {
  window.XMLHttpRequest.callbacks.push(callback);
}

window.XMLHttpRequest.callbacks = [];
const nextSend = window.XMLHttpRequest.prototype.send;
window.XMLHttpRequest.prototype.send = function () {
  console.log('miello');
  XMLHttpRequest.callbacks.forEach(callback => {
    callback.apply(this, arguments);
  });
  return nextSend.apply(this, arguments);
};
console.log('jello');

const nextFetch = window.fetch;
window.fetch = function () {
  console.log(arguments);
  return nextFetch.apply(this, arguments);
};
