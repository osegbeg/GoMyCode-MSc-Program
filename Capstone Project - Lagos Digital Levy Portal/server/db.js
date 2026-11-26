const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const DB_PATH = path.join(__dirname, '..', 'data', 'store.json');

const defaultSeed = {
  rates: [
    { id: 'RATE-KEKE', operatorType: 'Keke Napep (Tricycle)', zone: 'Ikeja / Oshodi', amount: 800, durationHours: 24 },
    { id: 'RATE-BUS', operatorType: 'Commercial Bus (Danfo / Korope)', zone: 'Mile 12 - CMS Corridor', amount: 1500, durationHours: 24 },
    { id: 'RATE-OKADA', operatorType: 'Dispatch / Okada Rider', zone: 'Yaba / Surulere', amount: 500, durationHours: 24 },
    { id: 'RATE-BARROW', operatorType: 'Market Trader / Wheelbarrow Pusher', zone: 'Ladipo / Balogun Market', amount: 400, durationHours: 24 },
  ],
  passes: [
    {
      referenceCode: 'LGS-IGR-1001',
      operatorName: 'Musa Abdullahi',
      identifier: 'LAG-123-XA',
      operatorType: 'Commercial Bus (Danfo / Korope)',
      zone: 'Mile 12 - CMS Corridor',
      amount: 1500,
      issuedAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
      expiresAt: new Date(Date.now() + 21 * 3600 * 1000).toISOString(),
      remittanceStatus: 'REMITTED_TO_IGR',
    },
    {
      referenceCode: 'LGS-IGR-1002',
      operatorName: 'Chinedu Okafor',
      identifier: 'KKE-884-IKJ',
      operatorType: 'Keke Napep (Tricycle)',
      zone: 'Ikeja / Oshodi',
      amount: 800,
      issuedAt: new Date(Date.now() - 28 * 3600 * 1000).toISOString(),
      expiresAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
      remittanceStatus: 'REMITTED_TO_IGR',
    },
  ],
  verificationLogs: [],
};

// Mongoose Schemas & Indexes (Active when MONGODB_URI is provided)
const rateSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  operatorType: { type: String, required: true },
  zone: { type: String, required: true },
  amount: { type: Number, required: true, min: 0 },
  durationHours: { type: Number, required: true, default: 24 },
});

const passSchema = new mongoose.Schema({
  referenceCode: { type: String, required: true, unique: true, index: true },
  operatorName: { type: String, required: true },
  identifier: { type: String, required: true, index: true },
  operatorType: { type: String, required: true, index: true },
  zone: { type: String, required: true, index: true },
  amount: { type: Number, required: true },
  issuedAt: { type: String, required: true },
  expiresAt: { type: String, required: true, index: true },
  remittanceStatus: { type: String, default: 'REMITTED_TO_IGR' },
});

const verificationLogSchema = new mongoose.Schema({
  logId: { type: String, required: true, unique: true },
  query: { type: String, required: true },
  officerName: { type: String, required: true },
  outcome: { type: String, required: true },
  checkedAt: { type: String, required: true },
});

const RateModel = mongoose.models.Rate || mongoose.model('Rate', rateSchema);
const PassModel = mongoose.models.Pass || mongoose.model('Pass', passSchema);
const VerificationLogModel =
  mongoose.models.VerificationLog || mongoose.model('VerificationLog', verificationLogSchema);

let useMongo = false;

async function initDB() {
  const uri = process.env.MONGODB_URI;
  if (uri && uri.trim()) {
    await mongoose.connect(uri.trim());
    useMongo = true;
    const rateCount = await RateModel.countDocuments();
    if (rateCount === 0) {
      await RateModel.insertMany(defaultSeed.rates);
      await PassModel.insertMany(defaultSeed.passes);
    }
    console.log('Connected to MongoDB persistence layer');
    return;
  }

  // Local file fallback
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify(defaultSeed, null, 2));
  }
  console.log('Using local JSON persistence fallback (set MONGODB_URI for cloud MongoDB)');
}

function readLocal() {
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify(defaultSeed, null, 2));
  }
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
}

function writeLocal(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

const repo = {
  isMongo: () => useMongo,

  async getRates() {
    if (useMongo) return RateModel.find({}, { _id: 0, __v: 0 }).lean();
    return readLocal().rates;
  },

  async updateRate(id, updates) {
    if (useMongo) {
      return RateModel.findOneAndUpdate({ id }, { $set: updates }, { new: true, projection: { _id: 0, __v: 0 } }).lean();
    }
    const store = readLocal();
    const rate = store.rates.find((r) => r.id === id);
    if (!rate) return null;
    Object.assign(rate, updates);
    writeLocal(store);
    return rate;
  },

  async getAllPasses() {
    if (useMongo) return PassModel.find({}, { _id: 0, __v: 0 }).sort({ issuedAt: -1 }).lean();
    return readLocal().passes;
  },

  async createPass(passObj) {
    if (useMongo) {
      await PassModel.create(passObj);
      return passObj;
    }
    const store = readLocal();
    store.passes.unshift(passObj);
    writeLocal(store);
    return passObj;
  },

  async updatePassByRef(referenceCode, updates) {
    if (useMongo) {
      return PassModel.findOneAndUpdate(
        { referenceCode: new RegExp(`^${referenceCode}$`, 'i') },
        { $set: updates },
        { new: true, projection: { _id: 0, __v: 0 } }
      ).lean();
    }
    const store = readLocal();
    const idx = store.passes.findIndex((p) => p.referenceCode.toLowerCase() === referenceCode.toLowerCase());
    if (idx === -1) return null;
    store.passes[idx] = { ...store.passes[idx], ...updates };
    writeLocal(store);
    return store.passes[idx];
  },

  async addVerificationLog(entry) {
    if (useMongo) {
      await VerificationLogModel.create(entry);
      return VerificationLogModel.find({}, { _id: 0, __v: 0 }).sort({ checkedAt: -1 }).limit(10).lean();
    }
    const store = readLocal();
    store.verificationLogs.unshift(entry);
    writeLocal(store);
    return store.verificationLogs.slice(0, 10);
  },

  async getRecentLogs() {
    if (useMongo) return VerificationLogModel.find({}, { _id: 0, __v: 0 }).sort({ checkedAt: -1 }).limit(10).lean();
    return readLocal().verificationLogs.slice(0, 10);
  },
};

module.exports = { initDB, repo };