import { Test } from 'ts-toolbelt';
import { Dec } from '../math/Dec';
import { Inc } from '../math/Inc';
import { DecAtIndex } from '../memory/DecAtIndex';
import { IncAtIndex } from '../memory/IncAtIndex';
import { Write } from '../memory/Write';
const { checks, check } = Test;

interface ProgramState {
  /** Linear heap memory */
  heap: number[],
  /** Pointer to index in the heap's linear memory: number */
  heapPointer: number,
  /** Program source code: string */
  source: string,
  /** Array of input values to read from */
  input: number[],
  /** Pointer to array of input values */
  inputPointer: number,
  /** Output value from program */
  output: string,
  /** Saves initial program while completing while loop */
  savedSource: string
}

export type Brainflakes<State extends ProgramState> =
  State['source'] extends ""
  ? State

  // pointer increment >
  : State['source'] extends `>${infer Rest}`
  ? Brainflakes<{
    heap: State['heap'],
    heapPointer: Inc<State['heapPointer']>,
    source: Rest,
    input: State['input'],
    inputPointer: State['inputPointer'],
    output: State['output'],
    savedSource: State['savedSource'],
  }>

  // pointer decrement <
  : State['source'] extends `<${infer Rest}`
  ? Brainflakes<{
    heap: State['heap'],
    heapPointer: Dec<State['heapPointer']>,
    source: Rest,
    input: State['input'],
    inputPointer: State['inputPointer'],
    output: State['output'],
    savedSource: State['savedSource'],
  }>

  // increment at pointer +
  : State['source'] extends `+${infer Rest}`
  ? Brainflakes<{
    heap: IncAtIndex<State['heap'], State['heapPointer']>,
    heapPointer: State['heapPointer'],
    source: Rest,
    input: State['input'],
    inputPointer: State['inputPointer'],
    output: State['output'],
    savedSource: State['savedSource'],
  }>

  // decrement at pointer -
  : State['source'] extends `-${infer Rest}`
  ? Brainflakes<{
    heap: DecAtIndex<State['heap'], State['heapPointer']>,
    heapPointer: State['heapPointer'],
    source: Rest,
    input: State['input'],
    inputPointer: State['inputPointer'],
    output: State['output'],
    savedSource: State['savedSource'],
  }>

  // output character at pointer .
  : State['source'] extends `.${infer Rest}`
  ? Brainflakes<{
    heap: State['heap'],
    heapPointer: State['heapPointer'],
    source: Rest,
    input: State['input'],
    inputPointer: State['inputPointer'],
    output: `${State['output']}${State['heap'][State['heapPointer']]}`
    savedSource: State['savedSource'],
  }>

  // input character at pointer ,
  : State['source'] extends `,${infer Rest}`
  ? Brainflakes<{
    heap: Write<State['heap'], State['heapPointer'], State['input'][State['inputPointer']]>,
    heapPointer: State['heapPointer'],
    source: Rest,
    input: State['input'],
    inputPointer: Inc<State['inputPointer']>,
    output: State['output'],
    savedSource: State['savedSource'],
  }>

  // while loop (start)
  : State['source'] extends `[${infer Subroutine}]${infer Rest}`
  // value is zero, ignore while loop
  ? (State['heap'][State['heapPointer']] extends 0
    ? Brainflakes<{
      heap: State['heap'],
      heapPointer: State['heapPointer'],
      input: State['input'],
      inputPointer: State['inputPointer'],
      output: State['output'],
      source: Rest,
      savedSource: State['savedSource'],
    }>

    // value is not zero, perform subroutine and save original source for later
    : Brainflakes<{
      heap: State['heap'],
      heapPointer: State['heapPointer'],
      input: State['input'],
      inputPointer: State['inputPointer'],
      output: State['output'],
      source: `${Subroutine}]${Rest}`,
      savedSource: State['source'],
    }>
  )

  // while loop (end)
  : State['source'] extends `]${infer _Rest}`
  ? Brainflakes<{
    heap: State['heap'],
    heapPointer: State['heapPointer'],
    source: State['savedSource'],
    input: State['input'],
    inputPointer: State['inputPointer'],
    output: State['output'],
    savedSource: "",
  }>

  // non-legal character: ignore
  : State['source'] extends `${infer _Ch}${infer Rest}`
  ? Brainflakes<{
    heap: State['heap'],
    heapPointer: State['heapPointer'],
    source: Rest,
    input: State['input'],
    inputPointer: State['inputPointer'],
    output: State['output'],
    savedSource: State['savedSource'],
  }>

  // unreachable case
  : never;


