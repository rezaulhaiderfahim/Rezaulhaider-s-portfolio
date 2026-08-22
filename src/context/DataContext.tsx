import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './AuthContext';
import {
  personalInfo as initialPersonalInfo,
  publications as initialPublications,
  researchTimeline as initialResearchTimeline,
  awardsData as initialAwardsData,
  experienceData as initialExperienceData,
  notesData as initialNotesData,
} from '../data/portfolioData';
import {
  PersonalInfo,
  Publication,
  ResearchExperience,
  AwardItem,
  ExperienceItem,
  ContactMessage,
  NotePost,
} from '../types';

interface DataContextType {
  personalInfo: PersonalInfo;
  publications: Publication[];
  researchTimeline: ResearchExperience[];
  awards: AwardItem[];
  experience: ExperienceItem[];
  notes: NotePost[];
  messages: ContactMessage[];
  loading: boolean;
  isSeeded: boolean;
  updatePersonalInfo: (data: Partial<PersonalInfo>) => Promise<void>;
  addPublication: (pub: Omit<Publication, 'id'>) => Promise<string>;
  updatePublication: (id: string, pub: Partial<Publication>) => Promise<void>;
  deletePublication: (id: string) => Promise<void>;
  addResearchTimeline: (item: Omit<ResearchExperience, 'id'>) => Promise<string>;
  updateResearchTimeline: (id: string, item: Partial<ResearchExperience>) => Promise<void>;
  deleteResearchTimeline: (id: string) => Promise<void>;
  addAward: (award: Omit<AwardItem, 'id'>) => Promise<string>;
  updateAward: (id: string, award: Partial<AwardItem>) => Promise<void>;
  deleteAward: (id: string) => Promise<void>;
  addExperience: (exp: Omit<ExperienceItem, 'id'>) => Promise<string>;
  updateExperience: (id: string, exp: Partial<ExperienceItem>) => Promise<void>;
  deleteExperience: (id: string) => Promise<void>;
  addNote: (note: Omit<NotePost, 'id'>) => Promise<string>;
  updateNote: (id: string, note: Partial<NotePost>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  sendMessage: (msg: { name: string; email: string; purpose: string; subject?: string; message: string }) => Promise<void>;
  markMessageRead: (id: string, read: boolean) => Promise<void>;
  deleteMessage: (id: string) => Promise<void>;
  seedDatabase: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Helper to recursively remove undefined properties from objects before sending to Firestore
const cleanDocData = <T extends Record<string, any>>(obj: T): T => {
  const result: any = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        result[key] = cleanDocData(value);
      } else {
        result[key] = value;
      }
    }
  }
  return result;
};

// Local caching helpers to prevent initial render flash/hydration shift
const CACHE_KEYS = {
  PERSONAL_INFO: 'mrh_portfolio_personal_info_v1',
  PUBLICATIONS: 'mrh_portfolio_publications_v1',
  TIMELINE: 'mrh_portfolio_timeline_v1',
  AWARDS: 'mrh_portfolio_awards_v1',
  EXPERIENCE: 'mrh_portfolio_experience_v1',
  NOTES: 'mrh_portfolio_notes_v1',
};

const getCachedData = <T,>(key: string, fallback: T): T => {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = localStorage.getItem(key);
    if (item) {
      return JSON.parse(item);
    }
  } catch (e) {
    // Non-blocking fallback
  }
  return fallback;
};

