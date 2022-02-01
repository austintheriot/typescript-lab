import { IntegerMap } from '../math/IntegerMap';
import { ADD, COMMENT_END, COMMENT_START, DROP, DUP, IF_END, IF_START, NUMBER_END, NUMBER_START, PRINT, SEPARATION_TOKEN, SUB, VALID_TOKENS, WHILE_END, WHILE_START } from './Tokens';

interface TokenizerState {
  tokens: VALID_TOKENS[],
  error: string,
}

type TokenizerDefaultState = {
  tokens: [],
  error: "",
};

type Dump<Source extends string, State extends TokenizerState> = {
  source: Source,
  state: State,
};


/** Translated Tokens directly into a callable call tokens */
export type Tokenizer<Source extends string, State extends TokenizerState = TokenizerDefaultState> =
  // no more tokens left to parse
  Source extends ""
  ? Dump<Source, State>

  // ADD
  : Source extends `${ADD}${infer Rest}`
  ? Tokenizer<Rest, {
    error: State['error'],
    tokens: [...State['tokens'], ADD],
  }>

  // SUB
  : Source extends `${SUB}${infer Rest}`
  ? Tokenizer<Rest, {
    error: State['error'],
    tokens: [...State['tokens'], SUB],
  }>

  // PRINT
  : Source extends `${PRINT}${infer Rest}`
  ? Tokenizer<Rest, {
    error: State['error'],
    tokens: [...State['tokens'], PRINT],
  }>

  // DROP
  : Source extends `${DROP}${infer Rest}`
  ? Tokenizer<Rest, {
    error: State['error'],
    tokens: [...State['tokens'], DROP],
  }>
  
  // WHILE_START
  : Source extends `${WHILE_START}${infer Rest}`
  ? Tokenizer<Rest, {
    error: State['error'],
    tokens: [...State['tokens'], WHILE_START],
  }>

  // WHILE_END
  : Source extends `${WHILE_END}${infer Rest}`
  ? Tokenizer<Rest, {
    error: State['error'],
    tokens: [...State['tokens'], WHILE_END],
  }>

  // IF_START
  : Source extends `${IF_START}${infer Rest}`
  ? Tokenizer<Rest, {
    error: State['error'],
    tokens: [...State['tokens'], IF_START],
  }>

  // IF_END
  : Source extends `${IF_END}${infer Rest}`
  ? Tokenizer<Rest, {
    error: State['error'],
    tokens: [...State['tokens'], IF_END],
  }>

  // DUP
  : Source extends `${DUP}${infer Rest}`
  ? Tokenizer<Rest, {
    error: State['error'],
    tokens: [...State['tokens'], DUP],
  }>

  // COMMENT: ignore comment
  : Source extends `${COMMENT_START}${infer _COMMENT_BLOCK}${COMMENT_END}${infer Rest}`
  ? Tokenizer<Rest, {
    error: State['error'],
    tokens: State['tokens'],
  }>

  // NUMBER: ignore comment
  : Source extends `${NUMBER_START}${infer NumberString}${NUMBER_END}${infer Rest}`
  ? (NumberString extends keyof IntegerMap
    ? Tokenizer<Rest, {
      error: State['error'],
      tokens: [...State['tokens'], IntegerMap[NumberString]],
    }>
    : Tokenizer<Rest, {
      error: `${State['error']} Error: number ${NUMBER_START}${NumberString}${NUMBER_END} was not able to be parsed`,
      tokens: State['tokens'],
    }>
  )

  : Source extends `${infer OtherToken}${infer Rest}`
  ? (
    // IGNORED TOKENS
    OtherToken extends SEPARATION_TOKEN
    ? Tokenizer<Rest, {
      error: State['error'],
      tokens: State['tokens'],
    }>

    // ILLEGAL TOKENS
    : Dump<Source, {
      error: `${State['error']}
      Error: illegal character found: ${OtherToken}`,
      tokens: State['tokens'],
    }>
  )

  // dump current state for debugging purposes
  : Dump<Source, State>;