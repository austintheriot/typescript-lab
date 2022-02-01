import { ADD, COMMENT_END, COMMENT_START, IGNORED_TOKENS, VALID_TOKENS } from './Tokens';

interface TokenizerState {
  tokens: VALID_TOKENS[],
  error: string,
}

type TokenizerDefaultState = {
  tokens: [],
  error: "",
};

/** Translated Tokens directly into a callable call tokens */
export type Tokenizer<Source extends string, State extends TokenizerState = TokenizerDefaultState> =
  Source extends ""
  ? State

  // ADD
  : Source extends `${ADD}${infer Rest}`
  ? Tokenizer<Rest, {
    error: State['error'],
    tokens: [...State['tokens'], ADD],
  }>

  // COMMENT: ignore comment
  : Source extends `${COMMENT_START}${infer _COMMENT_BLOCK}${COMMENT_END}${infer Rest}`
  ? Tokenizer<Rest, {
    error: State['error'],
    tokens: State['tokens'],
  }>

  // NON-VALID TOKENS
  : Source extends `${infer Ch}${infer Rest}`
  ? (
    // character is a number
    Ch extends number
    ? Tokenizer<Rest, {
      error: State['error'],
      tokens: State['tokens'],
    }>

    // ignore and continue
    : Ch extends IGNORED_TOKENS
    ? Tokenizer<Rest, {
      error: State['error'],
      tokens: State['tokens'],
    }>

    //illegal token: halt and output error
    : {
      error: `${State['error']}
      Error: illegal character found: ${Ch}`,
      tokens: State['tokens'],
    }
  )

  : never;