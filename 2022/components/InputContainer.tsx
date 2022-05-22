import styled from 'styled-components';
import { accentColor } from './GlobalStyle';

export const InputContainer = styled.div`
  margin: 0 0.4rem 0.5rem 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  
  button {
    padding: 0.2rem 0.6rem;
    border: 2px solid ${accentColor};
    border-radius: 0.2rem;
    font-weight: bold;
  }
  input {
    width: 100%;
    border-radius: 0.2rem;
    padding: 0.2rem;
    border: 2px gray solid;
  } 
  .incorrect {
    border-color: red;
  }
  .correct {
    border-color: green;
  }
`;
