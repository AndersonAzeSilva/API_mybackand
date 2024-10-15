const db = require('../config/database');

const Secretary = {
  async getAllSecretaries() {
    const [rows] = await db.query('SELECT * FROM secretaries');
    return rows;
  },

  async getAvailableTimes(secretaryId, date) {
    const [times] = await db.query(
      'SELECT start_time, end_time FROM available_times WHERE secretary_id = ? AND DATE(start_time) = ?',
      [secretaryId, date]
    );
    return times;
  },

  async createSchedule(secretary_id, start_time, end_time) {
    await db.query('INSERT INTO available_times (secretary_id, start_time, end_time) VALUES (?, ?, ?)', [secretary_id, start_time, end_time]);
  }
};

module.exports = Secretary;
