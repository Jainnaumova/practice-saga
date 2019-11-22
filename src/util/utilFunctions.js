export function fetchCatFact() {
  const url = "https://catfact.ninja/fact";
  return fetch(url).then(res => {
    return res;
  });
}

export function fetchDogFact() {
  const url =
    "https://cors-anywhere.herokuapp.com/http://dog-api.kinduff.com/api/facts";
  return fetch(url).then(res => {
    return res;
  });
}
