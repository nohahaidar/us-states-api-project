const states = require('../models/statesData.json');
const stateCodes = states.map(state => state.code);

const verifyState = (req, res, next) => {
    const code = req.params.state?.toUpperCase();
    if (!stateCodes.includes(code)) {
        return res.status(400).json({ error: 'Invalid state abbreviation parameter' });
    }

    req.code = code; // store verified uppercase code
    next();
};

module.exports = verifyState;