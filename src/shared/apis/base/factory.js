export const buildQuery = (queryKey, queryFn, options) => (Object.assign({ queryKey,
    queryFn }, (options !== null && options !== void 0 ? options : {})));
export const buildInfiniteQuery = (queryKey, queryFn, options) => (Object.assign({ queryKey,
    queryFn }, options));
export const buildMutation = (mutationFn, options) => (Object.assign({ mutationFn }, (options !== null && options !== void 0 ? options : {})));
