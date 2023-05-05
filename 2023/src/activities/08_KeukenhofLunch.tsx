import sword from '@/assets/sword.svg';
import Image from 'next/image';
import {useState} from 'react';

export function KeukenhofLunch() {
  const riddles = [
    { hint: 'Hoe kun je een domkop die piraatje speelt herkennen?', answer: 'Hij draagt twee ooglappen.' },
    { hint: 'Waarom vind je wat je zoekt altijd op de laatste plaats waar je gezocht hebt?', answer: 'Omdat je als je het gevonden hebt stopt met zoeken.' },
    { hint: 'In een straat staan 100 huizen. De huizen zijn genummerd van 1 tot en met 100. Elk huisnummer komt 1 keer voor in de straat. Hoeveel negens staan er in totaal in al deze huisnummers?', answer: '20 (10 bij de tientallen + 10 bij de eenheden).' },
    { hint: 'Een boot ligt aangemeerd in de haven van Antwerpen. Aan de boot hangt een laddertje van drie meter lengte met om de 20 cm een sport. Als het eb is, steken er acht sporten uit het water. Bij vloed stijgt het water met één meter, hoeveel sporten zijn er dan nog zichtbaar?', answer: 'Acht: als het water stijgt, stijgt de boot ook.' },
    { hint: 'Van welk houtsoort wordt een houten been gemaakt?', answer: 'Van kreupelhout' },
  ];
  const [showAnswerOf, setShowAnswerOf] = useState(-1);
  return <div>
    <p className="mb-4">
      Hoe bevalt het? Is de reis een beetje te doen? Vergeet niet om goed te drinken en neem de tijd om de lunch die jullie hebben meegenomen op te eten.
      We moeten scherp blijven!
    </p>
    <div className="px-4 mb-4 flex justify-between">
      <Image src={sword} width="64" alt="sword" />
    </div>
    <p className="mb-4">
      Hier een aantal moppen voor tijdens de lunch.
      {riddles.map(({ hint, answer }, index) => <div key={index} className="bg-gray-100 px-2 py-2 my-2">
        <p>
          {hint}
        </p>
        <hr />
        {showAnswerOf === index && <p>{answer}</p>}
        {showAnswerOf !== index && <button
          className="text-xs bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
          onClick={() => setShowAnswerOf(index)}
        >
            Toon Antwoord
        </button>}

      </div>)}
    </p>
  </div>;
}
