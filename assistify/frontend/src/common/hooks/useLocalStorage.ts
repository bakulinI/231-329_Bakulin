export const useLocalStorage = () => {
  const setItem = (key: string, value: unknown) => {
    window.localStorage.setItem(key, JSON.stringify(value));
  };

  const getItem = (key: string): unknown => {
    const item = window.localStorage.getItem(key);
    return item;
  };

  const removeItem = (key: string): void => {
    window.localStorage.removeItem(key);
  };

  return { setItem, getItem, removeItem };
};
