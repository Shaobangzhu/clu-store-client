import { useEffect, type Dispatch, type Reducer } from "react";
import useLocalStorage from "./useLocalStorage";
import { useImmerReducer, type ImmerReducer } from "use-immer";

// S for State, A for Action
const usePersistedReducer = <S, A>(
  reducer: ImmerReducer<S, A>,
  key: string,
  initialState: S,
): [S, Dispatch<A>] => {
  // 1. 先从 localStorage 读状态
  const [persistedState, setPersistedState] = useLocalStorage<S>(
    key,
    initialState,
  );

  // 2. 把 reducer 和持久化状态结合
  const [state, dispatch] = useImmerReducer(reducer, persistedState);

  // 3. 状态变化时, 自动同步到 localStorage
  useEffect(() => {
    setPersistedState(state);
  }, [state, setPersistedState]);

  return [state, dispatch] as const;
};

export default usePersistedReducer;
