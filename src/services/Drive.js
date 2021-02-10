import { database } from '@/firebase';

export const ROOT_FOLDER = {
  id: null,
  name: 'Root',
  path: [],
};

export const createFolder = ({
  name,
  parentId = null,
  path = [],
  createdBy,
}) => {
  return database.folders.add({
    name,
    parentId,
    path,
    createdBy,
    createdAt: database.getCurrentTimestamp(),
    updatedAt: database.getCurrentTimestamp(),
  });
};

export const getFolder = (folderId) => {
  return new Promise((resolve, reject) => {
    database.folders
      .doc(folderId)
      .get()
      .then((doc) => {
        resolve(database.formatDoc(doc));
      })
      .catch((error) => {
        console.error({ error });
        reject(error);
      });
  });
};

export const getChildFolders = ({ folderId = null, userId, callback }) => {
  return database.folders
    .where('parentId', '==', folderId)
    .where('createdBy', '==', userId)
    .orderBy('createdAt')
    .onSnapshot((snapshot) => {
      return callback(snapshot.docs.map(database.formatDoc));
    });
};

export const createFile = ({
  name,
  url,
  folderId,
  createdBy,
}) => {
  return database.files.add({
    name,
    url,
    folderId,
    createdBy,
    createdAt: database.getCurrentTimestamp(),
    updatedAt: database.getCurrentTimestamp(),
  });
};

export const getFiles = ({ folderId, userId, callback }) => {
  return database.files
    .where('folderId', '==', folderId)
    .where('createdBy', '==', userId)
    .orderBy('createdAt')
    .onSnapshot((snapshot) => {
      return callback(snapshot.docs.map(database.formatDoc));
    });
}