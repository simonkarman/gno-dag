import React, { useEffect } from 'react';
import { useLocalStorageBoolean, useLocalStorageInteger } from '../hooks/common/useTransformedStorage';
import { AnimalImg, AnimalName } from './AnimalImg';
import { InputContainer } from './InputContainer';

export interface StoryProps {
  shortName: string;
  sections: { title: string, animalName: AnimalName, Component: JSX.Element }[];
  Puzzle?: JSX.Element;
}

function isFirstOccurrenceInArray<T>(value: T, index: number, array: T[]) {
  return array.indexOf(value) === index;
}

export function Story(props: StoryProps) {
  const [isHidden, setHidden] = useLocalStorageBoolean(`${props.shortName}--hidden`, false);
  const [progress, setProgress] = useLocalStorageInteger(`${props.shortName}--progress`, 0);
  const isFinished = progress >= props.sections.length;
  const HiddenToggle = <InputContainer>
    <button onClick={() => setHidden(!isHidden)}>
      {isHidden ? 'Toon verhaal' : 'Verberg verhaal'}
      {isHidden && <div style={{ display: 'flex', alignItems: 'center' }}>
        {props.sections
          .map(section => section.animalName)
          .filter(isFirstOccurrenceInArray)
          .map(animalName => (<AnimalImg key={animalName} visual={'round'} name={animalName} className={'small'} />))}
      </div>}
    </button>
  </InputContainer>;
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [isHidden]);
  return (
    <>
      {isFinished && HiddenToggle}
      {!isHidden && props.sections.slice(0, progress).map((section, index) => (<div key={index}>
        <h3>
          {section.title}
        </h3>
        <AnimalImg visual={'round'} name={section.animalName} className={'small'} />
        {section.Component}
      </div>))}
      {!isFinished && (<InputContainer>
        <button
          onClick={() => setProgress(progress + 1)}
        >
          Ga verder...
        </button>
      </InputContainer>)}
      {isFinished && !isHidden && HiddenToggle}
      {isFinished && props.Puzzle}
    </>
  );
}
