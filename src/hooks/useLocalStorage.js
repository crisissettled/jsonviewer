import { useState } from "react";

export function useLocalStorage(key, defaultValue) {
  const storedData = localStorage.getItem(key);

  let storedJson = null;
  if (!!storedData) {
    storedJson = JSON.parse(storedData);
  }

  const [state, setState] = useState(storedJson ?? defaultValue);

  function setStorage(data) {
    if (typeof data === "function") {
      const newData = data(state);
      localStorage.setItem(key, JSON.stringify(newData));
      setState(newData);
    } else {
      localStorage.setItem(key, JSON.stringify(data));
      setState(data);
    }
  }
  return [state, setStorage];
}
