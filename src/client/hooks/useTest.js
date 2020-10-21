import { useContext } from 'react';
import { StateContext } from 'State';

export default function useTest() {
  const [{ test }] = useContext(StateContext);

  return test;
}
