import { onAuthStateChanged, User, Auth } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { firebaseAuth } from '@/plugins/firebase';
import firestore from '@/plugins/firestore';

export default async function ({ redirect, route }) {
  try {
    const user: User | null = await getCurrentUser(firebaseAuth);
    if (user == null && isAuthenticatedRoute(route)) redirect('/login');
    if (user != null && route.name === 'login') redirect('/overview');

    if (user && isAdminRoute(route)) {
      const isAdmin = await hasAdminRole(user);
      if (!isAdmin) redirect('/overview');
    }
  } catch (error) {
    redirect('/login');
  }
}

function isAuthenticatedRoute(route) {
  return isAdminRoute(route) || isUserRoute(route);
}

function isAdminRoute(route) {
  if (route.matched.some((record) => record.path === '/admin')) {
    return true;
  }
}

function isUserRoute(route) {
  return ['profile', 'overview'].includes(route.name);
}

async function hasAdminRole(user: User) {
  if (!user.uid) return false;

  const roleRef = doc(firestore, 'roles', user.uid);
  const role = await getDoc(roleRef);

  return role.exists() && role.data()?.role === 'admin';
}

function getCurrentUser(auth: Auth): Promise<User | null> {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        unsubscribe();
        resolve(user);
      },
      reject,
    );
  });
}
