require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;
const RENDER_API_KEY = process.env.RENDER_API_KEY;
const RENDER_API = 'https://api.render.com/v1';

if(!RENDER_API_KEY){
  console.error("Please set RENDER_API_KEY in .env");
  process.exit(1);
}

const headers = {
  Authorization: `Bearer ${RENDER_API_KEY}`,
  'Content-Type': 'application/json'
};

// ✅ Create Bot Service
app.post('/api/create-service', async (req,res)=>{
  try{
    const { name, repo, botToken } = req.body;

    const payload = {
      name,
      repo,
      branch: "main",
      serviceType: "worker",
      buildCommand: "pip install -r requirements.txt",
      startCommand: "python bot.py",
      envVars: [
        { key: "BOT_TOKEN", value: botToken }
      ]
    };

    const response = await axios.post(`${RENDER_API}/services`, payload, { headers });
    res.json(response.data);

  } catch(err){
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: err.response?.data || err.message });
  }
});

// ✅ Deploy Service (manual trigger)
app.post('/api/deploy/:serviceId', async (req,res)=>{
  const { serviceId } = req.params;
  try{
    const response = await axios.post(`${RENDER_API}/services/${serviceId}/deploys`, {}, { headers });
    res.json(response.data);
  }catch(err){
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: err.response?.data || err.message });
  }
});

// ✅ Get Logs
app.get('/api/logs/:serviceId', async (req,res)=>{
  const { serviceId } = req.params;
  try{
    const response = await axios.get(`${RENDER_API}/services/${serviceId}/logs`, { headers });
    res.json(response.data);
  }catch(err){
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: err.response?.data || err.message });
  }
});

app.listen(PORT, ()=> console.log(`Backend running at http://localhost:${PORT}`));
