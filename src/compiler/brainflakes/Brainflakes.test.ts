import { Test } from 'ts-toolbelt';
import { Before } from '../memory/Before';
import { Brainflakes } from './Brainflakes';
const { checks, check } = Test;

// TEST BASIC INSTRUCTIONS /////////////////////////////////////////////////////////////////////
checks([
  // pointer increment >
  check<Brainflakes<'>', [], {
    heap: [0, 0, 0, 0, 0],
    heapPointer: 0,
    inputPointer: 0,
    output: "",
    savedSource: "",
  }>, {
    heap: [0, 0, 0, 0, 0],
    heapPointer: 1,
    inputPointer: 0,
    output: "",
    savedSource: "",
  }, Test.Pass>(),

  // pointer decrement <
  check<Brainflakes<'<', [], {
    heap: [0, 0, 0, 0, 0],
    heapPointer: 1,
    inputPointer: 0,
    output: "",
    savedSource: "",
  }>, {
    heap: [0, 0, 0, 0, 0],
    heapPointer: 0,
    inputPointer: 0,
    output: "",
    savedSource: "",
  }, Test.Pass>(),

  // increment at index +
  check<Brainflakes<'+', [], {
    heap: [0, 0, 0, 0, 0],
    heapPointer: 1,
    inputPointer: 0,
    output: "",
    savedSource: "",
  }>, {
    heap: [0, 1, 0, 0, 0],
    heapPointer: 1,
    inputPointer: 0,
    output: "",
    savedSource: "",
  }, Test.Pass>(),

  // decrement at index -
  check<Brainflakes<'-', [],  {
    heap: [0, 1, 0, 0, 0],
    heapPointer: 1,
    inputPointer: 0,
    output: "",
    savedSource: "",
  }>, {
    heap: [0, 0, 0, 0, 0],
    heapPointer: 1,
    inputPointer: 0,
    output: "",
    savedSource: "",
  }, Test.Pass>(),

  // output character at pointer .
  check<Brainflakes<'.', [], {
    heap: [0, 1, 2, 3, 4],
    heapPointer: 2,
    inputPointer: 0,
    output: "",
    savedSource: "",
  }>, {
    heap: [0, 1, 2, 3, 4],
    heapPointer: 2,
    inputPointer: 0,
    output: "2",
    savedSource: "",
  }, Test.Pass>(),

  // input character at pointer ,
  check<Brainflakes<',', [47], {
    heap: [0, 1, 2, 3, 4],
    heapPointer: 2,
    inputPointer: 0,
    output: "",
    savedSource: "",
  }>, {
    heap: [0, 1, 47, 3, 4],
    heapPointer: 2,
    inputPointer: 1,
    output: "",
    savedSource: "",
  }, Test.Pass>(),

  // while loop (ignored inner block)
  check<Brainflakes<'--[+++]', [], {
    heap: [2, 0, 0, 0, 0],
    heapPointer: 0,
    inputPointer: 0,
    output: "",
    savedSource: "",
  }>, {
    heap: [0, 0, 0, 0, 0],
    heapPointer: 0,
    inputPointer: 0,
    output: "",
    savedSource: "",
  }, Test.Pass>(),

  // while loop (increment the element to the right by 2 twice)
  check<Brainflakes<'[>++<-]', [], {
    heap: [2, 1, 0, 0, 0],
    heapPointer: 0,
    inputPointer: 0,
    output: "",
    savedSource: "",
  }>, {
    heap: [0, 5, 0, 0, 0],
    heapPointer: 0,
    inputPointer: 0,
    output: "",
    savedSource: "",
  }, Test.Pass>(),

  // while loop (swap 2 numbers)
  check<Brainflakes<'[>>+<<-]', [], {
    heap: [5, 0, 0],
    heapPointer: 0,
    inputPointer: 0,
    output: "",
    savedSource: "",
  }>, {
    heap: [0, 0, 5],
    heapPointer: 0,
    inputPointer: 0,
    output: "",
    savedSource: "",
  }, Test.Pass>(),

  // while loop with instructions afterward
  check<Brainflakes<'[>+<-]+++', [], {
    heap: [1, 2, 3, 4, 5],
    heapPointer: 0,
    inputPointer: 0,
    output: "",
    savedSource: "",
  }>, {
    heap: [3, 3, 3, 4, 5],
    heapPointer: 0,
    inputPointer: 0,
    output: "",
    savedSource: "",
  }, Test.Pass>(),

  // unrecognized characters
  check<Brainflakes<' ', [], {
    heap: [0, 1, 2, 3, 4],
    heapPointer: 1,
    inputPointer: 0,
    output: "",
    savedSource: "",
  }>, {
    heap: [0, 1, 2, 3, 4],
    heapPointer: 1,
    inputPointer: 0,
    output: "",
    savedSource: "",
  }, Test.Pass>(),

  check<Brainflakes<'\n', [], {
    heap: [0, 1, 2, 3, 4],
    heapPointer: 1,
    inputPointer: 0,
    output: "",
    savedSource: "",
  }>, {
    heap: [0, 1, 2, 3, 4],
    heapPointer: 1,
    inputPointer: 0,
    output: "",
    savedSource: "",
  }, Test.Pass>(),
]);


// TEST FULL PROGRAMS /////////////////////////////////////////////////////////////////////

// Add two cells together
type AddTwoCellsTogether = Brainflakes<`
  Example
  Starting cell is 1
  +
  Next cell is 42
  >,<
  Add them together
  [>+<-]
`, [42]>;
checks([
  check<AddTwoCellsTogether['heap'][1], 43, Test.Pass>(),
]);

// Copy/move value into two other cells (draining current cell in the process)
type CopyValueIntoTwoCells = Brainflakes<`
,
[>+>+<<-]
`, [100]>;
type CopyValueIntoTwoCellsSlice = Before<CopyValueIntoTwoCells['heap'], 5>
checks([
  check<CopyValueIntoTwoCellsSlice, [0, 100, 100, 0, 0], Test.Pass>(),
]);