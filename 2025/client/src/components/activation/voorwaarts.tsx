import { useState } from 'react';
import { ActivationProps } from '@/components/activation-props';
import { QuestionBox } from '@/components/question-box';

export default function Voorwaarts(props: ActivationProps) {
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [showFinalMessage, setShowFinalMessage] = useState(false);

  const tasks = [
    { id: 'photos', label: 'Een polaroid foto van iedereen maken', icon: '📸' },
    { id: 'pack', label: 'Alles netjes terugstoppen in de capsule', icon: '📦' },
    { id: 'seal', label: 'Tijdscapsule goed dichtmaken', icon: '🔒' },
    { id: 'location', label: 'Mooie verstopplek bedenken', icon: '🗺️' }
  ];

  const toggleTask = (taskId: string) => {
    setCompletedTasks(prev => {
      const newTasks = prev.includes(taskId)
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId];

      if (newTasks.length === tasks.length && !showFinalMessage) {
        setTimeout(() => setShowFinalMessage(true), 500);
      } else {
        setShowFinalMessage(false);
      }

      return newTasks;
    });
  };

  const allTasksComplete = completedTasks.length === tasks.length;
  const progressPercentage = (completedTasks.length / tasks.length) * 100;

  return <>
    <div className="text-green-700 mb-2 font-mono">[FASE AFSLUITING GEÏNITIEERD]</div>

    <p>
      Uitstekend werk vandaag. Mijn sensoren registreren dat jullie
      een prachtige verzameling hebt samengesteld - cyanotypes die de kracht van het licht vastleggen,
      persoonlijke artefacten die jullie verhaal vertellen.
    </p>

    <p>
      Nu moeten we deze capsule gereedmaken voor zijn reis naar de toekomst. Elke stap is cruciaal
      voor de temporele integriteit van de overdracht.
    </p>

    <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
      <div className="mb-2">⚡ MISSIE VOORTGANG</div>
      <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
        <div
          className="bg-green-500 h-2 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      <div className="text-xs opacity-75">{completedTasks.length}/{tasks.length} taken voltooid</div>
    </div>

    <div className="space-y-2">
      <div className="text-yellow-600 font-semibold">VEREISTE HANDELINGEN:</div>

      {tasks.map(task => (
        <div
          key={task.id}
          className={`border-2 rounded-lg p-3 cursor-pointer transition-all duration-300 ${
            completedTasks.includes(task.id)
              ? 'border-green-500 bg-green-50'
              : 'border-gray-300 hover:border-blue-400'
          }`}
          onClick={() => toggleTask(task.id)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{task.icon}</span>
              <span className={completedTasks.includes(task.id) ? 'line-through text-gray-600' : ''}>
                {task.label}
              </span>
            </div>
            <div className={`w-6 h-6 rounded-full border-2 transition-all ${
              completedTasks.includes(task.id)
                ? 'bg-green-500 border-green-500'
                : 'border-gray-400'
            }`}>
              {completedTasks.includes(task.id) && (
                <div className="text-white text-sm text-center leading-5">✓</div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>

    {allTasksComplete && !showFinalMessage && (
      <div className="text-center text-blue-600 font-mono animate-pulse">
        [VALIDATIE IN PROGRESS...]
      </div>
    )}

    {showFinalMessage && (
      <div className="animate-fade-in border-l-4 border-blue-500 pl-4 bg-blue-50 p-4 rounded">
        <div className="text-blue-700 mb-2 font-mono">[TIJDSCAPSULE GEREED VOOR OVERDRACHT]</div>

        <p>
          Perfect. Alle vereiste stappen zijn uitgevoerd. De capsule is nu gekalibreerd
          voor temporele overdracht naar het jaar 2030.
        </p>

        <p>
          Zoek de komende dagen een veilige, betekenisvolle locatie voor jullie tijdscapsule.
          Een plek die iets zegt over jullie verhaal samen. Onder in een kast waar herinneringen bewaard worden,
          begraven in de tuin waar jullie hebben geleefd, of een andere bijzondere plek.
        </p>

        <div className="bg-yellow-100 p-3 rounded border-l-4 border-yellow-500 my-3">
          <div className="text-yellow-800 font-semibold">⚠️ TEMPORELE STABILISATIE VEREIST</div>
          <p className="text-yellow-700 text-sm mt-1">
            Pak iets te drinken en kom tot rust. Mijn systemen hebben
            recalculatie tijd nodig voordat we kunnen doorgaan naar de volgende fase.
          </p>
        </div>

        <p className="font-semibold text-center text-gray-700">
          Wacht op mijn volgende transmissie...
        </p>
      </div>
    )}

    {allTasksComplete && showFinalMessage && (
      <div className="mt-4">
        <QuestionBox
          question="Waar zouden jullie de tijdscapsule het liefst verstoppen? (Beschrijf de plek)"
          isAnswered={'open'}
          answers={props.answers}
          sendAnswer={props.sendAnswer}
        />
      </div>
    )}
  </>;
}
