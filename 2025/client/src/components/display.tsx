import { DisplayControllers } from '@/components/display-controllers';
import { DisplayQR } from '@/components/display-qr';
import { DisplayInformation, useDisplayStore } from '@/components/display-client';

export function Display({ displayInformation }: { displayInformation: DisplayInformation }) {
  const data = useDisplayStore();
  return <>
    <div className="p-3 space-y-2 max-w-[480px]">
      <h1 className="text-4xl font-bold drop-shadow">GNO Dag 2025</h1>
      <p><b>Open deze pagina op een groot scherm!</b> Scan daarna de QR code me je mobile om deel te nemen.</p>
      <svg viewBox={`-1 -1 ${data.worldSize + 1} ${data.worldSize + 1}`} className="w-[480px] h-[480px] bg-white rounded-lg shadow-lg">
        <g transform='translate(-0.5, -0.5)'>
          {Array.from({ length: data.worldSize + 1 }, (_, i) => (<g key={'g' + i}>
            <line
              x1={i}
              y1={0}
              x2={i}
              y2={data.worldSize}
              className="stroke-gray-200 stroke-[0.05]"
            />
            <line
              x1={0}
              y1={i}
              x2={data.worldSize}
              y2={i}
              className="stroke-gray-200 stroke-[0.05]"
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
              className="fill-blue-500 stroke-black stroke-[0.08]"
            />
            <g transform={`translate(${location?.x} ${location?.y}) scale(0.02)`}>
              <text className='fill-white' textAnchor='middle' alignmentBaseline='middle'>{controllerId}</text>
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
