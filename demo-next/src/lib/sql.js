import initSqlJs from "sql.js";

let config = {
  locateFile: (filename) => `https://sql.js.org/dist/${filename}`
};

console.log("Loading sql.js");

// This is the `sql.js` file compiled to WebAssembly
initSqlJs(config).then((sql) => {
  window.SQL = sql; 
  // Dispatch a custom event after SQL is set
  document.dispatchEvent(new Event('sql-ready'));
});
