
import { Test } from 'ts-toolbelt';
import { Tokenize } from './Tokenize';
import {
  ADD, DROP, DUP, EQ, GT, GTE, IF_END, IF_START, LT,
  LTE, NEQ, MULTI_LINE_COMMENT_END, MULTI_LINE_COMMENT_START, NUMBER_END, NUMBER_START,
  PRINT, READ, SINGLE_LINE_COMMENT_START, SUB, SWAP, WHILE_END, WHILE_START, WRITE
} from './Tokens';
const { checks, check } = Test;

checks([
  // ADD
  check<Tokenize<`${ADD} `>['state']['tokens'], [ADD], Test.Pass>(),

  // SUB
  check<Tokenize<`${SUB} `>['state']['tokens'], [SUB], Test.Pass>(),

  // DUP
  check<Tokenize<`${DUP} `>['state']['tokens'], [DUP], Test.Pass>(),

  // DROP
  check<Tokenize<`${DROP} `>['state']['tokens'], [DROP], Test.Pass>(),

  // PRINT
  check<Tokenize<`${PRINT} `>['state']['tokens'], [PRINT], Test.Pass>(),

  // IF_START
  check<Tokenize<`${IF_START} `>['state']['tokens'], [IF_START], Test.Pass>(),

  // IF_END
  check<Tokenize<`${IF_END} `>['state']['tokens'], [IF_END], Test.Pass>(),

  // WHILE_START
  check<Tokenize<`${WHILE_START} `>['state']['tokens'], [WHILE_START], Test.Pass>(),
  
  // GT
  check<Tokenize<`${GT} `>['state']['tokens'], [GT], Test.Pass>(),

  // GTE
  check<Tokenize<`${GTE} `>['state']['tokens'], [GTE], Test.Pass>(),

  // LT
  check<Tokenize<`${LT} `>['state']['tokens'], [LT], Test.Pass>(),

  // LTE
  check<Tokenize<`${LTE} `>['state']['tokens'], [LTE], Test.Pass>(),

  // EQ
  check<Tokenize<`${EQ} `>['state']['tokens'], [EQ], Test.Pass>(),

  // NEQ
  check<Tokenize<`${NEQ} `>['state']['tokens'], [NEQ], Test.Pass>(),

  // WHILE_END
  check<Tokenize<`${WHILE_END} `>['state']['tokens'], [WHILE_END], Test.Pass>(),

  // MULTI-LINE COMMENT
  check<Tokenize<`${MULTI_LINE_COMMENT_START} ${MULTI_LINE_COMMENT_END} ${ADD} `>['state']['tokens'], [ADD], Test.Pass>(),
  check<Tokenize<`${MULTI_LINE_COMMENT_START} ${ADD} ${MULTI_LINE_COMMENT_END} ${ADD} `>['state']['tokens'], [ADD], Test.Pass>(),
  check<Tokenize<`${MULTI_LINE_COMMENT_START} Hello! This is a comment block ${MULTI_LINE_COMMENT_END} ${ADD} `>['state']['tokens'], [ADD], Test.Pass>(),

  // SINGLE-LINE COMMENT
  check<Tokenize<`${SINGLE_LINE_COMMENT_START} this is a single comment`>['state']['tokens'], [], Test.Pass>(),
  check<Tokenize<`add ${SINGLE_LINE_COMMENT_START} this is a single comment`>['state']['tokens'], [ADD], Test.Pass>(),
  check<Tokenize<`add ${SINGLE_LINE_COMMENT_START} this is a comment
    sub ${SINGLE_LINE_COMMENT_START} this is ignored
    `>['state']['tokens'], [ADD, SUB], Test.Pass>(),

  // NUMBERS
  check<Tokenize<`${MULTI_LINE_COMMENT_START} ${MULTI_LINE_COMMENT_END} ${NUMBER_START}1${NUMBER_END} `>['state']['tokens'], [1], Test.Pass>(),
  check<Tokenize<`${MULTI_LINE_COMMENT_START} 1 ${MULTI_LINE_COMMENT_END} ${NUMBER_START}1${NUMBER_END} `>['state']['tokens'], [1], Test.Pass>(),
  check<Tokenize<`${MULTI_LINE_COMMENT_START} Hello! This is a comment block ${MULTI_LINE_COMMENT_END} ${NUMBER_START}1${NUMBER_END} `>['state']['tokens'], [1], Test.Pass>(),

  // WRITE
  check<Tokenize<`${WRITE} `>['state']['tokens'], [WRITE], Test.Pass>(),

  // READ
  check<Tokenize<`${READ} `>['state']['tokens'], [READ], Test.Pass>(),

  // SWAP
  check<Tokenize<`${SWAP} `>['state']['tokens'], [SWAP], Test.Pass>(),


  // COMBINATIONS OF TOKENS
  check<Tokenize<`
  ${MULTI_LINE_COMMENT_START} This is an example of a multiline comment block.
  It should be ignored by the tokenizer ${MULTI_LINE_COMMENT_END} 

  ${NUMBER_START}999${NUMBER_END} ${SINGLE_LINE_COMMENT_START} << to the left is a number (but this is a comment and is ignored)
  ${NUMBER_START}1${NUMBER_END}
  ${ADD}
  ${NUMBER_START}10${NUMBER_END}
  ${SUB}
  ${PRINT}

  ${MULTI_LINE_COMMENT_START} 
  
  Another comment block that is ignored 

  Weeeee! I can write anything I want to here.
  
  
  ${MULTI_LINE_COMMENT_END}

  ${NUMBER_START}500${NUMBER_END}
  ${DUP}
  ${DROP}
  ${NUMBER_START}1${NUMBER_END}
  ${IF_START}
  ${IF_END}
  ${NUMBER_START}1${NUMBER_END}
  ${WHILE_START}
  ${WHILE_END}
  

  ${SINGLE_LINE_COMMENT_START} more useless comments :)
  `>['state']['tokens'], [999, 1, ADD, 10, SUB, PRINT, 500, DUP, DROP, 1, IF_START, IF_END, 1, WHILE_START, WHILE_END], Test.Pass>(),

  // NON-VALID TOKENS (IGNORED)
  check<Tokenize<`
                  
 `>['state'], {
    tokens: [],
    error: "",
  }, Test.Pass>(),


  // NON-VALID TOKENS (ERRORS)
  check<Tokenize<`
    Example of illegal input
  `>['state']['tokens'], [], Test.Pass>(),
  check<Tokenize<`
    Example of illegal input
  `>['state']['error'], "", Test.Fail>(),
]);