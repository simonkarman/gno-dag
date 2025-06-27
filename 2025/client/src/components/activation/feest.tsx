import { ActivationProps } from '@/components/activation-props';

export default function Feest(props: ActivationProps) {
  return <>
    <p>Hoi {props.who.join(' en ')},</p>
    <p>Welkom bij Feest</p>
  </>;
}
