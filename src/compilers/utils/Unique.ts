declare const id: unique symbol;

export declare type Unique<Id extends string | number | symbol> = {
    [id]: Id;
};