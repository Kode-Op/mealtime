export function getFromStorage(key) {
  if (!key) {
    return null;
  }

  try {
    const valueStr = localStorage.getItem(key);
    if (valueStr) {
      return JSON.parse(valueStr);
    }
    return null;
  } catch (err) {
    return null;
  }
}

export function setInStorage(key, obj) {
  return new Promise((resolve, reject) => {
    if (!key) {
      reject("Error: Key is missing");
    }
    try {
      localStorage.setItem(key, JSON.stringify(obj));
      resolve(key);
    } catch (err) {
      reject(err);
    }
  });
}
