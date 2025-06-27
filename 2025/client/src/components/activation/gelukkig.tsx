import { ActivationProps } from '@/components/activation-props';

export default function Gelukkig(props: ActivationProps) {
  return <>
    <p>Hoi {props.who.join(' en ')},</p>
    <p>Welkom bij Gelukkig</p>
  </>;
}
