import { ActivationProps } from '@/components/activation-props';

export default function Ontbijt(props: ActivationProps) {
  return <>
    <p>Hoi {props.who.join(' en ')},</p>
    <p>Welkom bij Ontbijt</p>
  </>;
}
