import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { useAuth } from './AuthContext';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  onSnapshot, 
  query, 
  where, 
  serverTimestamp 
} from 'firebase/firestore';

const BambupediaContext = createContext();

export const useBambupedia = () => {
  const context = useContext(BambupediaContext);
  if (!context) {
    throw new Error("useBambupedia must be used within a BambupediaProvider");
  }
  return context;
};

export const BambupediaProvider = ({ children }) => {
  const { user } = useAuth();
  
  const [plantings, setPlantings] = useState([]);
  const [maintenances, setMaintenances] = useState([]);
  const [harvests, setHarvests] = useState([]);
  const [utilizations, setUtilizations] = useState([]);
  const [cultivations, setCultivations] = useState([]);
  const [taxonomies, setTaxonomies] = useState([]);
  
  // Real-time Sync from Firestore
  useEffect(() => {
    if (!db || !user) {
      // Clear data if logged out
      setPlantings([]);
      setMaintenances([]);
      setHarvests([]);
      setUtilizations([]);
      setCultivations([]);
      setTaxonomies([]);
      return;
    }

    const userId = user.id;

    // Helper for creating listeners
    const createListener = (collectionName, setState) => {
      const q = query(collection(db, collectionName), where("userId", "==", userId));
      return onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setState(data);
      }, (err) => console.error(`Sync Error (${collectionName}):`, err));
    };

    const unsubPlantings = createListener("plantings", setPlantings);
    const unsubMaintenances = createListener("maintenances", setMaintenances);
    const unsubHarvests = createListener("harvests", setHarvests);
    const unsubUtilizations = createListener("utilizations", setUtilizations);
    const unsubCultivations = createListener("cultivations", setCultivations);
    const unsubTaxonomies = createListener("taxonomies", setTaxonomies);

    return () => {
      unsubPlantings();
      unsubMaintenances();
      unsubHarvests();
      unsubUtilizations();
      unsubCultivations();
      unsubTaxonomies();
    };
  }, [user]);

  const addPlanting = async (data) => {
    if (!user) return null;
    const newPlanting = {
      ...data,
      userId: user.uid || user.id,
      date: data.date || new Date().toISOString(),
      status: data.status || 'planted',
      createdAt: serverTimestamp()
    };
    
    try {
      const docRef = await addDoc(collection(db, "plantings"), newPlanting);
      return { id: docRef.id, ...newPlanting };
    } catch (err) {
      console.error("Add Planting Error:", err);
      return null;
    }
  };

  const verifyPlanting = async (id) => {
    try {
      await updateDoc(doc(db, "plantings", id), { isVerified: true });
    } catch (err) {
      console.error("Verify Planting Error:", err);
    }
  };

  const addMaintenance = async (data) => {
    if (!user) return null;
    const newMaintenance = {
      ...data,
      userId: user.uid || user.id,
      date: new Date().toISOString(),
      createdAt: serverTimestamp()
    };
    try {
      const docRef = await addDoc(collection(db, "maintenances"), newMaintenance);
      return { id: docRef.id, ...newMaintenance };
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const addHarvest = async (data) => {
    if (!user) return null;
    const newHarvest = {
      ...data,
      userId: user.uid || user.id,
      date: new Date().toISOString(),
      createdAt: serverTimestamp()
    };
    
    try {
      const docRef = await addDoc(collection(db, "harvests"), newHarvest);
      
      // Update planting status to harvested
      if (data.plantingId) {
        await updateDoc(doc(db, "plantings", data.plantingId), { status: 'harvested' });
      }
      
      return { id: docRef.id, ...newHarvest };
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const addUtilization = async (data) => {
    if (!user) return null;
    const newUtil = {
      ...data,
      userId: user.uid || user.id,
      date: new Date().toISOString(),
      createdAt: serverTimestamp()
    };
    try {
      const docRef = await addDoc(collection(db, "utilizations"), newUtil);
      return { id: docRef.id, ...newUtil };
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const addCultivation = async (data) => {
    if (!user) return null;
    const newCult = {
      ...data,
      userId: user.uid || user.id,
      date: new Date().toISOString(),
      createdAt: serverTimestamp()
    };
    try {
      const docRef = await addDoc(collection(db, "cultivations"), newCult);
      return { id: docRef.id, ...newCult };
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const addTaxonomy = async (data) => {
    if (!user) return null;
    const newTax = {
      ...data,
      userId: user.uid || user.id,
      date: new Date().toISOString(),
      createdAt: serverTimestamp()
    };
    try {
      const docRef = await addDoc(collection(db, "taxonomies"), newTax);
      return { id: docRef.id, ...newTax };
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  return (
    <BambupediaContext.Provider value={{
      plantings, addPlanting,
      maintenances, addMaintenance,
      harvests, addHarvest,
      utilizations, addUtilization,
      cultivations, addCultivation,
      taxonomies, addTaxonomy,
      verifyPlanting
    }}>
      {children}
    </BambupediaContext.Provider>
  );
};
