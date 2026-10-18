const DATABASE = 'lok-demo-day-projects';
const STORE = 'scenes';

function openDatabase() {
  return new Promise((resolve, reject) => {
    if (!globalThis.indexedDB) { reject(new Error('Local project storage is unavailable.')); return; }
    const request = indexedDB.open(DATABASE, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(STORE, { keyPath: 'id' });
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error('Could not open project storage.'));
  });
}

async function run(mode, operation) {
  const database = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE, mode);
    const request = operation(transaction.objectStore(STORE));
    transaction.oncomplete = () => { database.close(); resolve(request.result); };
    transaction.onerror = () => { database.close(); reject(transaction.error || new Error('Project storage failed.')); };
    transaction.onabort = () => { database.close(); reject(transaction.error || new Error('Project storage was interrupted.')); };
  });
}

export function saveStudioProject(project) { return run('readwrite', (store) => store.put(project)); }
export function getStudioProject(id) { return run('readonly', (store) => store.get(id)); }
export function listStudioProjects() { return run('readonly', (store) => store.getAll()); }
export function deleteStudioProject(id) { return run('readwrite', (store) => store.delete(id)); }
