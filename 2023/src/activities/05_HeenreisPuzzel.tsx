import shipSvg from '@/assets/ship.svg';
import torchSvg from '@/assets/torch.svg';
import Image from 'next/image';
import {useState} from 'react';

export function HeenreisPuzzel() {
  const [auto, setAuto] = useState<undefined | 'Jac.' | 'Govie'>(undefined);
  const autoIndex = ['Jac.', 'Govie'].indexOf(auto!);
  const puzzle = 'Hallo, dit is een test. '
    + 'We moeten er op de N11 vanaf, daar waar je langs de zegerplas komt. '
    + 'Als je daar langs rijd, ga dan links bij de tweede rotonde. '
    + 'Blijf nu rechtdoor rijden tot je aan je linkerhand een echte McDonald\'s ziet, sla vervolgens naar linksaf. '
    + 'Hopelijk wordt hier de bestemming duidelijk.'
  const splits = puzzle.split(' ').map((value, index) => index % 2 === autoIndex ? value : '...');
  return <div>
    <p className="mb-4">
      Volgens mij zijn we de piraat en zijn papegaai kwijt geraakt... Die zien we nooit meer terug. En de schat uit de schatkist ook niet.
    </p>
    <div className="px-4 mb-4 flex justify-between">
      <Image src={shipSvg} width="64" alt="ship" />
      <Image src={torchSvg} width="64" alt="torch" />
    </div>
    <p className="mb-4">
      Wat nu? We moeten een plan verzinnen.
      Samen zullen we toch wel tot een oplossing kunnen komen voor deze situatie.
      {auto === undefined ? ' In welke auto zit je?' : ''}
    </p>
    {auto === undefined && <div className="flex gap-4">
      <button
          className="flex-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
          onClick={() => setAuto('Jac.')}
      >
          Ik zit in de auto waar <strong>Jac.</strong> in zit.
      </button>
      <button
          className="flex-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
          onClick={() => setAuto('Govie')}
      >
          Ik zit in de auto waar <strong>Govie</strong> in zit.
      </button>
    </div>}
    {auto !== undefined && <>
      <p className="mb-4">
          Wat leuk dat je in de auto zit waar <strong>{auto}</strong> in zit!
          Je hebt het wel getroffen zeg, het zal hier wel gezelliger zijn dan in de andere auto.
      </p>
      <p className="mb-4">
          Tijd voor een plan. Hieronder zie je een tekst met woorden. Helaas missen er een aantal woorden.
          De mensen in de andere auto zien de woorden die jullie missen.
      </p>
      <p className="mb-4">
          Kunnen jullie elkaar te bellen? Als Jac. en Govie om de beurt een woord voorlezen, dan zouden jullie er uit moeten kunnen komen.
      </p>
      <div className="mb-4 px-2 text-xl bg-gray-100 border-2 border-dotted border-gray-200">
        {splits.join(' ')}
      </div>
      <div className="flex gap-4">
        <button
            className="flex-1 bg-red-500 hover:bg-red-700 text-white font-bold text-xs py-1 px-2 rounded"
            onClick={() => setAuto(undefined)}
        >
            Ik zit toch NIET in de auto waar {auto} in zit.
        </button>
      </div>
    </>}
  </div>;
}
