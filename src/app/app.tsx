import { Form, WithMutationQueue } from './form';

export function App() {
  return (
    <WithMutationQueue>
      <Form />
    </WithMutationQueue>
  );
}

export default App;
