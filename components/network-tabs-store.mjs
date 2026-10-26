const stores = new Map();
const parseIndex = value => value === '1' ? 1 : 0;

export function getNetworkTabStore(key) {
  if (!stores.has(key)) {
    let index;
    const listeners = new Set();
    stores.set(key, {
      getSnapshot() {
        if (index === undefined) {
          try {
            index = parseIndex(window.localStorage.getItem(key));
          } catch {
            index = 0;
          }
        }
        return index;
      },
      subscribe(listener) {
        listeners.add(listener);
        const onStorage = event => {
          if (event.key === key || event.key === null) {
            index = parseIndex(event.newValue);
            listener();
          }
        };
        window.addEventListener('storage', onStorage);
        return () => {
          listeners.delete(listener);
          window.removeEventListener('storage', onStorage);
        };
      },
      setIndex(value) {
        index = value;
        try {
          window.localStorage.setItem(key, String(value));
        } catch {
          // Keep the guide synchronized in memory when persistence is unavailable.
        }
        listeners.forEach(listener => listener());
      },
    });
  }
  return stores.get(key);
}
