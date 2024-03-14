import { useCallback, useEffect, useState } from 'react';

export function useOptimistic<State, Action>(
    state: State,
    updateFn: (state: State, optimisticValue: Action) => State
): [State, (action: Action) => void] {
    const [optimisticState, setOptimisticState] = useState(state);

    useEffect(() => {
        console.log('useOptimistic - useEffect');
        setOptimisticState(state);
    }, [state]);

    const addOptmistic = useCallback(
        (value: Action) => {
            console.log('addOptmistic', value);
            const optState = updateFn(optimisticState, value);
            setOptimisticState(optState);
            console.log(optState);
        },
        [optimisticState, updateFn]
    );

    return [optimisticState, addOptmistic];
}
