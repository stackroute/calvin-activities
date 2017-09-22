const xlsx = require('xlsx');

const data = xlsx.readFile('TimeTracker.xlsx', {});

console.log(data);