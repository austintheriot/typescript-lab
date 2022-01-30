import { Test } from 'ts-toolbelt';
import { Dec } from '../math/Dec';
import { Inc } from '../math/Inc';
import { DecAtIndex } from '../memory/DecAtIndex';
import { IncAtIndex } from '../memory/IncAtIndex';
const { checks, check } = Test;

interface ProgramState {
  heap: unknown[],
  pointer: unknown,
  source: unknown,
}

export type Brainflakes<State extends ProgramState> = State['source'] extends `${infer Ch}${infer Rest}`
  ? (
    // pointer increment >
    Ch extends '>'
    ? Brainflakes<{
      heap: State['heap'],
      pointer: Inc<State['pointer']>,
      source: Rest
    }>

    // pointer decrement <
    : Ch extends '<'
    ? Brainflakes<{
      heap: State['heap'],
      pointer: Dec<State['pointer']>,
      source: Rest
    }>

    // increment at pointer +
    : Ch extends '+'
    ? Brainflakes<{
      heap: IncAtIndex<State['heap'], State['pointer']>,
      pointer: State['pointer'],
      source: Rest
    }>

    // decrement at pointer -
    : Ch extends '-'
    ? Brainflakes<{
      heap: DecAtIndex<State['heap'], State['pointer']>,
      pointer: State['pointer'],
      source: Rest
    }>

    // non-legal character: nop
    : Brainflakes<{
      heap: State['heap'],
      pointer: State['pointer'],
      source: Rest
    }>
  )
  // no more source code left: return state
  : State;

checks([
  // pointer increment >
  check<Brainflakes<{
    heap: [0, 0, 0, 0, 0],
    pointer: 0,
    source: '>',
  }>, {
    heap: [0, 0, 0, 0, 0],
    pointer: 1,
    source: "",
  }, Test.Pass>(),

  // pointer decrement <
  check<Brainflakes<{
    heap: [0, 0, 0, 0, 0],
    pointer: 1,
    source: '<',
  }>, {
    heap: [0, 0, 0, 0, 0],
    pointer: 0,
    source: "",
  }, Test.Pass>(),

  // increment at index +
  check<Brainflakes<{
    heap: [0, 0, 0, 0, 0],
    pointer: 1,
    source: '+',
  }>, {
    heap: [0, 1, 0, 0, 0],
    pointer: 1,
    source: "",
  }, Test.Pass>(),

  // decrement at index -
  check<Brainflakes<{
    heap: [0, 1, 0, 0, 0],
    pointer: 1,
    source: '-',
  }>, {
    heap: [0, 0, 0, 0, 0],
    pointer: 1,
    source: "",
  }, Test.Pass>(),


  // unrecognized characters
  check<Brainflakes<{
    heap: [0, 1, 2, 3, 4],
    pointer: 1,
    source: ' ',
  }>, {
    heap: [0, 1, 2, 3, 4],
    pointer: 1,
    source: "",
  }, Test.Pass>(),

  check<Brainflakes<{
    heap: [0, 1, 2, 3, 4],
    pointer: 1,
    source: '\n',
  }>, {
    heap: [0, 1, 2, 3, 4],
    pointer: 1,
    source: "",
  }, Test.Pass>(),
]);
