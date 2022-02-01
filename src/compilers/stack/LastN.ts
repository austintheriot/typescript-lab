import { Test } from "ts-toolbelt";
import { Add } from "ts-toolbelt/out/Number/Add";
import { Sub } from "../math/Sub";
const { checks, check } = Test;

/** Returns the Nth-from-last element on the stack*/
export type LastN<Tuple extends T[], N extends number, T = any> = Tuple[Sub<Tuple['length'], Add<N, 1>>];


checks([
  check<LastN<[number, string, boolean], 0>, boolean, Test.Pass>(),
  check<LastN<[0, 1, 2], 1>, 1, Test.Pass>(),
  check<LastN<[number, string, boolean], 2>, number, Test.Pass>(),

  // out of range (undefined behavior) -- not checked in the interest of efficiency
  check<LastN<[number, string, boolean], 3>, number, Test.Pass>(),
]);
