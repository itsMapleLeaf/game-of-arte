export type NonEmptyArray<T> = [T, ...T[]]

export type Falsy = false | 0 | "" | null | undefined

export type Spread<A extends object, B extends object> = Omit<A, keyof B> & B
