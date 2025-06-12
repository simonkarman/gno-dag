import { ActivationProps } from '@/components/activation-props';

export default function Niks(props: ActivationProps) {
  return <>
    <p>Hoi {props.who.join(' en ')},</p>
    <p>Wat fijn dat jullie hier samen staan. Jullie zijn het <b>gezelligste</b> tweetal dat hier tot nu toe gestaan heeft!</p>
    <p>Genieten jullie een beetje van het uitzicht op de voorbij vliegende... wat zijn het eigenlijk?</p>
    <hr className='text-zinc-200 my-4' />
    <p>Maar... Wat doen jullie hier? Er is hier <b>niks</b> te beleven.</p>
    <p>Waarom gaan jullie niet rondkijken of jullie nog iets anders kunnen vinden?</p>
  </>;
}
