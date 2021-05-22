export interface Card {
  timestamp: Date,
  icon: string,
  title: string,
  description: string,
  image?: string,
  link?: { url: string, text: string },
}

function atDay(day: number, hours: number, minutes: number): Date {
  return new Date(2021, 5 - 1, day, hours, minutes, 0, 0);
}

function at(hours: number, minutes: number): Date {
  return atDay(24, hours, minutes);
}

export const cards: Card[] = [
  {
    timestamp: atDay(22, 12, 0),
    icon: '/confetti.png',
    title: 'Het is weer bijna zo ver!',
    description: 'De dag die je wist dat zou komen is eindelijk bijna hier. Houd deze website goed in de gaten. Je kunt precies zien wanneer de volgende hint onthuld wordt.',
  },
  {
    timestamp: atDay(23, 10, 0),
    icon: '/sun.png',
    title: '24 uur...',
    description: 'Over 24 uur gaat het feest beginnen. Geniet nog even lekker van de zondag en tot morgen!',
  },
  {
    timestamp: atDay(23, 18, 30),
    icon: '/happy.png',
    title: 'De spanning stijgt',
    description: 'Zorg dat je morgenochtend om 10 uur klaar staat om te beginnen. Je moet dan dus al zijn opgestaan, hebben gedoucht, je ontbijt hebben opgegeten (niet te veel), en helemaal ontvlooid zijn. Zorg dat je kleren aan doet waarbij het niet zo erg is als ze vies worden.',
  },
  {
    timestamp: at(8, 30),
    icon: '/morning.png',
    title: 'Opstaaaaaaaan',
    description: 'Het is tijd voor gender neutrale ouderdag 2021!',
    link: { url: 'https://www.youtube.com/watch?v=RsMgIocbNPU', text: 'Wakker worden wakker worden wak wak wakker worden.' },
  },
  {
    timestamp: at(9, 50),
    icon: '/rocket.png',
    title: 'Zijn we er klaar voor?',
    description: 'Over 10 minuten gaan we beginnen. Poets nog snel je tanden en zet je feestgezicht op! Zijn Simon en Lisa er eigenlijk al?',
  },
  {
    timestamp: at(10, 0),
    icon: '/plant-jar.png',
    title: 'Even iets uit ons systeem krijgen',
    description: 'Vorig jaar tijdens de GNO dag hebben we iets gedaan wat bij velen van ons is gaan schimmelen. We gaan dit daarom rechtzetten dit jaar. Deze keer hebben we meer kennis en ervaring en dus laten we dit ons niet nog een keer overkomen. Loop nu naar de verranda toe!',
    image: '/ecosysteem.jpg',
  },
  {
    timestamp: at(11, 50),
    icon: '/hungry-ananas.png',
    title: 'Plantenvoeding',
    description: 'De plantjes in jullie eco systeem staan te springen om met de voedingscyclus aan de slag te gaan. Maar jullie zelf beginnen misschien ook al een beetje honger te krijgen. Leg nog even de laatste hand aan je eco systeem en zorg dat je voor de volgende hint klaar bent!',
  },
  {
    timestamp: at(12, 30),
    icon: '/lunch-bag.png',
    title: 'Lunch tijd!',
    description: 'Het is tijd om lekker te gaan lunchen. Op naar de eettafel!',
  },
  {
    timestamp: at(13, 20),
    icon: '/creativity.png',
    title: 'Let\'s get creative',
    description: 'Heb je nog wat creativiteit over na vanmorgen? Laat die creatieve aap maar uit de mouw komen, want we gaan weer aan de slag. Eet nog even rustig je lunch op en zorg dat je voor de volgende hint weer terug bent onder de veranda.',
  },
  {
    timestamp: at(13, 30),
    icon: '/brush.png',
    title: 'Schilderen',
    description: 'Na Texel is het nu tijd voor het echte werk. Focus op je innerlijke Bob Ross, Piet Mondriaan of Vincent van Gogh om een prachtig kunstwerk te maken. Tip: zorg dat je tape altijd aan de rand van je doek zit.',
    link: { url: 'https://pin.it/eVl1Hcb', text: 'Ter inspiratie' },
    image: '/schilderen.jpg',
  },
  {
    timestamp: at(14, 45),
    icon: '/abstract-art.png',
    title: 'Tussenstand',
    description: 'Hoe gaat het met onze kunstenaars? Is het schilderij al bijna af of moet je nog beginnen met verven? Hoe dan ook, je bent lekker bezig. Pak er nog wat lekkers te drinken en een koekje bij en ga zo door!',
  },
  {
    timestamp: at(15, 30),
    icon: '/household.png',
    title: 'Tijd om op te ruimen',
    description: 'Wow! De schilderijen zijn echt mooi geworden. Waar hang jij \'m op? Tijd om de rotzooi op te ruimen. Probeer van je modderschoenen, verfschort, en vieze handen af te komen en zorg dat je voor de volgende hint klaar bent.',
    link: { url: 'https://www.youtube.com/watch?v=DkhjxJUm2Og', text: 'Muziekje erbij?!' }
  },
  {
    timestamp: at(15, 45),
    icon: '/boot.png',
    title: 'Schoenen aantrekken',
    description: 'Trek je schoenen aan en zorg dat je klaar bent om te gaan wandelen. Zorg dat je paraat staat voordat de volgende hint er is!',
  },
  {
    timestamp: at(15, 50),
    icon: '/route.png',
    title: 'Speurtocht',
    description: 'Jullie gaan op een speurtocht van 10 stappen. Als jullie alles goed doen, dan komen jullie aan op de goede bestemming. Houd de hints goed in de gaten en doe niet te lang over de opdrachten!',
  },
  {
    timestamp: at(15, 51),
    icon: '/walking.png',
    title: 'Stap 1',
    description: 'Sta met je rug naar het huis toe en draai naar rechts. Loop rechtdoor tot je iets treurigs tegen komt.',
  },
  {
    timestamp: at(15, 53),
    icon: '/willow.png',
    title: 'Stap 2',
    description: 'Maak nu een foto met de treurige boom. Tim is de fotograaf. Gebruik de boom als decor en zorg ervoor dat van de volgende lichaamsdelen maximaal het aantal wat ervoor staat te zien is: 4 benen, 3 armen, 1 elleboog, 1 knie, en iedereen z\'n gezicht. Zorg dat je klaar bent met deze opdracht voordat de volgende hint beschikbaar komt!',
  },
  {
    timestamp: at(15, 58),
    icon: '/walking.png',
    title: 'Stap 3',
    description: 'Ga nu met je rug naar \'t Vogelnest staan en loop in een rechte lijn langs het water rechtdoor totdat je niet meer rechtdoor kan. En sla daar dan rechtsaf.',
  },
  {
    timestamp: at(16, 2),
    icon: '/family.png',
    title: 'Stap 4',
    description: 'Ga op volgorde van klein naar lang staan en laat de voorste persoon een selfie maken, loop in die formatie parrallel aan de Goudseweg totdat je bijna een weg kruist.',
  },
  {
    timestamp: at(16, 6),
    icon: '/rainbow.png',
    title: 'Stap 5',
    description: 'Steek de weg over en zorg dat je vanaf daar op volgorde van lievelingskleur loopt. De regenboog bepaald de volgorde van de kleuren. Laat de voorste persoon een selfie maken terwijl je het voetpad uitloopt.',
  },
  {
    timestamp: at(16, 10),
    icon: '/walking.png',
    title: 'Stap 6',
    description: 'Ga daar overheen, waarna snachts kwart voor 1, geen wiel meer te vinden is. Staan ze open ga er onderdoor, zijn ze dicht wacht er dan even voor. Ga daarna stuurboord.',
  },
  {
    timestamp: at(16, 14),
    icon: '/baby.png',
    title: 'Stap 7',
    description: 'Daar waar het wonder geschieden van het geluk van jullie levens is waar jullie langs zullen lopen en een foto moeten maken. Zorg ervoor dat iedereen op de foto staat en het desbetreffende huis ook. Hoe mooier de gezichtsuitdrukking hoe beter.',
  },
  {
    timestamp: at(16, 19),
    icon: '/sailing.png',
    title: 'Stap 8',
    description: 'Loop naar daar waar het water oud is en ga bakboord.',
  },
  {
    timestamp: at(16, 25),
    icon: '/walking.png',
    title: 'Stap 9',
    description: 'Steek het water over en zoek de plant waar je thee van kunt maken.',
  },
  {
    timestamp: at(16, 30),
    icon: '/coin.png',
    title: 'Stap 10',
    description: 'Maak bij aankomst nog een laatste selfie om de feestvreugde vast te leggen. Veel plezier bij de Munt!',
    image: '/route-1.png'
  },
  {
    timestamp: at(16, 35),
    icon: '/cheers.png',
    title: 'Proost',
    description: 'Kies en lekker drankje van de kaart en een borrelplankje kan ook geen kwaad.',
  },
  {
    timestamp: at(17, 45),
    icon: '/beer.png',
    title: 'Laatste ronde',
    description: 'Drink je biertje lekker op en zorg dat jullie voor de volgende hint klaar zijn om naar huis te gaan.',
  },
  {
    timestamp: at(18, 0),
    icon: '/walking.png',
    title: 'Terug naar huis',
    description: 'Loop nu al lallend en zingend terug naar huis. Goede reis!',
  },
  {
    timestamp: at(18, 20),
    icon: '/home.png',
    title: 'Home sweet home',
    description: 'Ga even lekker languit op de bank liggen, terwijl het eten wordt bereid.',
  },
  {
    timestamp: at(19, 0),
    icon: '/burrito.png',
    title: 'Eet smakelijk',
    description: 'Op het menu voor vanavond staan een hoofdgerecht en een toetje. Voor het hoofdgerecht nodigen wij u uit om een eigen wrap samen te stellen met een verscheidenheid aan door top chefs bereide vullingen. Geniet van de heerlijke maaltijd en laat u verrassen door een uitzonderlijk toetje.',
  },
  {
    timestamp: at(20, 30),
    icon: '/night.png',
    title: 'De dag zit erop',
    description: 'Het programma voor vandaag zit erop. We hopen dat jullie een leuke dag hebben gehad. Ga vooral nog een potje idioten, saboteuren, of rummikubben. Tot volgende jaar, Simon en Marjolein.',
  },
];