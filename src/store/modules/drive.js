import Vue from 'vue';
import { v4 as uuidV4 } from 'uuid';

import { getFolder, getChildFolders, getFiles } from '@/services/Drive';
import { ROOT_FOLDER } from '@/services/Drive';

const mutationType = {
  SELECT_FOLDER: 'SELECT_FOLDER',
  UPDATE_FOLDER: 'UPDATE_FOLDER',
  SET_CHILD_FOLDERS: 'SET_CHILD_FOLDERS',
  SET_CHILD_FILES: 'SET_CHILD_FILES',
  ADD_UPLOADING_FILES: 'ADD_UPLOADING_FILES',
  UPDATE_UPLOADING_FILES: 'UPDATE_UPLOADING_FILES',
  REMOVE_UPLOADING_FILES: 'REMOVE_UPLOADING_FILES',
  CLEAR_UPLOADING_FILES: 'CLEAR_UPLOADING_FILES',
};

export default {
  namespaced: true,
  state: {
    folderId: null,
    folder: null,
    childFolders: [],
    childFiles: [],

    uploadingFiles: [],
  },
  mutations: {
    [mutationType.SELECT_FOLDER](state, { folderId, folder }) {
      state.folderId = folderId;
      state.folder = folder;
      state.childFolders = [];
      state.childFiles = [];
    },
    [mutationType.UPDATE_FOLDER](state, folder) {
      state.folder = folder;
    },
    [mutationType.SET_CHILD_FOLDERS](state, folders) {
      state.childFolders = folders;
    },
    [mutationType.SET_CHILD_FILES](state, files) {
      state.childFiles = files;
    },
    [mutationType.ADD_UPLOADING_FILES](state, file) {
      state.uploadingFiles.push(file);
    },
    [mutationType.UPDATE_UPLOADING_FILES](state, { trackId, data }) {
      const index = state.uploadingFiles.findIndex(
        (file) => file.trackId === trackId,
      );
      if (index === -1) return new Error('File not found');
      Vue.set(state.uploadingFiles, index, {
        ...state.uploadingFiles[index],
        ...data,
      });
    },
    [mutationType.REMOVE_UPLOADING_FILES](state, trackId) {
      const index = state.uploadingFiles.findIndex(
        (file) => file.trackId === trackId,
      );
      if (index === -1) return new Error('File not found');
      Vue.delete(state.uploadingFiles, index)
    },
    [mutationType.CLEAR_UPLOADING_FILES](state) {
      state.uploadingFiles = [];
    }
  },
  actions: {
    selectFolder({ commit, rootState }, folderId = null) {
      const promise = new Promise((resolve, reject) => {
        if (folderId === null) {
          commit(mutationType.UPDATE_FOLDER, ROOT_FOLDER);
          resolve();
        } else {
          getFolder(folderId)
            .then((doc) => {
              commit(mutationType.UPDATE_FOLDER, doc);
              resolve();
            })
            .catch((error) => {
              console.log(`[catch] getFolder`);
              commit(mutationType.UPDATE_FOLDER, ROOT_FOLDER);
              reject(error);
            });
        }
      });

      const currentUserId = rootState.auth.userId;

      promise
        .then(() => {
          getChildFolders({
            folderId,
            userId: currentUserId,
            callback: (folders) =>
              commit(mutationType.SET_CHILD_FOLDERS, folders),
          });

          getFiles({
            folderId,
            userId: currentUserId,
            callback: (files) => commit(mutationType.SET_CHILD_FILES, files),
          });
        })
        .catch((error) => {
          console.log('promise failed');
          throw error;
        });
    },
    trackUploadProgress({ commit }, file) {
      const trackId = uuidV4();

      commit(mutationType.ADD_UPLOADING_FILES, {
        trackId,
        name: file.name,
        progress: 0,
        error: false,
      });

      return trackId;
    },
    updateUploadProgress({ commit }, { trackId, data }) {
      commit(mutationType.UPDATE_UPLOADING_FILES, {
        trackId,
        data,
      });
    },
    removeUploadProgress({ commit }, trackId) {
      commit(mutationType.REMOVE_UPLOADING_FILES, trackId);
    },
    clearUploadingFiles({ commit }) {
      commit(mutationType.CLEAR_UPLOADING_FILES);
    }
  },
};
