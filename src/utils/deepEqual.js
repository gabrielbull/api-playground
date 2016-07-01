export default function deepEqual(objA, objB) {
  if (typeof objA !== typeof objB) return false;

  if (typeof objA === 'object' && Object.prototype.toString.call(objA) === '[object Array]') {
    let isEqual = true;
    if (objA.length !== objB.length) isEqual = false;
    else {
      for (let i = 0, len = objA.length; i < len; ++i) {
        if (objB[i] === undefined || !deepEqual(objA[i], objB[i])) {
          isEqual = false;
          break;
        }
      }
    }
    return isEqual
  } else if (typeof objA === 'object') {
    let isEqual = true;
    const allProps = { ...objA, ...objB };
    for (let prop in allProps) {
      if (allProps.hasOwnProperty(prop)) {
        if (!objA.hasOwnProperty(prop) || !objB.hasOwnProperty(prop) || !deepEqual(objA[prop], objB[prop])) {
          isEqual = false;
          break;
        }
      }
    }
    return isEqual;
  } else {
    return objA === objB;
  }
}
