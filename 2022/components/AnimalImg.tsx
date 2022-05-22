import React from 'react';

export type AnimalName = 'bear' | 'buffalo' | 'chick' | 'chicken' | 'cow' | 'crocodile' | 'dog' | 'duck' | 'elephant' | 'frog' | 'giraffe' | 'goat'
  | 'gorilla' | 'hippo' | 'horse' | 'monkey' | 'moose' | 'narwhal' | 'owl' | 'panda' | 'parrot' | 'penguin' | 'pig' | 'rabbit' | 'rhino' | 'sloth'
  | 'snake' | 'walrus' | 'whale' | 'zebra';

export interface AnimalImgProps {
  visual: 'round' | 'square';
  name: AnimalName,
  className?: string;
}

export const AnimalImg = (props: AnimalImgProps) => {
  return <img src={`animals/${props.visual}/${props.name}.png`} className={props.className} />;
};
