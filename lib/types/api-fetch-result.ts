export type ApiFetchResult<TData> =
  | { isSucceeded: true; data: TData }
  | { isSucceeded: false; errorMessage: string }
