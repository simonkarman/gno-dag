import { DisplayControllers } from '@/components/display-controllers';
import { DisplayQR } from '@/components/display-qr';
import { DisplayInformation, useDisplayStore } from '@/components/display-client';

export function Display({ displayInformation }: { displayInformation: DisplayInformation }) {
  const data = useDisplayStore();
  return <>
    <div className="p-3 space-y-4">
      <h1 className="text-4xl font-bold drop-shadow">GNO Dag 2025</h1>
      <p><b>Open deze pagina op een groot scherm!</b> Scan daarna de QR code met je mobiel om deel te nemen.</p>
      <svg viewBox={`-0.6 -0.6 ${data.worldSize + 0.2} ${data.worldSize + 0.2}`}
           className="w-[740px] h-[740px] bg-white rounded-lg shadow-lg border border-zinc-500 p-2"
      >
        <g transform='translate(-0.5, -0.5)'>
          {data.activations.map(activation => (
            <g key={activation.identifier}>
              <rect
                x={activation.xMin}
                y={activation.yMin}
                width={activation.xMax - activation.xMin + 1}
                height={activation.yMax - activation.yMin + 1}
                className="stroke-[0.05]"
                fill={activation.color || 'rgba(255, 0, 0, 0.1)'}
              />
            </g>
          ))}
          {Array.from({ length: data.worldSize + 1 }, (_, i) => (<g key={'g' + i}>
            <line
              x1={i}
              y1={0}
              x2={i}
              y2={data.worldSize}
              className="stroke-zinc-200 stroke-[0.05]"
            />
            <line
              x1={0}
              y1={i}
              x2={data.worldSize}
              y2={i}
              className="stroke-zinc-200 stroke-[0.05]"
            />
          </g>))}
        </g>
        {Object.entries(data.controllers).map(([controllerId, location]) => (
          <g key={controllerId}>
            <circle
              key={controllerId}
              cx={location?.x}
              cy={location?.y}
              r={0.4}
              className="fill-green-500 stroke-black stroke-[0.04] hover:fill-green-600 active:fill-green-700"
            />
            <g transform={`translate(${location?.x} ${location ? location.y + 0.04 : location}) scale(0.02)`}>
              <text className='pointer-events-none select-none fill-white font-bold text-2xl' textAnchor='middle' alignmentBaseline='middle'>{controllerId[0]}</text>
            </g>
          </g>
        ))}
      </svg>
      <DisplayControllers />
    </div>
    <div className="absolute right-2 top-2 p-2 bg-white rounded-lg border shadow flex flex-col gap-2">
      <DisplayQR displayInformation={displayInformation}/>
    </div>
  </>
}
