import React, { createContext, useContext, useState, useEffect } from 'react';

const BambupediaContext = createContext();

export const useBambupedia = () => {
  const context = useContext(BambupediaContext);
  if (!context) {
    throw new Error("useBambupedia must be used within a BambupediaProvider");
  }
  return context;
};

export const BambupediaProvider = ({ children }) => {
  const loadData = (key, defaultValue) => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  };

  const [plantings, setPlantings] = useState(() => loadData('bambupedia_plantings', []));
  const [maintenances, setMaintenances] = useState(() => loadData('bambupedia_maintenances', []));
  const [harvests, setHarvests] = useState(() => loadData('bambupedia_harvests', []));
  const [utilizations, setUtilizations] = useState(() => loadData('bambupedia_utilizations', []));
  const [cultivations, setCultivations] = useState(() => loadData('bambupedia_cultivations', []));
  const [taxonomies, setTaxonomies] = useState(() => loadData('bambupedia_taxonomies', []));
  
  useEffect(() => { localStorage.setItem('bambupedia_plantings', JSON.stringify(plantings)); }, [plantings]);
  useEffect(() => { localStorage.setItem('bambupedia_maintenances', JSON.stringify(maintenances)); }, [maintenances]);
  useEffect(() => { localStorage.setItem('bambupedia_harvests', JSON.stringify(harvests)); }, [harvests]);
  useEffect(() => { localStorage.setItem('bambupedia_utilizations', JSON.stringify(utilizations)); }, [utilizations]);
  useEffect(() => { localStorage.setItem('bambupedia_cultivations', JSON.stringify(cultivations)); }, [cultivations]);
  useEffect(() => { localStorage.setItem('bambupedia_taxonomies', JSON.stringify(taxonomies)); }, [taxonomies]);

  const addPlanting = (data) => {
    const newPlanting = {
      ...data,
      id: 'pl_' + Math.random().toString(36).substr(2, 9),
      date: data.date || new Date().toISOString(),
      status: data.status || 'planted'
    };
    setPlantings(prev => [newPlanting, ...prev]);
    return newPlanting;
  };

  const verifyPlanting = (id) => {
    setPlantings(prev => prev.map(p => p.id === id ? { ...p, isVerified: true } : p));
  };

  const addMaintenance = (data) => {
    const newMaintenance = {
      ...data,
      id: 'mt_' + Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString()
    };
    setMaintenances(prev => [newMaintenance, ...prev]);
    return newMaintenance;
  };

  const addHarvest = (data) => {
    const newHarvest = {
      ...data,
      id: 'hv_' + Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString()
    };
    setHarvests(prev => [newHarvest, ...prev]);
    
    // Update planting status to harvested
    if (data.plantingId) {
      setPlantings(prev => prev.map(p => p.id === data.plantingId ? { ...p, status: 'harvested' } : p));
    }
    
    return newHarvest;
  };

  const addUtilization = (data) => {
    const newUtil = {
      ...data,
      id: 'ut_' + Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString()
    };
    setUtilizations(prev => [newUtil, ...prev]);
    return newUtil;
  };

  const addCultivation = (data) => {
    const newCult = {
      ...data,
      id: 'cl_' + Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString()
    };
    setCultivations(prev => [newCult, ...prev]);
    return newCult;
  };

  const addTaxonomy = (data) => {
    const newTax = {
      ...data,
      id: 'tx_' + Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString()
    };
    setTaxonomies(prev => [newTax, ...prev]);
    return newTax;
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
