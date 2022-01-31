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
}

export type Brainflakes<State extends ProgramState> =
  // no more source code left, return state
  State['source'] extends ""
  ? State
  
  // while loop (nop for now)
  : State['source'] extends `[${infer Subroutine}]${infer Rest}`
  ? Brainflakes<{
    heap: State['heap'],
    heapPointer: State['heapPointer'],
    source: Rest,
    input: [],
    inputPointer: 0,
    output: "",
  }>

  // pointer increment >
  : State['source'] extends `>${infer Rest}`
  ? Brainflakes<{
    heap: State['heap'],
    heapPointer: Inc<State['heapPointer']>,
    source: Rest,
    input: State['input'],
    inputPointer: State['inputPointer'],
    output: State['output'],
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
  }>

  : State['source'] extends `${infer _Ch}${infer Rest}`
  // non-legal character: nop
  ? Brainflakes<{
    heap: State['heap'],
    heapPointer: State['heapPointer'],
    source: Rest,
    input: State['input'],
    inputPointer: State['inputPointer'],
    output: State['output'],
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
  }>, {
    heap: [0, 0, 0, 0, 0],
    heapPointer: 1,
    source: "",
    input: [],
    inputPointer: 0,
    output: "",
  }, Test.Pass>(),

  // pointer decrement <
  check<Brainflakes<{
    heap: [0, 0, 0, 0, 0],
    heapPointer: 1,
    source: '<',
    input: [],
    inputPointer: 0,
    output: "",
  }>, {
    heap: [0, 0, 0, 0, 0],
    heapPointer: 0,
    source: "",
    input: [],
    inputPointer: 0,
    output: "",
  }, Test.Pass>(),

  // increment at index +
  check<Brainflakes<{
    heap: [0, 0, 0, 0, 0],
    heapPointer: 1,
    source: '+',
    input: [],
    inputPointer: 0,
    output: "",
  }>, {
    heap: [0, 1, 0, 0, 0],
    heapPointer: 1,
    source: "",
    input: [],
    inputPointer: 0,
    output: "",
  }, Test.Pass>(),

  // decrement at index -
  check<Brainflakes<{
    heap: [0, 1, 0, 0, 0],
    heapPointer: 1,
    source: '-',
    input: [],
    inputPointer: 0,
    output: "",
  }>, {
    heap: [0, 0, 0, 0, 0],
    heapPointer: 1,
    source: "",
    input: [],
    inputPointer: 0,
    output: "",
    }, Test.Pass>(),
  
  // output character at pointer .
  check<Brainflakes<{
    heap: [0, 1, 2, 3, 4],
    heapPointer: 2,
    source: '.',
    input: [],
    inputPointer: 0,
    output: "",
  }>, {
    heap: [0, 1, 2, 3, 4],
    heapPointer: 2,
    source: "",
    input: [],
    inputPointer: 0,
    output: "2",
    }, Test.Pass>(),
  
  // input character at pointer ,
  check<Brainflakes<{
    heap: [0, 1, 2, 3, 4],
    heapPointer: 2,
    source: ',',
    input: [47],
    inputPointer: 0,
    output: "",
  }>, {
    heap: [0, 1, 47, 3, 4],
    heapPointer: 2,
    source: "",
    input: [47],
    inputPointer: 1,
    output: "",
  }, Test.Pass>(),

  // while loop (nop for now) -- just consume source code
  check<Brainflakes<{
    heap: [0, 1, 2, 3, 4],
    heapPointer: 1,
    source: '[+-<>]',
    input: [],
    inputPointer: 0,
    output: "",
  }>, {
    heap: [0, 1, 2, 3, 4],
    heapPointer: 1,
    source: "",
    input: [],
    inputPointer: 0,
    output: "",
  }, Test.Pass>(),

  // while loop with instructions afterward
  check<Brainflakes<{
    heap: [0, 1, 2, 3, 4],
    heapPointer: 4,
    source: '[]+',
    input: [],
    inputPointer: 0,
    output: "",
  }>, {
    heap: [0, 1, 2, 3, 5],
    heapPointer: 4,
    source: "",
    input: [],
    inputPointer: 0,
    output: "",
  }, Test.Pass>(),

  // unrecognized characters
  check<Brainflakes<{
    heap: [0, 1, 2, 3, 4],
    heapPointer: 1,
    source: ' ',
    input: [],
    inputPointer: 0,
    output: "",
  }>, {
    heap: [0, 1, 2, 3, 4],
    heapPointer: 1,
    source: "",
    input: [],
    inputPointer: 0,
    output: "",
  }, Test.Pass>(),

  check<Brainflakes<{
    heap: [0, 1, 2, 3, 4],
    heapPointer: 1,
    source: '\n',
    input: [],
    inputPointer: 0,
    output: "",
  }>, {
    heap: [0, 1, 2, 3, 4],
    heapPointer: 1,
    source: "",
    input: [],
    inputPointer: 0,
    output: "",
  }, Test.Pass>(),
]);
