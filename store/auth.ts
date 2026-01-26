import { MutationTree, ActionTree } from 'vuex';
import { signInWithPopup, signOut } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { User } from '@/types/user';
import { firebaseAuth, googleAuthProvider } from '@/plugins/firebase';
import firestore from '@/plugins/firestore';

interface State {
  loading: boolean;
  user: User;
}

export const state = (): State => ({
  loading: false,
  user: null,
});

export const mutations: MutationTree<State> = {
  setLoading(state: State, loading: boolean): void {
    state.loading = loading;
  },
  setUser(state: State, user: User): void {
    state.user = user;
  },
};

export const actions: ActionTree<State, State> = {
  async authStateChange({ commit }, firebaseUser) {
    commit('setLoading', true);

    let user: User = {
      ...firebaseUser.providerData[0],
      emailVerified: firebaseUser.emailVerified,
      isAnonymous: firebaseUser.isAnonymous,
      uid: firebaseUser.uid,
    };

    if (user && user.uid) {
      const userRef = doc(firestore, 'users', user.uid);
      await setDoc(userRef, user, { merge: true });

      const roleRef = doc(firestore, 'roles', user.uid);
      const role = await getDoc(roleRef);

      if (role.exists()) {
        user = { ...user, isAdmin: role.data()?.role === 'admin' };
      }
    }

    commit('setUser', user);
    commit('setLoading', false);
  },

  async signInWithGoogle() {
    await signInWithPopup(firebaseAuth, googleAuthProvider);
  },

  async signOut({ commit }) {
    await signOut(firebaseAuth);
    commit('setUser', null);
  },
};
