import { ActivationProps } from '@/components/activation-props';

export default function Getik(props: ActivationProps) {
  return <>
    <p>Hoi {props.who.join(' en ')},</p>
    <p>Welkom bij Getik</p>
  </>;
}
