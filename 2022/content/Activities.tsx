import { DateTime } from 'luxon';
import React from 'react';
import { Activity } from '../components/Activity';
import { Afsluiting } from './Afsluiting';
import { Bierproeverij } from './Bierproeverij';
import { Diner } from './Diner';
import { Lunch } from './Lunch';
import { Middagdutje } from './Middagdutje';
import { Ontbijt } from './Ontbijt';
import { Puzzel } from './Puzzel';
import { Speurtocht } from './Speurtocht';
import { Stroopwafel } from './Stroopwafel';
import { TieDye } from './TieDye';

const gnoDag2022 = DateTime.fromISO('2022-06-05T07:00:00.000');
const at = (hour: number, minute: number) => gnoDag2022.set({ hour, minute });
export const activities: Activity[] = [
  { start: at(9, 45), title: 'Waldo', Component: <Ontbijt/> },
  { start: at(10, 30), title: 'Paolo', Component: <TieDye/> },
  { start: at(11, 45), title: 'SGKP', Component: <Puzzel/> },
  { start: at(12, 10), title: 'Koo', Component: <Lunch/> },
  { start: at(13, 30), title: 'Aart', Component: <Middagdutje/> },
  { start: at(14, 0), title: 'Wouter', Component: <Speurtocht/> },
  { start: at(15, 0), title: 'Bert', Component: <Stroopwafel/> },
  { start: at(16, 30), title: 'Red', Component: <Bierproeverij/> },
  { start: at(18, 0), title: 'Chris', Component: <Diner/> },
  { start: at(20, 0), end: at(21, 0), title: 'Bedankt', Component: <Afsluiting/> },
];
