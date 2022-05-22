import styled from 'styled-components';
import { AnimalImg } from '../components/AnimalImg';
import { InputContainer } from '../components/InputContainer';
import { useLocalStorage } from '../hooks';

const ImgContainer = styled.div`
  margin-inline: auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  max-width: 70%;
`;

// https://www.calcudoku.org/im/forum/img_f8_t443_p4058_i1.png
// antwoord: pinGuin
export function Puzzel() {
  const [answer, setAnswer] = useLocalStorage<string>('puzzel--answer', '');
  const isCorrect = answer === '7pinguin';
  return (
    <>
      <p>
        Tijd om even lekker te gaan zitten en uit te rusten.
      </p>
      <ImgContainer>
        <AnimalImg visual={'round'} className='grid' name={'snake'} />
        <AnimalImg visual={'round'} className='grid' name={'giraffe'} />
        <AnimalImg visual={'round'} className='grid' name={'chicken'} />
        <AnimalImg visual={'round'} className='grid' name={'penguin'} />
      </ImgContainer>
      <p className='paragraph'>
        Wij zijn <b>Slis</b> de slang, <b>Girt</b> de giraffe, <b>Karen</b> de kip, en <b>Pien</b> de pinguin.
        De komende 20 minuten gaan wij jullie bezig houden met een puzzel.
      </p>
      <p className='paragraph'>
        Nee, het wordt geen legpuzzel, dat hebben jullie twee jaar geleden al gedaan.
        Alhoewel <b>Ollie</b> dat misschien wel was vergeten.
        Nee, deze puzzel zal jullie denkvermogen goed testen. Heel veel succes!
      </p>
      <h3>De puzzel</h3>
      <p className='paragraph'>
        Jullie moeten erachter zien te komen wie van ons deze puzzel bedacht heeft.
        Het doel is om een getal, gevolgd door een dier hieronder op te geven als antwoord.
        Eerst zullen jullie in de woonkamer moeten vinden hoe veel punten wij elk waard zijn.
        Als je dat gevonden hebt, dan kunnen je onderstaande puzzel oplossen.
      </p>
      <InputContainer>
        <input
          value={answer}
          onChange={(e) => setAnswer(e.target.value.toLowerCase().trim())}
          className={isCorrect ? 'correct' : (answer.length > 0 ? 'incorrect' : '')}
        />
      </InputContainer>
      <p className='clickable'>
        (bijv. 5slang)
      </p>
      <p className='paragraph'>
        Om achter het <u>getal</u> van het antwoord te komen zul je de waarde van de twee vakjes met vraagtekens bij elkaar op moeten tellen.
        Om achter het <u>dier</u> van het antwoord te komen moet je kijken in het vakje rechts onderin.
        Heel veel succes!
      </p>
      <ImgContainer>
        {isCorrect ? '3' : ''}
        <AnimalImg visual={'round'} className='grid' name={'snake'} />
        <AnimalImg visual={'round'} className='grid' name={'giraffe'} />
        {isCorrect ? '1' : ''}
      </ImgContainer>
      <img src={`puzzle/${isCorrect ? 'sudoku-answer' : 'sudoku'}.png`} />
      <ImgContainer>
        {isCorrect ? '4' : ''}
        <AnimalImg visual={'round'} className='grid' name={'chicken'} />
        <AnimalImg visual={'round'} className='grid' name={'penguin'} />
        {isCorrect ? '2' : ''}
      </ImgContainer>
    </>
  );
};
