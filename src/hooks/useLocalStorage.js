import { useState } from "react";

export function useLocalStorage(key, defaultValue) {
  const storedData = localStorage.getItem(key);

  console.log(storedData, "storedData");
  let storedJson = null;
  if (!!storedData) {
    console.log(JSON.parse(storedData), "JSON parse storedData", key);
    storedJson = JSON.parse(storedData);
  }

  const [state, setState] = useState(storedJson ?? defaultValue);

  function setStorage(data) {
    if (typeof data === "function") {
      console.log(data, "function --->");
      const newData = data(state);
      localStorage.setItem(key, JSON.stringify(newData));
      setState(newData);
    } else {
      console.log(data, "data --->");
      localStorage.setItem(key, JSON.stringify(data));
      setState(data);
    }
  }
  return [state, setStorage];
}
