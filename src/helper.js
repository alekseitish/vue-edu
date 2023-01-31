export const getById = (arr, id) => {
  for (let idx in arr) {
    if (arr[idx].id === id) {
      return arr[idx];
    }
  }
  return null;
}

export const strToArr = (str) => str.replace(/ /g,"").split(",");
