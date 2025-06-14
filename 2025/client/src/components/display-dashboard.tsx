import { useState, useEffect } from 'react';
import { DisplayStoreState } from '@/components/display-client';

export default function Dashboard({ data }: { data: DisplayStoreState }) {
  const [metrics, setMetrics] = useState({
    cpuLoad: 47,
    memoryUsage: 73,
    networkLatency: 12,
    quantumStability: 94,
    temporalCoherence: 88,
    systemIntegrity: 99
  });

  const [statusBlink, setStatusBlink] = useState(true);
  const [dataStream, setDataStream] = useState('');

  // Update metrics periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        cpuLoad: Math.max(20, Math.min(95, prev.cpuLoad + (Math.random() - 0.5) * 10)),
        memoryUsage: Math.max(30, Math.min(90, prev.memoryUsage + (Math.random() - 0.5) * 8)),
        networkLatency: Math.max(5, Math.min(50, prev.networkLatency + (Math.random() - 0.5) * 6)),
        quantumStability: Math.max(85, Math.min(99, prev.quantumStability + (Math.random() - 0.5) * 4)),
        temporalCoherence: Math.max(75, Math.min(95, prev.temporalCoherence + (Math.random() - 0.5) * 6)),
        systemIntegrity: Math.max(95, Math.min(100, prev.systemIntegrity + (Math.random() - 0.5) * 2))
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Status indicator blink
  useEffect(() => {
    const interval = setInterval(() => {
      setStatusBlink(prev => !prev);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Data stream simulation
  useEffect(() => {
    const streams = [
      'CHRONO_FLUX: 0x4A7B',
      'TEMP_COORDS: 1842.06.29',
      'QUANTUM_STATE: STABLE',
      'CAPSULE_STATUS: READY',
      'TIMELINE_SYNC: OK',
      'FAMILY_MATRIX: 6/6'
    ];

    const interval = setInterval(() => {
      const randomStream = streams[Math.floor(Math.random() * streams.length)];
      setDataStream(randomStream);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grow-1 backdrop-blur-md rounded-lg active-hint p-4 shadow space-y-2 flex flex-col gap-3 text-zinc-300">
      {/* Header */}
      <div className="text-center border-b border-zinc-600 pb-2">
        <div className="text-xs text-green-400 font-mono">
          ◉ TIJDELIJK ANALYSE SYSTEEM v2.157
        </div>
      </div>

      {/* Next Event - Highlighted */}
      <div className="bg-blue-900/30 border border-blue-500/50 rounded p-3 text-center">
        <div className="text-blue-300 text-xs mb-1">VOLGENDE ACTIVATIE</div>
        {data.activations.next && (<>
          <div className="font-bold text-white text-lg">
            {new Date(data.activations.next).toLocaleDateString()}
          </div>
          <div className="font-bold text-white text-lg">
            {new Date(data.activations.next).toLocaleTimeString()}
          </div>
        </>)}
        {!data.activations.next && (<div className="font-bold text-white text-md">
          [GEEN]<br/>
          Of <span className="text-white opacity-20">29/06/2030</span>?
        </div>)}
      </div>

      {/* System Metrics */}
      <div className="grid grid-cols-1 gap-2 text-xs">
        <div className="space-y-1">
          <div className="flex justify-between">
            <span>CPU LOAD</span>
            <span className="text-amber-400">{metrics.cpuLoad.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-zinc-700 rounded-full h-1">
            <div
              className="bg-amber-400 h-1 rounded-full transition-all duration-1000"
              style={{ width: `${metrics.cpuLoad}%` }}
            ></div>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between">
            <span>GEHEUGEN</span>
            <span className="text-cyan-400">{metrics.memoryUsage.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-zinc-700 rounded-full h-1">
            <div
              className="bg-cyan-400 h-1 rounded-full transition-all duration-1000"
              style={{ width: `${metrics.memoryUsage}%` }}
            ></div>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between">
            <span>LATENCY</span>
            <span className="text-green-400">{metrics.networkLatency.toFixed(0)}ms</span>
          </div>
          <div className="w-full bg-zinc-700 rounded-full h-1">
            <div
              className="bg-green-400 h-1 rounded-full transition-all duration-1000"
              style={{ width: `${100 - metrics.networkLatency}%` }}
            ></div>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between">
            <span>Q-STABLE</span>
            <span className="text-purple-400">{metrics.quantumStability.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-zinc-700 rounded-full h-1">
            <div
              className="bg-purple-400 h-1 rounded-full transition-all duration-1000"
              style={{ width: `${metrics.quantumStability}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Status Indicators */}
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="flex items-center gap-1">
          <div className={`w-2 h-2 rounded-full ${statusBlink ? 'bg-green-400' : 'bg-green-800'} transition-colors`}></div>
          <span>ONLINE</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-blue-400"></div>
          <span>SYNC</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-purple-400"></div>
          <span>READY</span>
        </div>
      </div>

      {/* Data Stream */}
      <div className="bg-zinc-800/50 rounded p-2 border border-zinc-600">
        <div className="text-xs text-zinc-500 mb-1">DATA STREAM</div>
        <div className="font-mono text-xs text-green-300 overflow-hidden">
          {dataStream && `> ${dataStream}`}
          <span className="animate-pulse">_</span>
        </div>
      </div>

      {/* Bottom Stats */}
      <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-zinc-600 text-center">
        <div className="col-span-2 text-xs text-zinc-500">- SYSTEEM -</div>
        <div>
          <div className="text-zinc-500">SAMENHANG</div>
          <div className="text-white font-mono">{metrics.temporalCoherence.toFixed(1)}%</div>
        </div>
        <div>
          <div className="text-zinc-500">INTEGRITEIT</div>
          <div className="text-white font-mono">{metrics.systemIntegrity.toFixed(2)}%</div>
        </div>
      </div>
    </div>
  );
}
