import { MutationTree, ActionTree } from 'vuex';
import {
  collection,
  query,
  orderBy,
  getDocs,
  addDoc,
  doc,
  setDoc,
  deleteDoc,
  QuerySnapshot,
  DocumentData,
  Timestamp,
} from 'firebase/firestore';
import { Event } from '@/types/event';
import firestore from '@/plugins/firestore';

interface State {
  loading: boolean;
  events: Event[];
}

export const state = (): State => ({
  loading: false,
  events: [],
});

export const mutations: MutationTree<State> = {
  setLoading(state: State, loading: boolean): void {
    state.loading = loading;
  },
  setEvents(state: State, events: Event[]): void {
    state.events = events;
  },
};

export const actions: ActionTree<State, State> = {
  async getEvents({ commit }) {
    commit('setLoading', true);

    const eventsRef = collection(firestore, 'events');
    const q = query(eventsRef, orderBy('timestamp'));
    const eventsSnapshot: QuerySnapshot<DocumentData> = await getDocs(q);
    const events: Event[] = eventsSnapshot.docs.map((event) => {
      const eventData = event.data();
      const timestamp = eventData.timestamp as Timestamp;
      const date: Date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds);
      return { id: event.id, timestamp, date, description: eventData.description };
    });

    commit('setEvents', events);
    commit('setLoading', false);
  },
  async addEvent({ dispatch }, event) {
    const eventsRef = collection(firestore, 'events');
    await addDoc(eventsRef, event);
    dispatch('getEvents');
  },
  async updateEvent({ dispatch }, event) {
    const eventRef = doc(firestore, 'events', event.id);
    await setDoc(eventRef, event);
    dispatch('getEvents');
  },
  async deleteEvent({ dispatch }, event) {
    const eventRef = doc(firestore, 'events', event.id);
    await deleteDoc(eventRef);
    dispatch('getEvents');
  },
};
