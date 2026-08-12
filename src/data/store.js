const memoryStore = require('./todos');
const pgStore = require('./pg');

const usePostgres = Boolean(process.env.DATABASE_URL);

module.exports = usePostgres ? pgStore : memoryStore;