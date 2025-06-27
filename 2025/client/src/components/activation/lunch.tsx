import { ActivationProps } from '@/components/activation-props';

export default function Lunch(props: ActivationProps) {
  return <>
    <p>Hoi {props.who.join(' en ')},</p>
    <p>Welkom bij Lunch</p>
  </>;
}
