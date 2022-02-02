// VALID TOKENS

// ARITHMETIC INSTRUCTIONS:
/** Add last 2 elements on the stack together */
export type ADD = 'add';
/** Subtract last element on the stack from the second to last element */
export type SUB = 'sub';

// STACK INSTRUCTIONS:
/** Drop the last element on the stack */
export type DROP = 'drop';
/** Duplicate the last element on the stack */
export type DUP = 'dup';

// CONTROL FLOW INSTRUCTIONS:
/** Executes the following code block if the last element on the stack is not 0 
 * After executing the block, returns to the beginning of the loop and performs the check again */
 export type WHILE_START = 'while_start';
 export type WHILE_END = 'while_end';
 /** Executes the following code block if the last element on the stack is not 0 */
 export type IF_START = 'if_start';
export type IF_END = 'if_end';

// OTHER INSTRUCTIONS:
/** Print out the last element on the stack to output */
export type PRINT = 'print';

// PARSING TOKENS: 
export type MULTI_LINE_COMMENT_START = "/*";
export type MULTI_LINE_COMMENT_END = "*/";
export type NUMBER_START = "(";
export type NUMBER_END = ")";
export type SINGLE_LINE_COMMENT_START = "//"
export type SINGLE_LINE_COMMENT_END = NEWLINE;


// MEMORY INSTRUCTIONS:
/** Write to linear memory (n1: index, n2: value) */
export type WRITE = 'write';
/** Swap values of 2 indices in memory (n1: index, n2: index) */
export type SWAP = 'swap';
/** Read value from linear memory (n: index) and push it onto the stack */
export type READ = 'read';

export type VALID_TOKENS = ADD | SUB | PRINT | DROP | DUP | MULTI_LINE_COMMENT_START
  | MULTI_LINE_COMMENT_END | number | WHILE_START | WHILE_END | IF_START | IF_END | WRITE | SWAP | READ;

// SEPARATION TOKENS (all others are considered errors)
export type SPACE = " ";
export type NEWLINE = "\n";
export type SEPARATION_TOKEN = SPACE | NEWLINE;
