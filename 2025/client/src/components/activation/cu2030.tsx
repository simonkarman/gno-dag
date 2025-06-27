import { ActivationProps } from '@/components/activation-props';

export default function Cu2030(props: ActivationProps) {
  return <>
    <p>Hoi {props.who.join(' en ')},</p>
    <p>Welkom bij Cu2030</p>
  </>;
}
