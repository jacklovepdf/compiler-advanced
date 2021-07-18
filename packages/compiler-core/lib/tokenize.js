class Token {
    constructor(p) {
      this.type = p.type
      this.value = p.value
    }
}

const types = {
    Number: "Number",
    String: "String",
    Int: "Int",
    Identifier: "Identifier",
    GE: "GE",
    PlUS: "PlUS",
    MINUS: "MINUS",
    DIV: "DIV",
    MULTIPLY: "MULTIPLY",
    SemiColon: "SemiColon",
    Assignment: "Assignment",
    eof: "EOF",
}

const DfaState = {
    INIT: 1,
    NUM: 2,
    ID: 3,
    INT: 4,

    // 算术运算
    PlUS: 5,
    MINUS: 6,
    DIV: 7,
    MULTIPLY: 8,

    // 关系运算
    GT: 9,
    GE: 10,

    // 符号
    SemiColon: 11,
    LeftParen: 12,
    RightParen: 13,
    Assignment: 14,
}
const WHITESPACE = /\s/;
const NUMBERS = /[0-9]/;
const LETTERS = /[a-zA-Z]/i;

let tokens = [];
let tokenText = "";
let tokenType = null;


function tokenizer(input, opts={}) {

    // A `pos` variable for tracking our position in the code like a cursor.
    let pos = 0;

    let dfaState = DfaState.INIT;
    let currentStatus = null;
    const length = input.length;

    tokens = [];
    tokenText = "";
    tokenType = null;

    while (pos < length) {
  
      // We're also going to store the `pos` character in the `input`.
      let ch = input[pos];
      switch(dfaState){
          case DfaState.INIT:
              currentStatus = initToken(pos, input);
              dfaState = currentStatus.dfaState;
              pos = currentStatus.pos;
              break;
          case DfaState.NUM:
            if (NUMBERS.test(ch)) {
                pos += 1;
                tokenText += ch;
            } else {
                currentStatus = initToken(pos, input);
                dfaState = currentStatus.dfaState;
                pos = currentStatus.pos;
            }
            break;
          case DfaState.ID:
            if(NUMBERS.test(ch) || LETTERS.test(ch)){
                pos += 1;
                tokenText += ch;
            }else {
                currentStatus = initToken(pos, input);
                dfaState = currentStatus.dfaState;
                pos = currentStatus.pos;
            }
            break;
          case DfaState.INT: 
          case DfaState.PlUS:
          case DfaState.MINUS:
          case DfaState.DIV:
          case DfaState.MULTIPLY:
          case DfaState.GT:
          case DfaState.GE:
          case DfaState.LeftParen:
          case DfaState.SemiColon:
          case DfaState.RightParen:
          case DfaState.Assignment:
            currentStatus = initToken(pos, input);
            dfaState = currentStatus.dfaState;
            pos = currentStatus.pos;
            break;
          default:
              throw new Error(`I don't know what this character is: ${ch}`);
      }
    }
    if (tokenText.length > 0) {
        tokens.push(new Token({type: tokenType, value: tokenText}));
    }

    return tokens;
}

// 有限状态机进入初时状态，每次进入初时状态调用改函数;
// 初时状态包含两种状态，一种是开始解析源代码字符串流，另一种状态是解析完一个token之后；
// 保存上一次解析完的token；
// 初始状态其实并不做停留，它马上进入其他状态。
function initToken(pos, input){
    const ch = input[pos];
    const leftInput = input.slice(pos);
    // 生成token
    if (tokenText.length > 0 ) {
        tokens.push(new Token({type: tokenType, value: tokenText}));
        tokenText = '';
        tokenType = null;
    }
    let dfaState = DfaState.INIT;
    
    if(LETTERS.test(ch)){
        if(leftInput.startsWith('int') && WHITESPACE.test(leftInput[3])){
            dfaState = DfaState.INT;
            tokenText = 'int';
            tokenType =  types.Int;
            pos += 3;
        } else {
            dfaState = DfaState.ID;

            tokenType =  types.Identifier;
            tokenText += ch;
            pos += 1;
        }
    }else if(NUMBERS.test(ch)){
        dfaState = DfaState.NUM;

        tokenType = types.Number;
        tokenText += ch;
        pos += 1;
    }else if(ch === '>'){
        if(leftInput.startsWith('>=') && WHITESPACE.test(leftInput[2])){
            dfaState = DfaState.GE;
            tokenText = '>=';
            tokenType =  types.GE;
            pos += 2;
        }else{
            dfaState = DfaState.GT;
            tokenType =  types.GE;
            pos += 1;
        }
    }else if(ch === '+'){
        dfaState = DfaState.PlUS;

        tokenType = types.PlUS;
        tokenText += ch;
        pos += 1;
    }else if(ch === '-'){
        dfaState = DfaState.MINUS;

        tokenType = types.MINUS;
        tokenText += ch;
        pos += 1;
    }else if(ch === '*'){
        dfaState = DfaState.MULTIPLY;

        tokenType = types.MULTIPLY;
        tokenText += ch;
        pos += 1;
    }else if(ch === '/'){
        dfaState = DfaState.DIV;

        tokenType = types.DIV;
        tokenText += ch;
        pos += 1;
    }else if(ch === ';'){
        dfaState = DfaState.SemiColon;

        tokenType = types.SemiColon;
        tokenText += ch;
        pos += 1;
    }else if(ch === '('){
        dfaState = DfaState.LeftParen;

        tokenType = types.LeftParen;
        tokenText += ch;
        pos += 1;
    }else if(ch === ')'){
        dfaState = DfaState.RightParen;

        tokenType = types.RightParen;
        tokenText += ch;
        pos += 1;
    }else if(ch === '='){
        dfaState = DfaState.Assignment;

        tokenType = types.Assignment;
        tokenText += ch;
        pos += 1;
    }else{
        pos += 1;
    }

    return {dfaState, pos};

}

module.exports = {
    tokenizer
}