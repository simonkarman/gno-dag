import { ActivationProps } from '@/components/activation-props';

export default function Tikken(props: ActivationProps) {
  return <>
    <p>Hoi {props.who.join(' en ')},</p>
    <p>Welkom bij Tikken</p>
  </>;
}
