export const getById = (arr, id) => {
  if (typeof id === "string") {
    id = parseInt(id);
    if (isNaN(id)) return null;
  }
  for (let idx in arr) {
    if (arr[idx].id === id) {
      return arr[idx];
    }
  }
  return null;
};

export const strToArr = (str) =>
  str
    .replace(/ +/g, " ")
    .trim()
    .split(/\s*,\s*/)
    .filter((item) => item.length > 0);

export const updateState = (target, field, val) => {
  const value = {};
  value[field] = val;
  target.value = Object.assign({}, target.value, value);
};

export const fillFromQuery = (query, target) => {
  for (let key in target) {
    target[key] = query[key] ? query[key] : "";
  }
};
