import { DisplayInformation } from '@/components/display-client';
import Image from 'next/image';

export function DisplayQR({ displayInformation }: { displayInformation: DisplayInformation }) {
  const localhostReplacement = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
  const clientUrl =( process.env.NEXT_PUBLIC_KRMX_CLIENT_URL || 'ws://localhost:3000').replace('localhost', localhostReplacement ?? 'localhost');
  const qrData = clientUrl + `?d=${displayInformation.id}`;
  return <a target="_blank" href={qrData} rel="noreferrer">
    <Image
      className="opacity-100"
      width={200}
      height={200}
      src={`https://api.qrserver.com/v1/create-qr-code/?data=${qrData}`}
      alt="QR Code"
    />
  </a>
}
