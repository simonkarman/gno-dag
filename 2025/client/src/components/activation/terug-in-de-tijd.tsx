import { ActivationProps } from '@/components/activation-props';

export default function TerugInDeTijd(props: ActivationProps) {
  return <>
    <p>Hoi {props.who.join(' en ')},</p>
    <p>Welkom bij TerugInDeTijd</p>
  </>;
}
