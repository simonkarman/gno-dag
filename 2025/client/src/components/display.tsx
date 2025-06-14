import { DisplayControllers } from '@/components/display-controllers';
import { DisplayQR } from '@/components/display-qr';
import { DisplayInformation, useDisplayStore } from '@/components/display-client';
import { Random } from '@/utils/random';
import Dashboard from '@/components/display-dashboard';

export function Display({ displayInformation }: { displayInformation: DisplayInformation }) {
  const data = useDisplayStore();
  const r = Random.fromSeed("abc123");
  return <>
    <div className="p-2 pt-20 flex justify-between gap-4">
      <div className="time-particles">
        {Array.from({ length: 100 }, (_, i) => (
          <div key={i} className="particle" style={{
            left: `${r.next() * 100}%`,
            animationDelay: `${r.next() * 10}s`,
          }} />
        ))}
      </div>
      <div className="space-y-4">
        <svg viewBox={`-0.6 -0.6 ${data.worldSize + 0.2} ${data.worldSize + 0.2}`}
             className="w-[740px] h-[740px] backdrop-blur-md rounded-lg active-hint p-2"
        >
          <g transform='translate(-0.5, -0.5)'>
            {Array.from({ length: data.worldSize + 1 }, (_, i) => (<g key={'g' + i}>
              <line
                x1={i}
                y1={0}
                x2={i}
                y2={data.worldSize}
                className="stroke-white stroke-[0.003] animate-pulse"
              />
              <line
                x1={0}
                y1={i}
                x2={data.worldSize}
                y2={i}
                className="stroke-white stroke-[0.003] animate-pulse"
              />
            </g>))}
            {data.activations.visible.map(activation => (
              <g key={activation.identifier}>
                <rect
                  x={activation.xMin + 0.01}
                  y={activation.yMin + 0.01}
                  width={activation.xMax - activation.xMin + 1 - 0.02}
                  height={activation.yMax - activation.yMin + 1 - 0.02}
                  className={`stroke-[0.04]`}
                  style={{
                    stroke: activation.isActive ? 'orange' : activation.color,
                  }}
                  fill={activation.color || 'rgba(255, 0, 0, 0.1)'}
                />
              </g>
            ))}
          </g>
          {Object.entries(data.controllers).map(([controllerId, location]) => (
            <g key={controllerId}>
              <circle
                key={controllerId}
                cx={location?.x}
                cy={location?.y}
                r={0.4}
                className="fill-green-500 stroke-white stroke-[0.04] hover:fill-green-600 active:fill-green-700"
              />
              <g transform={`translate(${location?.x} ${location ? location.y + 0.04 : location}) scale(0.02)`}>
                <text className='pointer-events-none select-none fill-white font-bold text-2xl' textAnchor='middle' alignmentBaseline='middle'>{controllerId[0]}</text>
              </g>
            </g>
          ))}
        </svg>
        <DisplayControllers />
      </div>
      <div className='flex flex-col gap-4'>
        <div className="p-2 bg-zinc-200 rounded-lg shadow flex flex-col gap-2 active-hint text-black text-center">
          <DisplayQR displayInformation={displayInformation}/>
          <h2 className="font-bold">GNO Dag 2025</h2>
        </div>
        <Dashboard data={data} />
      </div>
    </div>
  </>
}
