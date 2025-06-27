import { ActivationProps } from '@/components/activation-props';

export default function Analyse(props: ActivationProps) {
  return <>
    <p>Hoi {props.who.join(' en ')},</p>
    <p>Welkom bij Analyse</p>
  </>;
}
