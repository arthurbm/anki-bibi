import initSqlJs from "sql.js";

initSqlJs().then((sql) => {
  window.SQL = sql; 
  // Dispatch a custom event after SQL is set
  document.dispatchEvent(new Event('sql-ready'));
});
