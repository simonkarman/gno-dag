import { useEffect, useState } from 'react';

export type QuestionBoxProps = {
  question: string,
  isAnswered: boolean | 'open',
  answers?: { controller: string, value: string }[],
  sendAnswer: (value: string) => void
};

export function QuestionBox({ question, isAnswered, answers, sendAnswer }: QuestionBoxProps) {
  const [isOpen, setIsOpen] = useState(isAnswered === 'open');
  const [localAnswer, setLocalAnswer] = useState('');

  useEffect(() => {
    if (!isAnswered) {
      setIsOpen(false);
    }
  }, [isAnswered]);

  // Always show the question box if it is not yet answered, otherwise show it only when the user clicks to open it
  const showOpen = isAnswered ? isOpen : true;
  const atLeastOneAnswer = answers && answers.length > 0;
  return <div className={`space-y-2 border border-2 rounded-lg py-2 px-3 ${isAnswered ? 'border-green-500' : 'border-red-500'}`}>
    {!showOpen && <>
      <p className="text-green-700">
        Goed gedaan! Jullie hebben samen het juiste antwoord gegeven.
      </p>
      <div className="flex justify-end">
        <button className="px-2 py-0.5 border rounded-sm" onClick={() => setIsOpen(!isOpen)}>Toon antwoorden</button>
      </div>
    </>}
    {showOpen && <>
      <p>{question}</p>
      {!isAnswered && atLeastOneAnswer && <p className="text-red-700">
        Het is helaas nog fout. Het zou kunnen dat sommige van jullie al wel het goede antwoord gegeven hebben, maar er is een <b>meerderheid</b> (4 of meer) aan goede antwoorden nodig!
      </p>}
      {isAnswered === true && <p className="text-green-700">
        Goed gedaan! Jullie hebben samen het juiste antwoord gegeven.
      </p>}
      <div>
        <h2 className="underline">Gegeven Antwoorden</h2>
        {answers &&
          <ul>
            {answers.map((a, index) => (
              <li key={index}>
                {a.controller}: {a.value}
              </li>
            ))}
          </ul>
        }
        {!answers && <p className="text-gray-500">Er zijn nog geen antwoorden gegeven.</p>}
      </div>
      <div className="flex w-full gap-2">
        <input value={localAnswer} onChange={(e) => setLocalAnswer(e.target.value)} className="flex-grow border py-1 px-2 rounded-sm" type="text" />
        <button
          className={`border px-2 py-1 rounded-sm ${isAnswered ? 'bg-green-500 hover:bg-green-600 active:bg-green-700' : 'bg-red-500 hover:bg-red-600 active:bg-red-700'} text-white transition-colors`}
          onClick={() => sendAnswer(localAnswer)}
        >
          Antwoord
        </button>
      </div>
      {isAnswered === true &&
        <div className="flex justify-end">
          <button className="px-2 py-0.5 border rounded-sm" onClick={() => setIsOpen(!isOpen)}>Verberg antwoorden</button>
        </div>
      }
    </>}
  </div>
}
