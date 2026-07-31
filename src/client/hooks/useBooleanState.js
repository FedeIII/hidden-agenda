import { useCallback, useState } from 'react';

// The setters are memoised so they are safe to name as effect dependencies. Unmemoised, adding
// them to a dependency array would re-run the effect on every render — which for the menus in
// playActions would mean closing them constantly.
export default function useBooleanState(initialValue) {
	const [value, setValue] = useState(initialValue);
	const setTrue = useCallback(() => setValue(true), []);
	const setFalse = useCallback(() => setValue(false), []);

	return [value, setTrue, setFalse];
}
