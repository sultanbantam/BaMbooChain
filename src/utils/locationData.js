export const globalLocations = {
  "INDONESIA": [
    { name: "Sabumi Kebalen, Serang, Banten", lat: -6.1185, lng: 106.1503, category: "Eco Village" },
    { name: "Tegal Maja, Kragilan, Serang, Banten", lat: -6.2091, lng: 106.3010, category: "Plantation" },
    { name: "Keranggan, Setu, Tangerang Selatan", lat: -6.3345, lng: 106.7340, category: "River / Eco Tourism" },
    { name: "Cisadane River, Banten - Tangerang", lat: -6.2000, lng: 106.6500, category: "River" },
    { name: "Kasepuhan Cibarani, Lebak, Banten", lat: -6.6370, lng: 106.2090, category: "Forest / Customary Land" },
    { name: "Gunung Liman, Lebak, Banten", lat: -6.6500, lng: 106.2300, category: "Mountain / Forest" },
    { name: "Ujung Kulon National Park, Banten", lat: -6.7560, lng: 105.3730, category: "Conservation Forest" },
    { name: "Bandung Timur, Jawa Barat", lat: -6.9147, lng: 107.6098, category: "Highland" },
    { name: "Ciwidey, Bandung", lat: -7.1340, lng: 107.3890, category: "Plantation" },
    { name: "Yogyakarta Rural Area", lat: -7.7956, lng: 110.3695, category: "Village" },
    { name: "Bali Agroforestry Area", lat: -8.4095, lng: 115.1889, category: "Plantation" },
    { name: "Lombok Green Area", lat: -8.6500, lng: 116.3249, category: "Coastal / Plantation" },
    { name: "Kalimantan Forest Zone", lat: -0.7893, lng: 113.9213, category: "Tropical Forest" },
    { name: "Papua Highland Forest", lat: -4.2699, lng: 138.0804, category: "Forest" }
  ],
  "ASIA": [
    { name: "Sichuan Bamboo Forest, China", lat: 30.5728, lng: 104.0668, category: "Forest" },
    { name: "Anji Bamboo Forest, China", lat: 30.6380, lng: 119.6810, category: "Plantation" },
    { name: "Kyoto Bamboo Grove, Japan", lat: 35.0094, lng: 135.6668, category: "Tourism Forest" },
    { name: "Chiang Mai Bamboo Area, Thailand", lat: 18.7883, lng: 98.9853, category: "Agroforestry" }
  ],
  "GLOBAL": [
    { name: "Assam Bamboo Region, India", lat: 26.2006, lng: 92.9376, category: "Forest" },
    { name: "Kerala Bamboo Area, India", lat: 10.8505, lng: 76.2711, category: "Plantation" },
    { name: "Ethiopian Bamboo Forest", lat: 9.1450, lng: 40.4897, category: "Forest" },
    { name: "Colombia Guadua Bamboo Forest", lat: 4.5709, lng: -74.2973, category: "Forest" },
    { name: "Amazon Bamboo Zone, Brazil", lat: -3.4653, lng: -62.2159, category: "Rainforest" },
    { name: "Portugal Bamboo Plantation", lat: 39.3999, lng: -8.2245, category: "Plantation" },
    { name: "Queensland Bamboo Farm", lat: -20.9176, lng: 142.7028, category: "Farm" }
  ]
};

// Flatten data for easier map pin rendering
export const getAllLocationPins = () => {
  const pins = [];
  Object.entries(globalLocations).forEach(([region, locs]) => {
    locs.forEach(loc => {
      pins.push({ ...loc, region });
    });
  });
  return pins;
};
