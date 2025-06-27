import { ActivationProps } from '@/components/activation-props';

export default function Cyanotype(props: ActivationProps) {
  return <>
    <p>Hoi {props.who.join(' en ')},</p>
    <p>Welkom bij Cyanotype</p>
  </>;
}
