import { useContext } from 'react';
import { TestContext } from 'State';

export default function useTest() {
  const test = useContext(TestContext);

  return test;
}
