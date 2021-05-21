import styled, { keyframes, css } from 'styled-components';

interface AlertableProps {
  readonly $alert?: boolean;
}

export const selectionColor = '#0070f3';

const alertAnimation = keyframes`
  from {
    background: #eaeaea;
  }
  to {
    background: #fefefe;
  }
`;

export const Container = styled.div`
  padding: 0 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const Main = styled.main`
  padding: 5rem 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  max-width: 1000px;
`;

export const Title = styled.h1`
  margin: 0;
  line-height: 1.15;
  font-size: 4rem;
`;

export const Subtitle = styled.p`
  line-height: 1.5;
  font-size: 1.5rem;
  text-align: justify;
`;

export const Grid = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  max-width: 1000px;
  margin-top: 3rem;
`;

export const CardContainer = styled.div<AlertableProps>`
  display: flex;
  align-items: center;
  justify-content: space-between;

  margin: 1rem;
  padding: 1.5rem;
  text-align: left;

  background-color: white;
  color: inherit;
  text-decoration: none;
  border: 1px solid #eaeaea;
  border-radius: 10px;
  transition: border-color 0.25s ease, background-color 0.25s ease;
  width: 100%;

  ${props => props.$alert && css`
    animation: ${alertAnimation} 1s ease-in-out alternate infinite;
  `}

  :hover, :focus, :active {
    border-color: #b8b8b8;
    background-color: #eaeaea;
  }
`;

export const CardHeader = styled.div`
  width: 10%;
`;

export const CardContent = styled.div`
  width: 90%;

  h2 {
    margin: 0 0 1rem 0;
    font-size: 1.5rem;
  }

  p {
    margin: 0;
    font-size: 1.25rem;
    line-height: 1.5;
  }
`;

export const Timestamp = styled.span`
  display: block;
  font-size: 1rem;
  line-height: 1;
  color: gray;
  width: 100%;
  text-align: right;
`;