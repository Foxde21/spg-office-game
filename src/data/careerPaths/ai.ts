import type { CareerPath } from '../../types/assessment'

const ML_FUNDAMENTALS_QUESTIONS = {
  junior: [
    {
      id: 'ai-ml-fun-01',
      scenario: 'Продукт просит выбрать подход для предсказания оттока клиентов. Есть таблица: 10 000 строк с полями (дата контракта, сумма, регион, количество обращений в поддержку).',
      question: 'Какой тип обучения выберешь?',
      choices: [
        {
          id: 'a',
          text: '"Кластеризация — разобьём клиентов на группы без меток."',
          score: 20,
          feedback: 'Петя качает головой: "У нас же есть целевая переменная — ушёл/остался. Это задача с учителем."',
          competencyTags: ['supervised', 'unsupervised']
        },
        {
          id: 'b',
          text: '"Supervised learning: обучаем по историческим данным с меткой оттока."',
          score: 100,
          feedback: 'Петя кивает: "Верно. Предсказание по известным исходам — классика supervised."',
          competencyTags: ['supervised', 'classification']
        },
        {
          id: 'c',
          text: '"Reinforcement learning — клиент получает награду за то, что остаётся."',
          score: 15,
          feedback: 'Петя хмыкает: "RL тут из пушки по воробьям. Обычная классификация по таблице."',
          competencyTags: ['supervised', 'reinforcement']
        },
        {
          id: 'd',
          text: '"Сначала кластеризация, потом на каждый кластер — отдельная модель."',
          score: 55,
          feedback: 'Петя: "Иногда так делают, но для старта достаточно одной supervised-модели на всех."',
          competencyTags: ['supervised', 'unsupervised', 'clustering']
        }
      ],
      explanation: 'Предсказание оттока по таблице с меткой (ушёл/остался) — задача классификации с учителем (supervised).',
      domainId: 'ml-fundamentals',
      difficulty: 1 as const
    },
    {
      id: 'ai-ml-fun-02',
      scenario: 'Ты обучил модель детекции мошенничества. Accuracy на тесте — 95%. В данных 99% транзакций — легитимные, 1% — мошенничество.',
      question: 'Доволен ли ты метрикой?',
      choices: [
        {
          id: 'a',
          text: '"Да, 95% — отличный результат, можно в прод."',
          score: 0,
          feedback: 'Петя вздыхает: "Модель может просто предсказывать «не мошенничество» всем — и получишь 99% accuracy. Но мошенников не поймаешь."',
          competencyTags: ['class-imbalance', 'metrics']
        },
        {
          id: 'b',
          text: '"Нет. При таком дисбалансе нужны precision, recall и F1 по классу мошенничества."',
          score: 95,
          feedback: 'Петя одобрительно: "Именно. Accuracy вводит в заблуждение при сильном дисбалансе."',
          competencyTags: ['class-imbalance', 'precision', 'recall', 'f1']
        },
        {
          id: 'c',
          text: '"Нужно уравнять классы — дублировать мошеннические примеры."',
          score: 50,
          feedback: 'Петя: "Оверсэмплинг — один из приёмов, но сначала выбери адекватные метрики."',
          competencyTags: ['class-imbalance', 'oversampling']
        },
        {
          id: 'd',
          text: '"Устроит, если бизнес согласен с 5% ошибок."',
          score: 25,
          feedback: 'Петя: "5% ошибок — это про все предсказания. При 1% мошенников ошибки в основном по минорному классу."',
          competencyTags: ['class-imbalance', 'metrics']
        }
      ],
      explanation: 'При сильном дисбалансе классов accuracy не отражает качество по минорному классу. Важны precision/recall/F1 по целевому классу.',
      domainId: 'ml-fundamentals',
      difficulty: 1 as const
    },
    {
      id: 'ai-ml-fun-03',
      scenario: 'Ты пришёл на новый проект. Коллега обучил модель предсказания оттока клиентов. Хвастается: accuracy на обучающей выборке — 99.2%, на тестовой — 62.1%.',
      question: 'Что скажешь коллеге?',
      choices: [
        {
          id: 'a',
          text: '"Отличный результат на трейне! Давай деплоить."',
          score: 0,
          feedback: 'Петя Сеньор вздыхает: "Ты серьёзно? 99% на трейне и 62% на тесте — это же учебник по переобучению..."',
          competencyTags: ['overfitting']
        },
        {
          id: 'b',
          text: '"Похоже на переобучение. Попробуй регуляризацию или уменьши сложность модели."',
          score: 80,
          feedback: 'Петя кивает: "Верно, классический overfitting. Регуляризация — хорошее начало."',
          competencyTags: ['overfitting', 'regularization']
        },
        {
          id: 'c',
          text: '"Переобучение. Я бы начал с cross-validation, посмотрел learning curves, проверил data leakage и уже потом решал."',
          score: 100,
          feedback: 'Петя поднимает бровь: "О, а ты шаришь. Сначала диагностика, потом лечение."',
          competencyTags: ['overfitting', 'cross-validation', 'data-leakage', 'regularization']
        },
        {
          id: 'd',
          text: '"Нужно больше данных, и всё будет ок."',
          score: 25,
          feedback: 'Петя хмыкает: "Больше данных — не всегда ответ. Тут явный overfitting."',
          competencyTags: ['overfitting']
        }
      ],
      explanation: 'Разница между accuracy на трейне (99%) и тесте (62%) — классический признак переобучения.',
      domainId: 'ml-fundamentals',
      difficulty: 1 as const
    }
  ],
  middle: [
    {
      id: 'ai-ml-fun-04',
      scenario: 'Команда внедряет ML-модель для скрининга на рак по снимкам. Ложноположительный результат — лишнее обследование. Пропуск болезни — риск для пациента.',
      question: 'Что важнее настраивать: precision или recall по классу «рак»?',
      choices: [
        {
          id: 'a',
          text: '"Precision — меньше лишних обследований."',
          score: 30,
          feedback: 'Петя: "В медицине пропуск болезни часто критичнее. Recall по положительному классу обычно приоритетнее."',
          competencyTags: ['precision', 'recall', 'medical-ml']
        },
        {
          id: 'b',
          text: '"Recall — нельзя пропустить больного, лучше перепроверить."',
          score: 90,
          feedback: 'Петя: "Верно. Для скрининга типично жертвовать precision ради recall по заболеванию."',
          competencyTags: ['recall', 'precision', 'medical-ml', 'critical-applications']
        },
        {
          id: 'c',
          text: '"Одинаково, смотрю на F1."',
          score: 40,
          feedback: 'Петя: "F1 не учитывает разную цену ошибок. Нужен явный приоритет и порог под него."',
          competencyTags: ['f1', 'metrics']
        },
        {
          id: 'd',
          text: '"Зависит от решения врача: модель только подсказка, итог за человеком."',
          score: 60,
          feedback: 'Петя: "Человек в петле — да, но порог модели всё равно надо выбирать осознанно."',
          competencyTags: ['human-in-the-loop', 'threshold']
        }
      ],
      explanation: 'В критичных медицинских задачах пропуск положительного случая (низкий recall) часто недопустим, поэтому recall по классу болезни приоритетнее.',
      domainId: 'ml-fundamentals',
      difficulty: 2 as const
    },
    {
      id: 'ai-ml-fun-05',
      scenario: 'В датасете 50 фичей. Есть подозрение, что многие — шум или дублируют друг друга. Время обучения и интерпретируемость страдают.',
      question: 'Как подойдёшь к отбору признаков?',
      choices: [
        {
          id: 'a',
          text: '"Оставлю все 50 — больше данных лучше."',
          score: 10,
          feedback: 'Петя: "Лишние фичи усиливают переобучение и шум. Отбор нужен."',
          competencyTags: ['feature-selection']
        },
        {
          id: 'b',
          text: '"Корреляционная матрица + рекурсивное исключение или L1 (Lasso)."',
          score: 85,
          feedback: 'Петя: "Нормальный план: мультиколлинеарность и важность через регуляризацию или RFE."',
          competencyTags: ['feature-selection', 'lasso', 'rfe', 'correlation']
        },
        {
          id: 'c',
          text: '"PCA — сокращу до 10 компонент и всё."',
          score: 45,
          feedback: 'Петя: "PCA даёт новые признаки, а не отбор. Для интерпретируемости лучше явный feature selection."',
          competencyTags: ['pca', 'feature-selection']
        },
        {
          id: 'd',
          text: '"Permutation importance или SHAP после обучения модели."',
          score: 80,
          feedback: 'Петя: "Да, post-hoc важность полезна. Можно комбинировать с фильтрами до обучения."',
          competencyTags: ['feature-importance', 'shap', 'interpretability']
        }
      ],
      explanation: 'Feature selection снижает шум и переобучение. Используют корреляции, L1, RFE, permutation importance или SHAP.',
      domainId: 'ml-fundamentals',
      difficulty: 2 as const
    },
    {
      id: 'ai-ml-fun-06',
      scenario: 'Стейкхолдер спрашивает: «Почему модель отклонила заявку этого клиента?» Модель — gradient boosting (деревья).',
      question: 'Что предложишь для объяснения решений?',
      choices: [
        {
          id: 'a',
          text: '"Модель — чёрный ящик, объяснить нельзя."',
          score: 0,
          feedback: 'Петя: "У GBM есть feature importance и пошаговые разложения — не чёрный ящик."',
          competencyTags: ['interpretability']
        },
        {
          id: 'b',
          text: '"SHAP или feature importance + разбор пути по дереву для конкретного кейса."',
          score: 95,
          feedback: 'Петя: "Верно. SHAP даёт вклад каждой фичи по объекту, плюс можно показать путь по деревьям."',
          competencyTags: ['interpretability', 'shap', 'explainability']
        },
        {
          id: 'c',
          text: '"Заменим на линейную модель — она интерпретируема."',
          score: 40,
          feedback: 'Петя: "Линейная модель слабее. Сначала попробуй SHAP/LIME для GBM."',
          competencyTags: ['interpretability', 'linear-model']
        },
        {
          id: 'd',
          text: '"Выведу только вероятность и порог."',
          score: 25,
          feedback: 'Петя: "Этого мало для «почему именно этот клиент». Нужны вклады признаков."',
          competencyTags: ['interpretability']
        }
      ],
      explanation: 'Для деревьев и GBM используют SHAP, LIME или разбор пути по дереву для объяснения отдельного предсказания.',
      domainId: 'ml-fundamentals',
      difficulty: 2 as const
    }
  ],
  senior: [
    {
      id: 'ai-ml-fun-07',
      scenario: 'Нужно обучить модель на данных из пяти стран. Распределения фичей и долей целевой переменной сильно отличаются по странам.',
      question: 'Как будешь решать проблему разницы распределений?',
      choices: [
        {
          id: 'a',
          text: '"Обучаю на объединённой выборке — модель сама подстроится."',
          score: 25,
          feedback: 'Петя: "При сильном domain shift доминирующая страна перетянет модель, остальные пострадают."',
          competencyTags: ['domain-shift']
        },
        {
          id: 'b',
          text: '"Доменные признаки (страна/регион) + взвешивание или отдельные слой/головы под домен."',
          score: 90,
          feedback: 'Петя: "Да. Явный учёт домена и взвешивание или адаптация под домен — стандартный подход."',
          competencyTags: ['domain-shift', 'domain-adaptation', 'weighting']
        },
        {
          id: 'c',
          text: '"Обучаю только на самой большой стране."',
          score: 15,
          feedback: 'Петя: "Тогда в других странах качество может быть непредсказуемым."',
          competencyTags: ['domain-shift']
        },
        {
          id: 'd',
          text: '"Нормализую фичи по странам отдельно."',
          score: 50,
          feedback: 'Петя: "Нормализация помогает, но не снимает сдвиг распределений цели. Нужен учёт домена."',
          competencyTags: ['domain-shift', 'normalization']
        }
      ],
      explanation: 'При разнице распределений (domain shift) нужен явный учёт домена: фичи домена, взвешивание или доменная адаптация.',
      domainId: 'ml-fundamentals',
      difficulty: 3 as const
    },
    {
      id: 'ai-ml-fun-08',
      scenario: 'Модель в проде через два месяца стала работать хуже. На отложенном тесте при разработке метрики были хорошие.',
      question: 'Что, скорее всего, произошло?',
      choices: [
        {
          id: 'a',
          text: '"Код деплоя сломался — откатываем релиз."',
          score: 20,
          feedback: 'Петя: "Сначала проверь данные и распределения. Часто дело в дрейфе, а не в коде."',
          competencyTags: ['data-drift']
        },
        {
          id: 'b',
          text: '"Data drift: распределение входящих данных или целевой переменной изменилось."',
          score: 95,
          feedback: 'Петя: "Верно. Проверь стабильность фичей и целевой переменной во времени, мониторинг дрейфа."',
          competencyTags: ['data-drift', 'monitoring', 'concept-drift']
        },
        {
          id: 'c',
          text: '"Модель переобучилась на проде."',
          score: 10,
          feedback: 'Петя: "В проде модель не дообучают. Переобучение было бы ещё на этапе разработки."',
          competencyTags: ['overfitting']
        },
        {
          id: 'd',
          text: '"Нужно чаще переобучать модель на свежих данных."',
          score: 70,
          feedback: 'Петя: "Ретрен — часть решения, но сначала зафиксируй причину: дрейф, смена процесса, смена метрик."',
          competencyTags: ['data-drift', 'retraining']
        }
      ],
      explanation: 'Деградация в проде при хорошем тесте чаще всего связана с data drift или concept drift — меняются распределения или связь признаков с целью.',
      domainId: 'ml-fundamentals',
      difficulty: 3 as const
    },
    {
      id: 'ai-ml-fun-09',
      scenario: 'Команда спорит: ансамбль из 10 моделей против одной сложной модели (глубокой сети). Тебя просят рассудить.',
      question: 'Что скажешь?',
      choices: [
        {
          id: 'a',
          text: '"Одна сложная модель всегда лучше — меньше поддержки."',
          score: 25,
          feedback: 'Петя: "Не всегда. Ансамбли часто выигрывают за счёт снижения дисперсии и разнообразия."',
          competencyTags: ['bias-variance', 'ensemble']
        },
        {
          id: 'b',
          text: '"Ансамбль снижает дисперсию и часто стабильнее; сложная модель — выше ёмкость, риск переобучения."',
          score: 95,
          feedback: 'Петя: "Да. Trade-off bias–variance и сложность поддержки — ключевые аргументы."',
          competencyTags: ['bias-variance', 'ensemble', 'overfitting']
        },
        {
          id: 'c',
          text: '"Решаем A/B-тестом на продакшене."',
          score: 55,
          feedback: 'Петя: "A/B полезен для финального выбора, но аргументы про bias-variance и латентность должны быть учтены до этого."',
          competencyTags: ['ab-test', 'experiment']
        },
        {
          id: 'd',
          text: '"Зависит от данных — при малых данных ансамбль, при больших — глубокая сеть."',
          score: 65,
          feedback: 'Петя: "Упрощение, но направление верное. Плюс учитываем латентность и стоимость инференса."',
          competencyTags: ['bias-variance', 'data-size']
        }
      ],
      explanation: 'Ансамбли уменьшают дисперсию; одна сложная модель даёт большую ёмкость, но выше риск переобучения. Выбор зависит от данных, латентности и операционных затрат.',
      domainId: 'ml-fundamentals',
      difficulty: 3 as const
    }
  ],
  architect: [
    {
      id: 'ai-ml-fun-10',
      scenario: 'Нужно спроектировать ML-платформу для команды из 20 data scientists: эксперименты, обучение, деплой, мониторинг.',
      question: 'Какие компоненты предложишь?',
      choices: [
        {
          id: 'a',
          text: '"Достаточно Jupyter + скриптов деплоя и общего диска."',
          score: 15,
          feedback: 'Петя: "Для 20 человек нужны версионирование экспериментов, воспроизводимость, очереди и мониторинг."',
          competencyTags: ['ml-platform']
        },
        {
          id: 'b',
          text: '"Experiment tracking (MLflow/Weights), feature store, pipeline/orchestration, model registry, serving, мониторинг."',
          score: 95,
          feedback: 'Петя: "Да. Эксперименты, фичи, пайплайны, реестр моделей и сервинг с мониторингом — база платформы."',
          competencyTags: ['ml-platform', 'mlflow', 'feature-store', 'model-registry']
        },
        {
          id: 'c',
          text: '"Только Kubernetes и Docker — DS сами развернут что нужно."',
          score: 30,
          feedback: 'Петя: "Инфраструктура нужна, но без experiment tracking и воспроизводимости будет хаос."',
          competencyTags: ['ml-platform', 'kubernetes']
        },
        {
          id: 'd',
          text: '"Один общий сервер с GPU и общая база моделей."',
          score: 25,
          feedback: 'Петя: "Нет изоляции экспериментов, версий и воспроизводимости. Нужна платформа, а не один сервер."',
          competencyTags: ['ml-platform']
        }
      ],
      explanation: 'ML-платформа для команды обычно включает experiment tracking, feature store, пайплайны, model registry, сервинг и мониторинг.',
      domainId: 'ml-fundamentals',
      difficulty: 4 as const
    },
    {
      id: 'ai-ml-fun-11',
      scenario: 'CTO ставит цель: сократить время от эксперимента до прода с 3 месяцев до 2 недель.',
      question: 'Как будешь выстраивать стратегию?',
      choices: [
        {
          id: 'a',
          text: '"Будем деплоить каждую модель сразу после обучения."',
          score: 20,
          feedback: 'Петя: "Без пайплайнов, тестов и мониторинга это риск. Нужна автоматизация и контроль качества."',
          competencyTags: ['mlops']
        },
        {
          id: 'b',
          text: '"Автоматизация пайплайнов (train → validate → register → deploy), CI/CD для моделей, feature store, мониторинг."',
          score: 95,
          feedback: 'Петя: "Верно. MLOps: пайплайны, реестр, контролируемый деплой и мониторинг дрейфа и метрик."',
          competencyTags: ['mlops', 'cicd', 'pipeline', 'monitoring']
        },
        {
          id: 'c',
          text: '"Нанять больше инженеров под ручной деплой."',
          score: 10,
          feedback: 'Петя: "Масштаб не решается только людьми. Нужна автоматизация и стандартизация."',
          competencyTags: ['mlops']
        },
        {
          id: 'd',
          text: '"Сократим объём тестов и ревью перед релизом."',
          score: 15,
          feedback: 'Петя: "Рискованно. Лучше автоматизировать тесты и ревью, а не убирать их."',
          competencyTags: ['mlops', 'testing']
        }
      ],
      explanation: 'Сокращение time-to-production достигается за счёт MLOps: автоматизированные пайплайны, реестр моделей, CI/CD и мониторинг.',
      domainId: 'ml-fundamentals',
      difficulty: 4 as const
    },
    {
      id: 'ai-ml-fun-12',
      scenario: 'Регулятор требует объяснять каждое решение модели в кредитном скоринге. Нужно спроектировать решение.',
      question: 'Как спроектируешь систему объяснимости и соответствия?',
      choices: [
        {
          id: 'a',
          text: '"Используем только линейную регрессию — коэффициенты и есть объяснение."',
          score: 50,
          feedback: 'Петя: "Работает для регулятора, но качество может проиграть. Можно рассмотреть GBM + SHAP как альтернативу."',
          competencyTags: ['explainability', 'compliance']
        },
        {
          id: 'b',
          text: '"Модель + обязательный слой объяснений (SHAP/LIME) на каждый ответ, логирование и аудит решений."',
          score: 95,
          feedback: 'Петя: "Да. Объяснение на каждый кейс, хранение и возможность аудита — стандарт для регуляторики."',
          competencyTags: ['explainability', 'shap', 'lime', 'compliance', 'audit']
        },
        {
          id: 'c',
          text: '"Регулятору отдаём только общее описание модели, без пошаговых объяснений."',
          score: 25,
          feedback: 'Петя: "Часто требуют объяснение по каждому решению. Уточни требования регулятора."',
          competencyTags: ['compliance']
        },
        {
          id: 'd',
          text: '"Делаем две системы: точную модель внутри, упрощённую для объяснений снаружи."',
          score: 60,
          feedback: 'Петя: "Surrogate-модели возможны, но регулятор может спросить соответствие реальной модели. Прозрачность лучше."',
          competencyTags: ['explainability', 'surrogate']
        }
      ],
      explanation: 'Для регуляторики нужны пошаговые объяснения решений (например, SHAP/LIME), логирование и возможность аудита.',
      domainId: 'ml-fundamentals',
      difficulty: 4 as const
    }
  ]
}

