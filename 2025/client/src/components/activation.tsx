export type Activation = {
  identifier: string;
  when: string;
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
  color: string;
  isActive: boolean;
  who: string[];
  requirement: string;
};
