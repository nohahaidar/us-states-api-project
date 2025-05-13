const statesData = require('../models/statesData.json');
const State = require('../models/States'); // for funfacts from MongoDB

const getAllStates = async (req, res) => {
    let states = statesData;

    if (req.query?.contig === 'true') {
        states = states.filter(state => state.code !== 'AK' && state.code !== 'HI');
    } else if (req.query?.contig === 'false') {
        states = states.filter(state => state.code === 'AK' || state.code === 'HI');
    }

    const mongoFunFacts = await State.find();
    const statesWithFacts = states.map(state => {
        const match = mongoFunFacts.find(doc => doc.stateCode === state.code);
        return match ? { ...state, funfacts: match.funfacts } : state;
    });

    res.json(statesWithFacts);
};

const getState = async (req, res) => {
    const state = statesData.find(st => st.code === req.code);
    if (!state) return res.status(400).json({ error: 'Invalid state abbreviation parameter' });

    const mongoState = await State.findOne({ stateCode: req.code });
    if (mongoState) {
        return res.json({ ...state, funfacts: mongoState.funfacts });
    }

    res.json(state);
};

const getCapital = (req, res) => {
    const state = statesData.find(st => st.code === req.code);
    if (!state) return res.status(400).json({ error: 'Invalid state abbreviation parameter' });

    res.json({ state: state.state, capital: state.capital_city });
};

const getNickname = (req, res) => {
    const state = statesData.find(st => st.code === req.code);
    if (!state) return res.status(400).json({ error: 'Invalid state abbreviation parameter' });

    res.json({ state: state.state, nickname: state.nickname });
};

const getPopulation = (req, res) => {
    const state = statesData.find(st => st.code === req.code);
    if (!state) return res.status(400).json({ error: 'Invalid state abbreviation parameter' });

    res.json({ state: state.state, population: state.population.toLocaleString() });
};

const getAdmission = (req, res) => {
    const state = statesData.find(st => st.code === req.code);
    if (!state) return res.status(400).json({ error: 'Invalid state abbreviation parameter' });

    res.json({ state: state.state, admitted: state.admission_date });
};

const getRandomFunFact = async (req, res) => {
    const state = statesData.find(st => st.code === req.code);
    const mongoState = await State.findOne({ stateCode: req.code });

    if (!mongoState || !mongoState.funfacts || mongoState.funfacts.length === 0) {
        return res.status(404).json({ message: `No Fun Facts found for ${state.state}` });
    }

    const randomIndex = Math.floor(Math.random() * mongoState.funfacts.length);
    res.json({ funfact: mongoState.funfacts[randomIndex] });
};

const createFunFact = async (req, res) => {
    const funfacts = req.body.funfacts;

    if (!funfacts) {
        return res.status(400).json({ message: 'State fun facts value required' });
    }
    if (!Array.isArray(funfacts)) {
        return res.status(400).json({ message: 'State fun facts value must be an array' });
    }

    const stateCode = req.code;
    const state = await State.findOne({ stateCode }).exec();

    if (state) {
        state.funfacts.push(...funfacts);
        const result = await state.save();
        return res.json(result);
    } else {
        try {
            const result = await State.create({ stateCode, funfacts });
            return res.status(201).json(result);
        } catch (err) {
            return res.status(500).json({ message: err.message });
        }
    }
};

const updateFunFact = async (req, res) => {
    const { index, funfact } = req.body;

    if (index === undefined) {
        return res.status(400).json({ message: 'State fun fact index value required' });
    }
    if (!funfact) {
        return res.status(400).json({ message: 'State fun fact value required' });
    }

    const stateDoc = await State.findOne({ stateCode: req.code }).exec();
    const stateData = statesData.find(st => st.code === req.code);

    if (!stateDoc || !stateDoc.funfacts || stateDoc.funfacts.length === 0) {
        return res.status(404).json({ message: `No Fun Facts found for ${stateData.state}` });
    }

    const arrayIndex = index - 1;

    if (arrayIndex < 0 || arrayIndex >= stateDoc.funfacts.length) {
        return res.status(400).json({ message: `No Fun Fact found at that index for ${stateData.state}` });
    }

    stateDoc.funfacts[arrayIndex] = funfact;
    const result = await stateDoc.save();
    res.json(result);
};

const deleteFunFact = async (req, res) => {
    const { index } = req.body;

    if (index === undefined) {
        return res.status(400).json({ message: 'State fun fact index value required' });
    }

    const stateDoc = await State.findOne({ stateCode: req.code }).exec();
    const stateData = statesData.find(st => st.code === req.code);

    if (!stateDoc || !stateDoc.funfacts || stateDoc.funfacts.length === 0) {
        return res.status(404).json({ message: `No Fun Facts found for ${stateData.state}` });
    }

    const arrayIndex = index - 1;

    if (arrayIndex < 0 || arrayIndex >= stateDoc.funfacts.length) {
        return res.status(400).json({ message: `No Fun Fact found at that index for ${stateData.state}` });
    }

    stateDoc.funfacts.splice(arrayIndex, 1);
    const result = await stateDoc.save();
    res.json(result);
};

module.exports = {
    getAllStates,
    getState,
    getCapital,
    getNickname,
    getPopulation,
    getAdmission,
    getRandomFunFact,
    createFunFact,
    updateFunFact,
    deleteFunFact
};
