export interface SingleNegativeIntegersMap {
  '-1': -1,
  '-2': -2,
  '-3': -3,
  '-4': -4,
  '-5': -5,
  '-6': -6,
  '-7': -7,
  '-8': -8,
  '-9': -9
}

export interface SinglePositiveIntegersMap {
  '8': 8,
  '9': 9,
  '7': 7,
  '6': 6,
  '5': 5,
  '4': 4,
  '3': 3,
  '2': 2,
  '1': 1,
}

/**
 * Corresponds string version of integers to their number equivalents.
 */
export type AllSingleIntegersMap = SingleNegativeIntegersMap & { '0': 0 } & SinglePositiveIntegersMap;

export type AllSingleIntegers = ValueOf<AllSingleIntegersMap>;

export type ValueOf<T> = T[keyof T];