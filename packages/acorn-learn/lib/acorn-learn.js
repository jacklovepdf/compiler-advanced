'use strict';
let acorn = require("acorn");
module.exports = acornLearn;

function acornLearn() {
    debugger
    let ast = acorn.parse("11 + 12;", {ecmaVersion: 2020});
    console.log('ast====>', ast);
}

acornLearn();
