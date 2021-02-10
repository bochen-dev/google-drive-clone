import { auth } from '@/firebase';

const mutationType = {
  SET_USER: 'SET_USER',
};

function signup(email, password) {
  return auth.createUserWithEmailAndPassword(email, password);
}

function login(email, password) {
  return auth.signInWithEmailAndPassword(email, password);
}

function logout() {
  return auth.signOut();
}

function resetPassword(email) {
  return auth.sendPasswordResetEmail(email);
}

function updateEmail(user, email) {
  return user.updateEmail(email);
}

function updatePassword(user, password) {
  return user.updatePassword(password);
}

export default {
  namespaced: true,
  state: {
    userId: null,
    user: null,
  },
  getters: {
    isLoggedIn: (state) => {
      return state.user !== null;
    },
  },
  mutations: {
    [mutationType.SET_USER](state, user) {
      state.userId = user?.uid;
      state.user = user;
    },
  },
  actions: {
    signup(_, { email, password }) {
      return signup(email, password);
    },
    login(_, { email, password }) {
      return login(email, password);
    },
    logout() {
      return logout();
    },
    resetPassword(_, email) {
      return resetPassword(email);
    },
    updateEmail({ state }, email) {
      return updateEmail(state.user, email);
    },
    updatePassword({ state }, email) {
      return updatePassword(state.user, email);
    },
    setCurrentUser({ commit }, user) {
      commit(mutationType.SET_USER, user);
    },
  },
};
