const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'proposals.json');

// Ensure data directory and file exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2), 'utf8');
}

// Helper to read proposals
const readProposals = () => {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading proposals database:', error);
    return [];
  }
};

// Helper to write proposals
const writeProposals = (proposals) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(proposals, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing to proposals database:', error);
    return false;
  }
};

// 1. Health Check
app.get('/api/v1/agri/health', (req, res) => {
  res.json({ status: 'healthy', service: 'agri-tech-service', timestamp: new Date() });
});

// 2. Get All Proposals
app.get('/api/v1/agri/proposals', (req, res) => {
  const proposals = readProposals();
  res.json(proposals);
});

// 3. Submit Location Proposal
app.post('/api/v1/agri/proposals', (req, res) => {
  const { name, size, type, vision, coordinates, owner } = req.body;

  if (!name || !size) {
    return res.status(400).json({ error: 'Name and size are required fields.' });
  }

  const proposals = readProposals();
  const newProposal = {
    id: uuidv4(),
    name,
    size: parseFloat(size),
    type: type || 'Lahan Adat',
    vision: vision || '',
    coordinates: coordinates || '0.0, 0.0',
    owner: owner || 'Guest',
    status: 'pending',
    date: new Date().toISOString().split('T')[0],
    createdAt: new Date().toISOString()
  };

  proposals.push(newProposal);
  
  if (writeProposals(proposals)) {
    res.status(201).json(newProposal);
  } else {
    res.status(500).json({ error: 'Failed to save proposal to persistent storage.' });
  }
});

// 4. Verify/Approve Proposal
app.put('/api/v1/agri/proposals/:id/verify', (req, res) => {
  const { id } = req.params;
  const proposals = readProposals();
  const proposalIndex = proposals.findIndex(p => p.id === id);

  if (proposalIndex === -1) {
    return res.status(404).json({ error: 'Proposal not found.' });
  }

  proposals[proposalIndex].status = 'verified';
  proposals[proposalIndex].updatedAt = new Date().toISOString();

  if (writeProposals(proposals)) {
    res.json(proposals[proposalIndex]);
  } else {
    res.status(500).json({ error: 'Failed to update proposal.' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`[Agri-Tech Service] Running on port ${PORT}`);
  console.log(`[Agri-Tech Service] Persistence file: ${DATA_FILE}`);
});
