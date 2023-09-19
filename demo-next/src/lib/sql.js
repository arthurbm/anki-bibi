import initSqlJs from "sql.js";

let config = {
  locateFile: (filename) => `https://sql.js.org/dist/${filename}`
};

initSqlJs(config).then((sql) => {
  window.SQL = sql; 
  // Dispatch a custom event after SQL is set
  document.dispatchEvent(new Event('sql-ready'));
});
