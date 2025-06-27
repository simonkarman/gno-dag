import { ActivationProps } from '@/components/activation-props';

export default function Vastleggen(props: ActivationProps) {
  return <>
    <p>Hoi {props.who.join(' en ')},</p>
    <p>Welkom bij Vastleggen</p>
  </>;
}