const setCachedData = <T,>(key: string, data: T) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    // Non-blocking quota catch
  }
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAdmin } = useAuth();
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>(() =>
    getCachedData(CACHE_KEYS.PERSONAL_INFO, initialPersonalInfo)
  );
  const [publications, setPublications] = useState<Publication[]>(() =>
    getCachedData(CACHE_KEYS.PUBLICATIONS, initialPublications)
  );
  const [researchTimeline, setResearchTimeline] = useState<ResearchExperience[]>(() =>
    getCachedData(CACHE_KEYS.TIMELINE, initialResearchTimeline)
  );
  const [awards, setAwards] = useState<AwardItem[]>(() =>
    getCachedData(CACHE_KEYS.AWARDS, initialAwardsData)
  );
  const [experience, setExperience] = useState<ExperienceItem[]>(() =>
    getCachedData(CACHE_KEYS.EXPERIENCE, initialExperienceData)
  );
  const [notes, setNotes] = useState<NotePost[]>(() =>
    getCachedData(CACHE_KEYS.NOTES, initialNotesData)
  );
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSeeded, setIsSeeded] = useState<boolean>(true);

  // Sync Personal Info Doc
  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'portfolio_data', 'main'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as PersonalInfo;
        setPersonalInfo(data);
        setCachedData(CACHE_KEYS.PERSONAL_INFO, data);
      }
    }, (err) => {
      console.warn('Firestore portfolio_data listener notice:', err.message);
    });
    return () => unsub();
  }, []);

  // Sync Publications Collection
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'publications'), (snapshot) => {
      if (!snapshot.empty) {
        const list: Publication[] = [];
        snapshot.forEach((d) => {
          list.push({ id: d.id, ...d.data() } as Publication);
        });
        list.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
        setPublications(list);
        setCachedData(CACHE_KEYS.PUBLICATIONS, list);
      }
    }, (err) => {
      console.warn('Firestore publications listener notice:', err.message);
    });
    return () => unsub();
  }, []);

  // Sync Research Timeline
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'research_timeline'), (snapshot) => {
      if (!snapshot.empty) {
        const list: ResearchExperience[] = [];
        snapshot.forEach((d) => {
          list.push({ id: d.id, ...d.data() } as ResearchExperience);
        });
        list.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
        setResearchTimeline(list);
        setCachedData(CACHE_KEYS.TIMELINE, list);
      }
    }, (err) => {
      console.warn('Firestore research_timeline listener notice:', err.message);
    });
    return () => unsub();
  }, []);

  // Sync Awards
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'awards'), (snapshot) => {
      if (!snapshot.empty) {
        const list: AwardItem[] = [];
        snapshot.forEach((d) => {
          list.push({ id: d.id, ...d.data() } as AwardItem);
        });
        list.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
        setAwards(list);
        setCachedData(CACHE_KEYS.AWARDS, list);
      }
    }, (err) => {
      console.warn('Firestore awards listener notice:', err.message);
    });
    return () => unsub();
  }, []);

  // Sync Experience
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'experience'), (snapshot) => {
      if (!snapshot.empty) {
        const list: ExperienceItem[] = [];
        snapshot.forEach((d) => {
          list.push({ id: d.id, ...d.data() } as ExperienceItem);
        });
        list.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
        setExperience(list);
        setCachedData(CACHE_KEYS.EXPERIENCE, list);
      }
    }, (err) => {
      console.warn('Firestore experience listener notice:', err.message);
    });
    return () => unsub();
  }, []);

  // Sync Notes & Thoughts
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'notes'), (snapshot) => {
      if (!snapshot.empty) {
        const list: NotePost[] = [];
        snapshot.forEach((d) => {
          list.push({ id: d.id, ...d.data() } as NotePost);
        });
        list.sort((a, b) => {
          const dateA = a.publishedAt || a.date || '';
          const dateB = b.publishedAt || b.date || '';
          return dateB.localeCompare(dateA);
        });
        setNotes(list);
        setCachedData(CACHE_KEYS.NOTES, list);
      }
    }, (err) => {
      console.warn('Firestore notes listener notice:', err.message);
    });
    return () => unsub();
  }, []);

  // Sync Messages (Admin only)
  useEffect(() => {
    if (!isAdmin) {
      setMessages([]);
      return;
    }
    const unsub = onSnapshot(collection(db, 'messages'), (snapshot) => {
      const list: ContactMessage[] = [];
      snapshot.forEach((d) => {
        list.push({ id: d.id, ...d.data() } as ContactMessage);
      });
      list.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
      setMessages(list);
    }, (err) => {
      console.warn('Firestore messages listener notice:', err.message);
    });
    return () => unsub();
  }, [isAdmin]);

  // Initial check & auto-seeding if admin is logged in and DB has no items
  useEffect(() => {
    const checkAndAutoSeed = async () => {
      try {
        const mainDoc = await getDoc(doc(db, 'portfolio_data', 'main'));
        if (!mainDoc.exists() && isAdmin) {
          await seedDatabase();
        }
      } catch (e) {
        console.log('Database initial sync status ready.');
      } finally {
        setLoading(false);
      }
    };
    checkAndAutoSeed();
  }, [isAdmin]);

  // Seed All Data to Firestore
  const seedDatabase = async () => {
    try {
      // 1. Seed main portfolio data
      await setDoc(doc(db, 'portfolio_data', 'main'), {
        ...initialPersonalInfo,
        updatedAt: new Date().toISOString(),
      });

      // 2. Seed publications
      for (let i = 0; i < initialPublications.length; i++) {
        const pub = initialPublications[i];
        await setDoc(doc(db, 'publications', pub.id), {
          ...pub,
          order: i,
        });
      }

      // 3. Seed research timeline
      for (let i = 0; i < initialResearchTimeline.length; i++) {
        const item = initialResearchTimeline[i];
        await setDoc(doc(db, 'research_timeline', item.id), {
          ...item,
          order: i,
        });
      }

      // 4. Seed awards
      for (let i = 0; i < initialAwardsData.length; i++) {
        const award = initialAwardsData[i];
        await setDoc(doc(db, 'awards', award.id), {
          ...award,
          order: i,
        });
      }

      // 5. Seed experience
      for (let i = 0; i < initialExperienceData.length; i++) {
        const exp = initialExperienceData[i];
        await setDoc(doc(db, 'experience', exp.id), {
          ...exp,
          order: i,
        });
      }

      // 6. Seed notes
      for (let i = 0; i < initialNotesData.length; i++) {
        const note = initialNotesData[i];
        await setDoc(doc(db, 'notes', note.id), {
          ...note,
          order: i,
        });
      }

      setIsSeeded(true);
    } catch (err) {
      console.error('Error seeding database:', err);
      throw err;
    }
  };

  // CRUD Operations
  const updatePersonalInfo = async (data: Partial<PersonalInfo>) => {
    const cleaned = cleanDocData(data);
    const merged = { ...personalInfo, ...cleaned, updatedAt: new Date().toISOString() };
    setPersonalInfo(merged);
    setCachedData(CACHE_KEYS.PERSONAL_INFO, merged);
    try {
      await setDoc(doc(db, 'portfolio_data', 'main'), merged, { merge: true });
    } catch (err) {
      console.warn('Firestore updatePersonalInfo background sync notice:', err);
    }
  };

  const addPublication = async (pub: Omit<Publication, 'id'>) => {
    const newId = 'pub_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
    const cleaned = cleanDocData(pub);
    const newPubItem: Publication = {
      id: newId,
      ...cleaned,
      order: publications.length,
    } as Publication;

    // Optimistic local state update
    const updatedList = [...publications, newPubItem];
    setPublications(updatedList);
    setCachedData(CACHE_KEYS.PUBLICATIONS, updatedList);

    try {
      const docRef = await addDoc(collection(db, 'publications'), {
        ...cleaned,
        order: publications.length,
        createdAt: new Date().toISOString(),
      });
      // Update with generated Firestore ID if needed
      if (docRef.id) {
        const syncedList = updatedList.map((p) => (p.id === newId ? { ...p, id: docRef.id } : p));
        setPublications(syncedList);
        setCachedData(CACHE_KEYS.PUBLICATIONS, syncedList);
        return docRef.id;
      }
    } catch (err) {
      console.warn('Firestore addPublication background sync notice:', err);
    }
    return newId;
  };

  const updatePublication = async (id: string, pub: Partial<Publication>) => {
    const cleaned = cleanDocData(pub);
    // Optimistic local state update
    const updatedList = publications.map((p) => (p.id === id ? { ...p, ...cleaned } : p));
    setPublications(updatedList);
    setCachedData(CACHE_KEYS.PUBLICATIONS, updatedList);

    try {
      await updateDoc(doc(db, 'publications', id), {
        ...cleaned,
        updatedAt: new Date().toISOString(),
      });
    } catch (err) {
      console.warn('Firestore updatePublication background sync notice:', err);
    }
  };

  const deletePublication = async (id: string) => {
    // Optimistic local state update
    const updatedList = publications.filter((p) => p.id !== id);
    setPublications(updatedList);
    setCachedData(CACHE_KEYS.PUBLICATIONS, updatedList);

    try {
      await deleteDoc(doc(db, 'publications', id));
    } catch (err) {
      console.warn('Firestore deletePublication background sync notice:', err);
    }
  };

  const addResearchTimeline = async (item: Omit<ResearchExperience, 'id'>) => {
    const newId = 'time_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
    const cleaned = cleanDocData(item);
    const newItem: ResearchExperience = {
      id: newId,
      ...cleaned,
      order: researchTimeline.length,
    } as ResearchExperience;

    const updatedList = [...researchTimeline, newItem];
    setResearchTimeline(updatedList);
    setCachedData(CACHE_KEYS.TIMELINE, updatedList);

    try {
      const docRef = await addDoc(collection(db, 'research_timeline'), {
        ...cleaned,
        order: researchTimeline.length,
        createdAt: new Date().toISOString(),
      });
      if (docRef.id) {
        const syncedList = updatedList.map((t) => (t.id === newId ? { ...t, id: docRef.id } : t));
        setResearchTimeline(syncedList);
        setCachedData(CACHE_KEYS.TIMELINE, syncedList);
        return docRef.id;
      }
    } catch (err) {
      console.warn('Firestore addResearchTimeline background sync notice:', err);
    }
    return newId;
  };

  const updateResearchTimeline = async (id: string, item: Partial<ResearchExperience>) => {
    const cleaned = cleanDocData(item);
    const updatedList = researchTimeline.map((t) => (t.id === id ? { ...t, ...cleaned } : t));
    setResearchTimeline(updatedList);
    setCachedData(CACHE_KEYS.TIMELINE, updatedList);

    try {
      await updateDoc(doc(db, 'research_timeline', id), {
        ...cleaned,
        updatedAt: new Date().toISOString(),
      });
    } catch (err) {
      console.warn('Firestore updateResearchTimeline background sync notice:', err);
    }
  };

  const deleteResearchTimeline = async (id: string) => {
    const updatedList = researchTimeline.filter((t) => t.id !== id);
    setResearchTimeline(updatedList);
    setCachedData(CACHE_KEYS.TIMELINE, updatedList);

    try {
      await deleteDoc(doc(db, 'research_timeline', id));
    } catch (err) {
      console.warn('Firestore deleteResearchTimeline background sync notice:', err);
    }
  };

  const addAward = async (award: Omit<AwardItem, 'id'>) => {
    const newId = 'award_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
    const cleaned = cleanDocData(award);
    const newItem: AwardItem = {
      id: newId,
      ...cleaned,
      order: awards.length,
    } as AwardItem;

    const updatedList = [...awards, newItem];
    setAwards(updatedList);
    setCachedData(CACHE_KEYS.AWARDS, updatedList);

    try {
      const docRef = await addDoc(collection(db, 'awards'), {
        ...cleaned,
        order: awards.length,
        createdAt: new Date().toISOString(),
      });
      if (docRef.id) {
        const syncedList = updatedList.map((a) => (a.id === newId ? { ...a, id: docRef.id } : a));
        setAwards(syncedList);
        setCachedData(CACHE_KEYS.AWARDS, syncedList);
        return docRef.id;
      }
    } catch (err) {
      console.warn('Firestore addAward background sync notice:', err);
    }
    return newId;
  };

  const updateAward = async (id: string, award: Partial<AwardItem>) => {
    const cleaned = cleanDocData(award);
    const updatedList = awards.map((a) => (a.id === id ? { ...a, ...cleaned } : a));
    setAwards(updatedList);
    setCachedData(CACHE_KEYS.AWARDS, updatedList);

    try {
      await updateDoc(doc(db, 'awards', id), {
        ...cleaned,
        updatedAt: new Date().toISOString(),
      });
    } catch (err) {
      console.warn('Firestore updateAward background sync notice:', err);
    }
  };

  const deleteAward = async (id: string) => {
    const updatedList = awards.filter((a) => a.id !== id);
    setAwards(updatedList);
    setCachedData(CACHE_KEYS.AWARDS, updatedList);

    try {
      await deleteDoc(doc(db, 'awards', id));
    } catch (err) {
      console.warn('Firestore deleteAward background sync notice:', err);
    }
  };

  const addExperience = async (exp: Omit<ExperienceItem, 'id'>) => {
    const newId = 'exp_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
    const cleaned = cleanDocData(exp);
    const newItem: ExperienceItem = {
      id: newId,
      ...cleaned,
      order: experience.length,
    } as ExperienceItem;

    const updatedList = [...experience, newItem];
    setExperience(updatedList);
    setCachedData(CACHE_KEYS.EXPERIENCE, updatedList);

    try {
      const docRef = await addDoc(collection(db, 'experience'), {
        ...cleaned,
        order: experience.length,
        createdAt: new Date().toISOString(),
      });
      if (docRef.id) {
        const syncedList = updatedList.map((e) => (e.id === newId ? { ...e, id: docRef.id } : e));
        setExperience(syncedList);
        setCachedData(CACHE_KEYS.EXPERIENCE, syncedList);
        return docRef.id;
      }
    } catch (err) {
      console.warn('Firestore addExperience background sync notice:', err);
    }
    return newId;
  };

  const updateExperience = async (id: string, exp: Partial<ExperienceItem>) => {
    const cleaned = cleanDocData(exp);
    const updatedList = experience.map((e) => (e.id === id ? { ...e, ...cleaned } : e));
    setExperience(updatedList);
    setCachedData(CACHE_KEYS.EXPERIENCE, updatedList);

    try {
      await updateDoc(doc(db, 'experience', id), {
        ...cleaned,
        updatedAt: new Date().toISOString(),
      });
    } catch (err) {
      console.warn('Firestore updateExperience background sync notice:', err);
    }
  };

  const deleteExperience = async (id: string) => {
    const updatedList = experience.filter((e) => e.id !== id);
    setExperience(updatedList);
    setCachedData(CACHE_KEYS.EXPERIENCE, updatedList);

    try {
      await deleteDoc(doc(db, 'experience', id));
    } catch (err) {
      console.warn('Firestore deleteExperience background sync notice:', err);
    }
  };

  const addNote = async (note: Omit<NotePost, 'id'>) => {
    const newId = 'note_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
    const cleaned = cleanDocData(note);
    const newItem: NotePost = {
      id: newId,
      ...cleaned,
      order: notes.length,
    } as NotePost;

    const updatedList = [newItem, ...notes];
    setNotes(updatedList);
    setCachedData(CACHE_KEYS.NOTES, updatedList);

    try {
      const docRef = await addDoc(collection(db, 'notes'), {
        ...cleaned,
        createdAt: new Date().toISOString(),
        order: notes.length,
      });
      if (docRef.id) {
        const syncedList = updatedList.map((n) => (n.id === newId ? { ...n, id: docRef.id } : n));
        setNotes(syncedList);
        setCachedData(CACHE_KEYS.NOTES, syncedList);
        return docRef.id;
      }
    } catch (err) {
      console.warn('Firestore addNote background sync notice:', err);
    }
    return newId;
  };

  const updateNote = async (id: string, note: Partial<NotePost>) => {
    const cleaned = cleanDocData(note);
    const updatedList = notes.map((n) => (n.id === id ? { ...n, ...cleaned } : n));
    setNotes(updatedList);
    setCachedData(CACHE_KEYS.NOTES, updatedList);

    try {
      await updateDoc(doc(db, 'notes', id), {
        ...cleaned,
        updatedAt: new Date().toISOString(),
      });
    } catch (err) {
      console.warn('Firestore updateNote background sync notice:', err);
    }
  };

  const deleteNote = async (id: string) => {
    const updatedList = notes.filter((n) => n.id !== id);
    setNotes(updatedList);
    setCachedData(CACHE_KEYS.NOTES, updatedList);

    try {
      await deleteDoc(doc(db, 'notes', id));
    } catch (err) {
      console.warn('Firestore deleteNote background sync notice:', err);
    }
  };

  const sendMessage = async (msg: { name: string; email: string; purpose: string; subject?: string; message: string }) => {
    const cleaned = cleanDocData(msg);
    try {
      await addDoc(collection(db, 'messages'), {
        ...cleaned,
        createdAt: new Date().toISOString(),
        read: false,
      });
    } catch (err) {
      console.warn('Firestore sendMessage sync notice:', err);
    }
  };

  const markMessageRead = async (id: string, read: boolean) => {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, read } : m)));
    try {
      await updateDoc(doc(db, 'messages', id), { read });
    } catch (err) {
      console.warn('Firestore markMessageRead sync notice:', err);
    }
  };

  const deleteMessage = async (id: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
    try {
      await deleteDoc(doc(db, 'messages', id));
    } catch (err) {
      console.warn('Firestore deleteMessage sync notice:', err);
    }
  };

  return (
    <DataContext.Provider
      value={{
        personalInfo,
        publications,
        researchTimeline,
        awards,
        experience,
        notes,
        messages,
        loading,
        isSeeded,
        updatePersonalInfo,
        addPublication,
        updatePublication,
        deletePublication,
        addResearchTimeline,
        updateResearchTimeline,
        deleteResearchTimeline,
        addAward,
        updateAward,
        deleteAward,
        addExperience,
        updateExperience,
        deleteExperience,
        addNote,
        updateNote,
        deleteNote,
        sendMessage,
        markMessageRead,
        deleteMessage,
        seedDatabase,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
