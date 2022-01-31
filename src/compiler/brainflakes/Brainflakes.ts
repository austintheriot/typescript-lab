import { Dec } from '../math/Dec';
import { Inc } from '../math/Inc';
import { NewTuple } from '../math/NewTuple';
import { Write } from '../memory/Write';

export interface ProgramState {
  /** Linear heap memory */
  heap: number[],
  /** Pointer to index in the heap's linear memory: number */
  heapPointer: number,
  /** Pointer to array of input values */
  inputPointer: number,
  /** Output value from program */
  output: string,
  /** Saves initial program while completing while loop */
  savedSource: string
}

export type DefaultProgramState = {
  heap: NewTuple<100>,
  heapPointer: 0,
  inputPointer: 0,
  output: "",
  savedSource: "",
};

export type Brainflakes<Source extends string, Input extends number[] = [], State extends ProgramState = DefaultProgramState> =
  Source extends ""
  ? State

  // pointer increment >
  : Source extends `>${infer Rest}`
  ? Brainflakes<Rest, Input, {
    heap: State['heap'],
    heapPointer: Inc<State['heapPointer']>,
    inputPointer: State['inputPointer'],
    output: State['output'],
    savedSource: State['savedSource'],
  }>

  // pointer decrement <
  : Source extends `<${infer Rest}`
  ? Brainflakes<Rest, Input, {
    heap: State['heap'],
    heapPointer: Dec<State['heapPointer']>,
    inputPointer: State['inputPointer'],
    output: State['output'],
    savedSource: State['savedSource'],
  }>

  // increment at pointer +
  : Source extends `+${infer Rest}`
  ? Brainflakes<Rest, Input, {
    heap: Write<State['heap'], State['heapPointer'], Inc<State['heap'][State['heapPointer']]>>,
    heapPointer: State['heapPointer'],
    inputPointer: State['inputPointer'],
    output: State['output'],
    savedSource: State['savedSource'],
  }>

  // decrement at pointer -
  : Source extends `-${infer Rest}`
  ? Brainflakes<Rest, Input, {
    heap: Write<State['heap'], State['heapPointer'], Dec<State['heap'][State['heapPointer']]>>,
    heapPointer: State['heapPointer'],
    inputPointer: State['inputPointer'],
    output: State['output'],
    savedSource: State['savedSource'],
  }>

  // output character at pointer .
  : Source extends `.${infer Rest}`
  ? Brainflakes<Rest, Input, {
    heap: State['heap'],
    heapPointer: State['heapPointer'],
    inputPointer: State['inputPointer'],
    output: `${State['output']}${State['heap'][State['heapPointer']]}`
    savedSource: State['savedSource'],
  }>

  // input character at pointer ,
  : Source extends `,${infer Rest}`
  ? Brainflakes<Rest, Input, {
    heap: Write<State['heap'], State['heapPointer'], Input[State['inputPointer']]>,
    heapPointer: State['heapPointer'],
    inputPointer: Inc<State['inputPointer']>,
    output: State['output'],
    savedSource: State['savedSource'],
  }>

  // while loop (start)
  : Source extends `[${infer Subroutine}]${infer Rest}`
  // value is zero, ignore while loop
  ? (State['heap'][State['heapPointer']] extends 0
    ? Brainflakes<Rest, Input, {
      heap: State['heap'],
      heapPointer: State['heapPointer'],
      inputPointer: State['inputPointer'],
      output: State['output'],
      savedSource: State['savedSource'],
    }>

    // value is not zero, perform subroutine and save original source for later
    : Brainflakes<`${Subroutine}]${Rest}`, Input, {
      heap: State['heap'],
      heapPointer: State['heapPointer'],
      inputPointer: State['inputPointer'],
      output: State['output'],
      savedSource: Source,
    }>
  )

  // while loop (end)
  : Source extends `]${infer _Rest}`
  ? Brainflakes<State['savedSource'], Input, {
    heap: State['heap'],
    heapPointer: State['heapPointer'],
    inputPointer: State['inputPointer'],
    output: State['output'],
    savedSource: "",
  }>

  // non-legal character: ignore
  : Source extends `${infer _Ch}${infer Rest}`
  ? Brainflakes<Rest, Input, {
    heap: State['heap'],
    heapPointer: State['heapPointer'],
    inputPointer: State['inputPointer'],
    output: State['output'],
    savedSource: State['savedSource'],
  }>

  // unreachable case
  : never;


