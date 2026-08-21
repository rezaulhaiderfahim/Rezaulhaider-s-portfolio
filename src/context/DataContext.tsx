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

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAdmin } = useAuth();
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>(initialPersonalInfo);
  const [publications, setPublications] = useState<Publication[]>(initialPublications);
  const [researchTimeline, setResearchTimeline] = useState<ResearchExperience[]>(initialResearchTimeline);
  const [awards, setAwards] = useState<AwardItem[]>(initialAwardsData);
  const [experience, setExperience] = useState<ExperienceItem[]>(initialExperienceData);
  const [notes, setNotes] = useState<NotePost[]>(initialNotesData);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSeeded, setIsSeeded] = useState<boolean>(true);

  // Sync Personal Info Doc
  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'portfolio_data', 'main'), (docSnap) => {
      if (docSnap.exists()) {
        setPersonalInfo(docSnap.data() as PersonalInfo);
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
        // Sort by order or year
        list.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
        setPublications(list);
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
        // Sort newest first by publishedAt / date
        list.sort((a, b) => {
          const dateA = a.publishedAt || a.date || '';
          const dateB = b.publishedAt || b.date || '';
          return dateB.localeCompare(dateA);
        });
        setNotes(list);
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
    const merged = { ...personalInfo, ...data, updatedAt: new Date().toISOString() };
    await setDoc(doc(db, 'portfolio_data', 'main'), merged, { merge: true });
    setPersonalInfo(merged);
  };

  const addPublication = async (pub: Omit<Publication, 'id'>) => {
    const docRef = await addDoc(collection(db, 'publications'), {
      ...pub,
      order: publications.length,
      createdAt: new Date().toISOString()
    });
    return docRef.id;
  };

  const updatePublication = async (id: string, pub: Partial<Publication>) => {
    await updateDoc(doc(db, 'publications', id), {
      ...pub,
      updatedAt: new Date().toISOString()
    });
  };

  const deletePublication = async (id: string) => {
    await deleteDoc(doc(db, 'publications', id));
  };

  const addResearchTimeline = async (item: Omit<ResearchExperience, 'id'>) => {
    const docRef = await addDoc(collection(db, 'research_timeline'), {
      ...item,
      order: researchTimeline.length,
      createdAt: new Date().toISOString()
    });
    return docRef.id;
  };

  const updateResearchTimeline = async (id: string, item: Partial<ResearchExperience>) => {
    await updateDoc(doc(db, 'research_timeline', id), {
      ...item,
      updatedAt: new Date().toISOString()
    });
  };

  const deleteResearchTimeline = async (id: string) => {
    await deleteDoc(doc(db, 'research_timeline', id));
  };

  const addAward = async (award: Omit<AwardItem, 'id'>) => {
    const docRef = await addDoc(collection(db, 'awards'), {
      ...award,
      order: awards.length,
      createdAt: new Date().toISOString()
    });
    return docRef.id;
  };

  const updateAward = async (id: string, award: Partial<AwardItem>) => {
    await updateDoc(doc(db, 'awards', id), {
      ...award,
      updatedAt: new Date().toISOString()
    });
  };

  const deleteAward = async (id: string) => {
    await deleteDoc(doc(db, 'awards', id));
  };

  const addExperience = async (exp: Omit<ExperienceItem, 'id'>) => {
    const docRef = await addDoc(collection(db, 'experience'), {
      ...exp,
      order: experience.length,
      createdAt: new Date().toISOString()
    });
    return docRef.id;
  };

  const updateExperience = async (id: string, exp: Partial<ExperienceItem>) => {
    await updateDoc(doc(db, 'experience', id), {
      ...exp,
      updatedAt: new Date().toISOString()
    });
  };

  const deleteExperience = async (id: string) => {
    await deleteDoc(doc(db, 'experience', id));
  };

  const addNote = async (note: Omit<NotePost, 'id'>) => {
    const docRef = await addDoc(collection(db, 'notes'), {
      ...note,
      createdAt: new Date().toISOString(),
      order: notes.length
    });
    return docRef.id;
  };

  const updateNote = async (id: string, note: Partial<NotePost>) => {
    await updateDoc(doc(db, 'notes', id), {
      ...note,
      updatedAt: new Date().toISOString()
    });
  };

  const deleteNote = async (id: string) => {
    await deleteDoc(doc(db, 'notes', id));
  };

  const sendMessage = async (msg: { name: string; email: string; purpose: string; subject?: string; message: string }) => {
    await addDoc(collection(db, 'messages'), {
      ...msg,
      createdAt: new Date().toISOString(),
      read: false
    });
  };

  const markMessageRead = async (id: string, read: boolean) => {
    await updateDoc(doc(db, 'messages', id), { read });
  };

  const deleteMessage = async (id: string) => {
    await deleteDoc(doc(db, 'messages', id));
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
