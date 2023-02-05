export const getById = (arr, id) => {
  for (let idx in arr) {
    if (arr[idx].id === id) {
      return arr[idx];
    }
  }
  return null;
};

export const strToArr = (str) => str.replace(/ /g, "").split(",");

export const updateState = (target, field, val) => {
  const value = {};
  value[field] = val;
  target.value = Object.assign({}, target.value, value);
};