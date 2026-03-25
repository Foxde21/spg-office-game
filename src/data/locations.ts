import type { LocationData, LocationId } from '../types/Location'

export const LOCATIONS: Record<LocationId, LocationData> = {
  'open-space': {
    id: 'open-space',
    name: 'Open Space',
    width: 1280,
    height: 720,
    backgroundColor: 0x2d2d44,
    doors: [
      {
        id: 'door-kitchen',
        x: 1200,
        y: 360,
        targetLocation: 'kitchen',
        spawnX: 100,
        spawnY: 360,
        label: 'Кухня',
      },
      {
        id: 'door-meeting',
        x: 640,
        y: 100,
        targetLocation: 'meeting-room',
        spawnX: 640,
        spawnY: 620,
        label: 'Переговорка',
      },
      {
        id: 'door-director',
        x: 80,
        y: 360,
        targetLocation: 'director-office',
        spawnX: 1200,
        spawnY: 360,
        label: 'Кабинет директора',
      },
    ],
    npcs: [
      {
        id: 'tim-lead',
        name: 'Тим Лид',
        role: 'Senior Developer',
        sprite: 'timlead',
        x: 532,
        y: 304,
        dialogues: [
          {
            id: 'intro',
            lines: [
              {
                speaker: 'Тим Лид',
                text: 'Привет, новенький! Добро пожаловать в команду.',
              },
              {
                speaker: 'Тим Лид',
                text: 'Твоя первая задача — найди документацию по проекту. Она в кабинете директора.',
                choices: [
                  { text: 'Понял, иду искать!', nextDialogue: 'accepted', startQuest: 'find-documentation', respectChange: 5 },
                  { text: 'А где искать?', nextDialogue: 'details' },
                ],
              },
            ],
          },
          {
            id: 'career-react-ai',
            lines: [
              {
                speaker: 'Тим Лид',
                text: 'AI? Круто. Тогда давай договоримся: сначала понимание задачи и данных, потом модели. И без магии — только измеримые улучшения.',
              },
            ],
          },
          {
            id: 'accepted',
            lines: [
              {
                speaker: 'Тим Лид',
                text: 'Отлично! Удачи. И не забудь выпить кофе — он бесплатный.',
              },
            ],
          },
          {
            id: 'details',
            lines: [
              {
                speaker: 'Тим Лид',
                text: 'Документация лежит на столе директора. Он сейчас занят, так что сможешь незаметно забрать.',
              },
              {
                speaker: 'Тим Лид',
                text: 'Дверь в кабинет слева. Удачи!',
                choices: [
                  { text: 'Понял, начинаю поиск!', startQuest: 'find-documentation', respectChange: 3 },
                ],
              },
            ],
          },
          {
            id: 'has-documentation',
            lines: [
              {
                speaker: 'Тим Лид',
                text: 'Ты нашёл документацию? Отличная работа!',
              },
              {
                speaker: 'Тим Лид',
                text: 'Это важный первый шаг. Продолжай в том же духе!',
              },
            ],
          },
        ],
      },
      {
        id: 'petya-senior',
        name: 'Петя Сеньор',
        role: 'Senior Developer',
        sprite: 'petya',
        x: 760,
        y: 304,
        dialogues: [
          {
            id: 'petya-intro',
            lines: [
              {
                speaker: 'Петя Сеньор',
                text: 'Ну, что, живой ещё? Если хочешь расти — расти головой, а не переработками.',
              },
            ],
          },
          {
            id: 'career-choice-ai',
            lines: [
              {
                speaker: 'Петя Сеньор',
                text: 'Слушай, я тут заметил — у тебя неплохо идёт. Есть один вопрос... Ты задумывался, куда хочешь расти?',
              },
              {
                speaker: 'Петя Сеньор',
                text: 'Ну так что?',
                choices: [
                  {
                    text: 'Мне интересен AI — хочу разбираться в машинном обучении',
                    action: 'setFlag:careerPathChosen;setCareerPath:ai',
                    nextDialogue: 'career-choice-ai-confirm'
                  },
                  {
                    text: 'Посмотреть другие пути',
                    action: 'describeCareerPaths'
                  },
                  {
                    text: 'Пока не определился...',
                    nextDialogue: 'career-choice-undecided'
                  }
                ],
              },
            ],
          },
          {
            id: 'career-choice-ai-confirm',
            lines: [
              {
                speaker: 'Петя Сеньор',
                text: 'О, вот это по-взрослому. AI — отличный выбор. Мне нравится. Давай, я тебе помогу собрать нормальный маршрут — без суеты и без выгорания.',
              },
            ],
          },
          {
            id: 'career-choice-undecided',
            lines: [
              {
                speaker: 'Петя Сеньор',
                text: 'Нормально. Только смотри: если будешь "просто делать задачи" — тебя так и будут повышать по инерции. Медленно и больно.',
              },
              {
                speaker: 'Петя Сеньор',
                text: 'С AI сейчас проще всего набрать вес. Это не про хайп — это про то, что тебя начинают слушать. Хочешь, покажу, куда можно зайти?',
                choices: [
                  {
                    text: 'Посмотреть другие пути',
                    action: 'describeCareerPaths'
                  },
                  {
                    text: 'Не сейчас, потом',
                    nextDialogue: 'career-choice-later'
                  }
                ],
              },
            ],
          },
          {
            id: 'career-choice-later',
            lines: [
              {
                speaker: 'Петя Сеньор',
                text: 'Окей. Только не тяни: выберешь направление — и качаться будет проще. Созреешь — подходи.',
              },
            ],
          },
          {
            id: 'career-react-ai',
            lines: [
              {
                speaker: 'Петя Сеньор',
                text: 'AI — тема мощная. Только не пытайся "впихнуть" модель туда, где хватит правила. Договорились?',
              },
              {
                speaker: 'Петя Сеньор',
                text: 'Хочешь небольшой ассесмент? Пара вопросов, и станет понятнее, что качать дальше.',
                choices: [
                  {
                    text: 'Давай',
                    action: 'openAssessmentDomainSelect'
                  },
                  {
                    text: 'Не сегодня',
                    nextDialogue: 'petya-intro'
                  }
                ]
              },
              {
                speaker: 'Петя Сеньор',
                text: 'Окей. Если захочешь — подходи снова.',
              },
            ],
          },
        ],
      },
    ],
    items: [
      {
        x: 300,
        y: 500,
        data: {
          id: 'energy-drink',
          name: 'Энергетик',
          description: 'Бодрит! Но потом будет хуже...',
          sprite: 'item',
          type: 'consumable',
          usable: true,
          effects: { stress: -25 },
        },
      },
    ],
  },

  'kitchen': {
    id: 'kitchen',
    name: 'Кухня',
    width: 1280,
    height: 720,
    backgroundColor: 0x3d3d54,
    doors: [
      {
        id: 'door-openspace',
        x: 100,
        y: 360,
        targetLocation: 'open-space',
        spawnX: 1200,
        spawnY: 360,
        label: 'Open Space',
      },
    ],
    npcs: [],
    items: [
      {
        x: 640,
        y: 400,
        data: {
          id: 'coffee-cup',
          name: 'Кофе',
          description: 'Горячий кофе. Снижает стресс.',
          sprite: 'item',
          type: 'consumable',
          usable: true,
          effects: { stress: -15 },
        },
      },
    ],
  },

  'meeting-room': {
    id: 'meeting-room',
    name: 'Переговорка',
    width: 1280,
    height: 720,
    backgroundColor: 0x2d4454,
    doors: [
      {
        id: 'door-openspace',
        x: 640,
        y: 620,
        targetLocation: 'open-space',
        spawnX: 640,
        spawnY: 100,
        label: 'Open Space',
      },
    ],
    npcs: [
      {
        id: 'anna-hr',
        name: 'Анна HR',
        role: 'HR Manager',
        sprite: 'hr',
        x: 400,
        y: 312,
        dialogues: [
          {
            id: 'hr-intro',
            lines: [
              {
                speaker: 'Анна HR',
                text: 'Привет! Я Анна, HR-менеджер. Если будут вопросы по отпуску — обращайся.',
              },
              {
                speaker: 'Анна HR',
                text: 'Как ты себя чувствуешь? Не слишком много стресса?',
                choices: [
                  { text: 'Всё отлично, спасибо!', nextDialogue: 'hr-good', respectChange: 5 },
                  { text: 'Если честно, немного устал...', nextDialogue: 'hr-tired', stressChange: -10 },
                  { text: 'Я в порядке (ложь)', nextDialogue: 'hr-lie', stressChange: 10 },
                ],
              },
            ],
          },
          {
            id: 'hr-good',
            lines: [
              {
                speaker: 'Анна HR',
                text: 'Отлично! Продолжай в том же духе! 🌟',
              },
            ],
          },
          {
            id: 'hr-tired',
            lines: [
              {
                speaker: 'Анна HR',
                text: 'Понимаю. Не забывай делать перерывы и пить кофе.',
              },
              {
                speaker: 'Анна HR',
                text: 'Можешь взять отгул, если нужно. Береги себя!',
              },
            ],
          },
          {
            id: 'hr-lie',
            lines: [
              {
                speaker: 'Анна HR',
                text: 'Хм... Ладно, но если что — приходи.',
              },
              {
                speaker: 'Анна HR',
                text: '(Про себя) Надо будет присмотреть за ним...',
              },
            ],
          },
        ],
      },
    ],
    items: [],
  },

  'director-office': {
    id: 'director-office',
    name: 'Кабинет директора',
    width: 1280,
    height: 720,
    backgroundColor: 0x4d4d64,
    doors: [
      {
        id: 'door-openspace',
        x: 1200,
        y: 360,
        targetLocation: 'open-space',
        spawnX: 80,
        spawnY: 360,
        label: 'Open Space',
      },
    ],
    npcs: [
      {
        id: 'director',
        name: 'Директор',
        role: 'CEO',
        sprite: 'timlead',
        x: 640,
        y: 160,
        dialogues: [
          {
            id: 'director-intro',
            lines: [
              {
                speaker: 'Директор',
                text: 'А, новенький! Слышал о тебе. Показывай себя.',
              },
              {
                speaker: 'Директор',
                text: 'У нас тут проект горит. Надеюсь, ты не боишься сложных задач?',
                choices: [
                  { text: 'Готов к любым вызовам!', respectChange: 10 },
                  { text: 'Постараюсь справиться...', respectChange: 5 },
                ],
              },
            ],
          },
        ],
      },
    ],
    items: [
      {
        x: 1000,
        y: 300,
        data: {
          id: 'secret-docs',
          name: 'Секретные документы',
          description: 'Документы с планами компании. Квестовый предмет.',
          sprite: 'item',
          type: 'quest',
          usable: false,
        },
      },
      {
        x: 550,
        y: 250,
        data: {
          id: 'documentation',
          name: 'Документация',
          description: 'Документация по проекту. Квестовый предмет.',
          sprite: 'item',
          type: 'quest',
          usable: false,
        },
      },
    ],
  },
}

export const STARTING_LOCATION: LocationId = 'open-space'
export const STARTING_POSITION = { x: 469, y: 560 }
