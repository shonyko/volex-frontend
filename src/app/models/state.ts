export type Error = {
  message: string;
};

export type Ok<V> = {
  val: V;
};

export type Err<E> = {
  err: E;
};

export type Result<V, E = Error> = {
  val?: V;
  err?: E;
};
