'use strict';
const { tokenizer } = require('./tokenize');
module.exports = compilerCore;

function compilerCore() {
    debugger;
    const tokens_1_raw = 'age >= 45';
    const tokens_1 = tokenizer(tokens_1_raw, {});
    console.log(`tokens_1(${tokens_1_raw}): \n`, tokens_1);
    console.log('\n\n');

    const tokens_2_raw = 'int age = 40;';
    const tokens_2 = tokenizer(tokens_2_raw, {});
    console.log(`tokens_2(${tokens_2_raw}): \n`, tokens_2);

    const tokens_3_raw = '2+ 3*5';
    const tokens_3 = tokenizer(tokens_3_raw, {});
    console.log(`tokens_3(${tokens_3_raw}): \n`, tokens_3);
}

compilerCore();