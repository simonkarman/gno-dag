import styled from 'styled-components';
import { useLocalStorage } from '../hooks';

const InputContainer = styled.div`
  margin: 0 1rem;
  display: flex;

  input {
    flex: 50%;
    width: 0;
    text-align: center;
    padding: 0;
    margin: 0 0.3rem;
  }
  button {
    flex: 25%;
  }
`;

export function Ontbijt() {
  const [_boterhammen, setBoterhammen] = useLocalStorage<string>('boterhammen', '0');
  const boterhammen = Number.parseInt(_boterhammen, 10);
  return (
    <>
      <p className='paragraph'>
        Ontbijt. Een goed begin is het halve werk, maar een goed begin is maar de helft.
      </p>
      <h2>Boterhammen</h2>
      <p className='paragraph'>
        Hoeveel boterhammen heb jij op?
      </p>
      <InputContainer>
        <button onClick={() => setBoterhammen((boterhammen - 1).toString())} >-</button>
        <input value={boterhammen} contentEditable={false} />
        <button onClick={() => setBoterhammen((boterhammen + 1).toString())} >+</button>
      </InputContainer>
    </>
  );
};
