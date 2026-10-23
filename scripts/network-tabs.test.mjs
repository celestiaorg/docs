import assert from 'node:assert/strict';
import { test } from 'node:test';
import { getNetworkTabStore } from '../components/network-tabs-store.mjs';

const values = new Map();
globalThis.window = new EventTarget();
Object.defineProperty(window, 'localStorage', {
  configurable: true,
  value: {
    getItem: key => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
  },
});

test('restores selection, synchronizes subscribers, and keeps guides independent', () => {
  values.set('consensus', '1');
  const store = getNetworkTabStore('consensus');
  assert.equal(store.getSnapshot(), 1);
  assert.equal(getNetworkTabStore('consensus'), store);
  assert.equal(getNetworkTabStore('docker').getSnapshot(), 0);
  const selections = [];
  const unsubscribe = store.subscribe(() => selections.push(store.getSnapshot()));
  store.setIndex(0);
  assert.deepEqual(selections, [0]);
  assert.equal(values.get('consensus'), '0');
  unsubscribe();
  store.setIndex(1);
  assert.deepEqual(selections, [0]);
});

test('rejects invalid saved network indexes', () => {
  for (const value of ['NaN', '-1', '2', '1.5', 'garbage']) {
    values.set(value, value);
    assert.equal(getNetworkTabStore(value).getSnapshot(), 0);
  }
});

test('synchronizes in memory when reads or writes are blocked', () => {
  const storage = window.localStorage;
  for (const failure of ['getItem', 'setItem', 'access']) {
    Object.defineProperty(window, 'localStorage', failure === 'access' ? {
      configurable: true,
      get() { throw new Error('Storage blocked'); },
    } : {
      configurable: true,
      value: { ...storage, [failure]() { throw new Error('Storage blocked'); } },
    });
    const store = getNetworkTabStore(failure);
    assert.equal(store.getSnapshot(), 0);
    const first = [];
    const second = [];
    const unsubscribeFirst = store.subscribe(() => first.push(store.getSnapshot()));
    const unsubscribeSecond = store.subscribe(() => second.push(store.getSnapshot()));
    store.setIndex(1);
    assert.equal(store.getSnapshot(), 1);
    assert.deepEqual(first, [1]);
    assert.deepEqual(second, [1]);
    assert.equal(getNetworkTabStore(failure).getSnapshot(), 1);
    store.setIndex(0);
    assert.deepEqual(first, [1, 0]);
    unsubscribeFirst();
    unsubscribeSecond();
  }
  Object.defineProperty(window, 'localStorage', { configurable: true, value: storage });
});

test('accepts other-tab updates and storage clearing, then removes listeners', () => {
  const store = getNetworkTabStore('cross-tab');
  const selections = [];
  const unsubscribe = store.subscribe(() => selections.push(store.getSnapshot()));
  const dispatch = (key, newValue) => {
    const event = new Event('storage');
    Object.assign(event, { key, newValue });
    window.dispatchEvent(event);
  };
  dispatch('unrelated', '1');
  assert.deepEqual(selections, []);
  dispatch('cross-tab', '1');
  dispatch(null, null);
  assert.deepEqual(selections, [1, 0]);
  unsubscribe();
  dispatch('cross-tab', '1');
  assert.deepEqual(selections, [1, 0]);
});
