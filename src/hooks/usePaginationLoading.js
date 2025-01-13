import { useReducer, useMemo } from "react";

const initialState = {
  data: [],
  page: 1,
  loading: false,
  hasMore: true,
  error: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "LOAD_START":
      return { ...state, loading: true, error: null }; 
    case "LOAD_SUCCESS":
      return {
        ...state,
        data: [...state.data, ...action.payload.data],
        hasMore: action.payload.hasMore,
        loading: false,
      };
    case "LOAD_FAIL":
      return { ...state, loading: false, error: action.payload }; 
    case "INCREMENT_PAGE":
      return { ...state, page: state.page + 1 };
    case "RESET":
      return initialState;
    default:
      return state;
  }
};

const usePaginationLoading = (fetchFunction, initialPage = 1, itemsPerPage, dependencies = []) => {
  const [state, dispatch] = useReducer(reducer, { ...initialState, page: initialPage });

  const loadData = async () => {
    if (state.loading || !state.hasMore) return;
    dispatch({ type: "LOAD_START" });

    try {
      const newData = await fetchFunction(state.page, itemsPerPage);
      dispatch({
        type: "LOAD_SUCCESS",
        payload: { data: newData, hasMore: newData.length === itemsPerPage },
      });
    } catch (error) {
      dispatch({ type: "LOAD_FAIL", payload: error.message }); 
    }
  };

  const loadMore = () => {
    if (!state.loading && state.hasMore) {
      dispatch({ type: "INCREMENT_PAGE" });
    }
  };

  useMemo(() => {
    loadData();
  }, [state.page, ...dependencies]);

  return {
    data: state.data,
    loadMore,
    loading: state.loading,
    hasMore: state.hasMore,
    error: state.error, 
  };
};

export default usePaginationLoading;
