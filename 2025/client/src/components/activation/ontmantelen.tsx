import { ActivationProps } from '@/components/activation-props';

export default function Ontmantelen(props: ActivationProps) {
  return <>
    <p>Hoi {props.who.join(' en ')},</p>
    <p>Welkom bij Ontmantelen</p>
  </>;
}