checks([
  // pointer increment >
  check<Brainflakes<{
    heap: [0, 0, 0, 0, 0],
    heapPointer: 0,
    source: '>',
    input: [],
    inputPointer: 0,
    output: "",
    savedSource: "",
  }>, {
    heap: [0, 0, 0, 0, 0],
    heapPointer: 1,
    source: "",
    input: [],
    inputPointer: 0,
    output: "",
    savedSource: "",
  }, Test.Pass>(),

  // pointer decrement <
  check<Brainflakes<{
    heap: [0, 0, 0, 0, 0],
    heapPointer: 1,
    source: '<',
    input: [],
    inputPointer: 0,
    output: "",
    savedSource: "",
  }>, {
    heap: [0, 0, 0, 0, 0],
    heapPointer: 0,
    source: "",
    input: [],
    inputPointer: 0,
    output: "",
    savedSource: "",
  }, Test.Pass>(),

  // increment at index +
  check<Brainflakes<{
    heap: [0, 0, 0, 0, 0],
    heapPointer: 1,
    source: '+',
    input: [],
    inputPointer: 0,
    output: "",
    savedSource: "",
  }>, {
    heap: [0, 1, 0, 0, 0],
    heapPointer: 1,
    source: "",
    input: [],
    inputPointer: 0,
    output: "",
    savedSource: "",
  }, Test.Pass>(),

  // decrement at index -
  check<Brainflakes<{
    heap: [0, 1, 0, 0, 0],
    heapPointer: 1,
    source: '-',
    input: [],
    inputPointer: 0,
    output: "",
    savedSource: "",
  }>, {
    heap: [0, 0, 0, 0, 0],
    heapPointer: 1,
    source: "",
    input: [],
    inputPointer: 0,
    output: "",
    savedSource: "",
  }, Test.Pass>(),

  // output character at pointer .
  check<Brainflakes<{
    heap: [0, 1, 2, 3, 4],
    heapPointer: 2,
    source: '.',
    input: [],
    inputPointer: 0,
    output: "",
    savedSource: "",
  }>, {
    heap: [0, 1, 2, 3, 4],
    heapPointer: 2,
    source: "",
    input: [],
    inputPointer: 0,
    output: "2",
    savedSource: "",
  }, Test.Pass>(),

  // input character at pointer ,
  check<Brainflakes<{
    heap: [0, 1, 2, 3, 4],
    heapPointer: 2,
    source: ',',
    input: [47],
    inputPointer: 0,
    output: "",
    savedSource: "",
  }>, {
    heap: [0, 1, 47, 3, 4],
    heapPointer: 2,
    source: "",
    input: [47],
    inputPointer: 1,
    output: "",
    savedSource: "",
  }, Test.Pass>(),

  // while loop (ignored inner block)
  check<Brainflakes<{
    heap: [2, 0, 0, 0, 0],
    heapPointer: 0,
    source: '--[+++]',
    input: [],
    inputPointer: 0,
    output: "",
    savedSource: "",
  }>, {
    heap: [0, 0, 0, 0, 0],
    heapPointer: 0,
    source: "",
    input: [],
    inputPointer: 0,
    output: "",
    savedSource: "",
  }, Test.Pass>(),

  // while loop (increment the element to the right by 2 twice)
  check<Brainflakes<{
    heap: [2, 1, 0, 0, 0],
    heapPointer: 0,
    source: '[>++<-]',
    input: [],
    inputPointer: 0,
    output: "",
    savedSource: "",
  }>, {
    heap: [0, 5, 0, 0, 0],
    heapPointer: 0,
    source: "",
    input: [],
    inputPointer: 0,
    output: "",
    savedSource: "",
  }, Test.Pass>(),

  // while loop (swap 2 numbers)
  check<Brainflakes<{
    heap: [5, 0, 0],
    heapPointer: 0,
    source: '[>>+<<-]',
    input: [],
    inputPointer: 0,
    output: "",
    savedSource: "",
  }>, {
    heap: [0, 0, 5],
    heapPointer: 0,
    source: "",
    input: [],
    inputPointer: 0,
    output: "",
    savedSource: "",
  }, Test.Pass>(),

  // while loop with instructions afterward
  check<Brainflakes<{
    heap: [1, 2, 3, 4, 5],
    heapPointer: 0,
    source: '[>+<-]+++',
    input: [],
    inputPointer: 0,
    output: "",
    savedSource: "",
  }>, {
    heap: [3, 3, 3, 4, 5],
    heapPointer: 0,
    source: "",
    input: [],
    inputPointer: 0,
    output: "",
    savedSource: "",
  }, Test.Pass>(),

  // unrecognized characters
  check<Brainflakes<{
    heap: [0, 1, 2, 3, 4],
    heapPointer: 1,
    source: ' ',
    input: [],
    inputPointer: 0,
    output: "",
    savedSource: "",
  }>, {
    heap: [0, 1, 2, 3, 4],
    heapPointer: 1,
    source: "",
    input: [],
    inputPointer: 0,
    output: "",
    savedSource: "",
  }, Test.Pass>(),

  check<Brainflakes<{
    heap: [0, 1, 2, 3, 4],
    heapPointer: 1,
    source: '\n',
    input: [],
    inputPointer: 0,
    output: "",
    savedSource: "",
  }>, {
    heap: [0, 1, 2, 3, 4],
    heapPointer: 1,
    source: "",
    input: [],
    inputPointer: 0,
    output: "",
    savedSource: "",
  }, Test.Pass>(),
]);