function stubDomain(
  id: string,
  name: string,
  description: string,
  careerPathId: string
) {
  return {
    id,
    name,
    description,
    icon: 'domain',
    careerPathId,
    topics: []
  }
}

export const AI_CAREER_PATH: CareerPath = {
  id: 'ai',
  name: 'AI & Machine Learning',
  description: 'Карьерный путь в машинном обучении и AI: от основ ML до проектирования платформ и MLOps.',
  icon: 'ai',
  levels: [
    { id: 'ai-junior', title: 'AI Junior', minAvgScore: 0, minDomainScore: 0 },
    { id: 'ai-middle', title: 'AI Middle', minAvgScore: 50, minDomainScore: 30 },
    { id: 'ai-senior', title: 'AI Senior', minAvgScore: 70, minDomainScore: 50 },
    { id: 'ai-architect', title: 'AI Architect', minAvgScore: 85, minDomainScore: 70 }
  ],
  domains: [
    {
      id: 'ml-fundamentals',
      name: 'Основы машинного обучения',
      description: 'Supervised/unsupervised, метрики, переобучение, интерпретируемость, дрейф, ансамбли.',
      icon: 'ml',
      careerPathId: 'ai',
      topics: [
        { id: 'ml-junior', name: 'Базовый уровень', level: 'ai-junior', questions: ML_FUNDAMENTALS_QUESTIONS.junior },
        { id: 'ml-middle', name: 'Средний уровень', level: 'ai-middle', questions: ML_FUNDAMENTALS_QUESTIONS.middle },
        { id: 'ml-senior', name: 'Продвинутый уровень', level: 'ai-senior', questions: ML_FUNDAMENTALS_QUESTIONS.senior },
        { id: 'ml-architect', name: 'Архитектурный уровень', level: 'ai-architect', questions: ML_FUNDAMENTALS_QUESTIONS.architect }
      ]
    },
    stubDomain('data-engineering', 'Инженерия данных', 'ETL, пайплайны данных, хранилища.', 'ai'),
    stubDomain('deep-learning', 'Глубокое обучение', 'Нейросети, оптимизация, регуляризация.', 'ai'),
    stubDomain('nlp-llms', 'NLP и большие языковые модели', 'Тексты, эмбеддинги, LLM.', 'ai'),
    stubDomain('computer-vision', 'Компьютерное зрение', 'Классификация и детекция на изображениях.', 'ai'),
    stubDomain('mlops', 'MLOps и деплой моделей', 'Деплой, мониторинг, пайплайны.', 'ai'),
    stubDomain('system-design', 'Проектирование AI-систем', 'Архитектура ML-систем и платформ.', 'ai'),
    stubDomain('ai-ethics', 'Этика и безопасность AI', 'Смещение, честность, границы применения.', 'ai')
  ],
  npcAssessors: [
    { npcId: 'petya-senior', domainIds: ['ml-fundamentals', 'data-engineering', 'deep-learning', 'mlops', 'system-design'] },
    { npcId: 'masha-qa', domainIds: ['ml-fundamentals', 'mlops'] },
    { npcId: 'olga-product', domainIds: ['ml-fundamentals', 'ai-ethics'] },
    { npcId: 'professor-neuronov', domainIds: ['ml-fundamentals', 'deep-learning', 'nlp-llms', 'computer-vision', 'ai-ethics'] }
  ],
  unlockCondition: { minRespect: 20 }
}
