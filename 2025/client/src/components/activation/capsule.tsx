import { ActivationProps } from '@/components/activation-props';

export default function Capsule(props: ActivationProps) {
  return <>
    <p>Hoi {props.who.join(' en ')},</p>
    <p>Welkom bij Capsule</p>
  </>;
}
