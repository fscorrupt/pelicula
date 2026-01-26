import { onAuthStateChanged, User } from 'firebase/auth';
import { firebaseAuth } from '@/plugins/firebase';

export default async ({ store }) => {
  await new Promise<void>((resolve) => {
    onAuthStateChanged(firebaseAuth, async (user: User | null) => {
      if (user) {
        await store.dispatch('auth/authStateChange', user);
      }
      resolve();
    });
  });
};
