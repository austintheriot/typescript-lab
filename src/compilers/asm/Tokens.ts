// VALID TOKENS
/** Add last 2 elements on the stack together */
export type ADD = 'add';
/** Subtract last element on the stack from the second to last element */
export type SUB = 'sub';
/** Print out the last element on the stack to output */
export type PRINT = 'print';
/** Drop the last element on the stack */
export type DROP = 'drop';
/** Duplicate the last element on the stack */
export type DUP = 'dup';
export type COMMENT_START = "/*";
export type COMMENT_END = "*/";
/** Executes the following code block if the last element on the stack is not 0 
 * After executing the block, returns to the beginning of the loop and performs the check again */
export type WHILE_START = 'while_start';
export type WHILE_END = 'while_end';
/** Executes the following code block if the last element on the stack is not 0 */
export type IF_START = 'if_start';
export type IF_END = 'if_end';
export type VALID_TOKENS = ADD | SUB | PRINT | DROP | DUP | COMMENT_START | COMMENT_END | number | WHILE_START | WHILE_END | IF_START | IF_END;

// IGNORED TOKENS (all others are considered errors)
export type SPACE = " ";
export type NEWLINE = "\n";
export type IGNORED_TOKENS = SPACE | NEWLINE;
