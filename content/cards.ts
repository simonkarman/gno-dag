export interface Card {
  timestamp: Date,
  icon: string,
  title: string,
  description: string,
}

function at(hours: number, minutes: number): Date {
  return new Date(2021, 5 - 1, 21, hours, minutes, 0, 0);
}

export const cards: Card[] = [
  {
    timestamp: at(19, 41),
    icon: '/food.png',
    title: 'Time for food!',
    description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aut neque alias obcaecati, eos error harum aspernatur eius blanditiis, voluptate quod nam id est iste. Dolorum iure unde sunt saepe nulla.'
  },
  {
    timestamp: at(20, 15),
    icon: '/flower.png',
    title: 'An example',
    description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aut neque alias obcaecati, eos error harum aspernatur eius blanditiis, voluptate quod nam id est iste. Dolorum iure unde sunt saepe nulla.'
  },
  {
    timestamp: at(20, 41),
    icon: '/food.png',
    title: 'Time for food!',
    description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aut neque alias obcaecati, eos error harum aspernatur eius blanditiis, voluptate quod nam id est iste. Dolorum iure unde sunt saepe nulla.'
  },
  {
    timestamp: at(22, 47),
    icon: '/flower.png',
    title: 'An example',
    description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aut neque alias obcaecati, eos error harum aspernatur eius blanditiis, voluptate quod nam id est iste. Dolorum iure unde sunt saepe nulla.'
  },
  {
    timestamp: at(23, 30),
    icon: '/food.png',
    title: 'Time for food!',
    description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aut neque alias obcaecati, eos error harum aspernatur eius blanditiis, voluptate quod nam id est iste. Dolorum iure unde sunt saepe nulla.'
  },
  {
    timestamp: at(23, 54),
    icon: '/flower.png',
    title: 'An example',
    description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aut neque alias obcaecati, eos error harum aspernatur eius blanditiis, voluptate quod nam id est iste. Dolorum iure unde sunt saepe nulla.'
  }
]