export type ActivationProps = {
  who: string[],
  sendAnswer: (value: string) => void,
  isAnswered: boolean,
  answers?: { controller: string, value: string }[],
};
