export default {
  port: parseInt(process.env.PORT || '3333', 10),

  pgConnString: process.env.PG_CONN_STRING || '',

  firebaseDatabaseUrl: process.env.FIREBASE_DATABASE_URL || '',
};
