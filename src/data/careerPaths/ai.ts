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
          competencyTags: ['supervised', 'unsupervised', 'process.sdlc']
        },
        {
          id: 'b',
          text: '"Supervised learning: обучаем по историческим данным с меткой оттока."',
          score: 100,
          feedback: 'Петя кивает: "Верно. Предсказание по известным исходам — классика supervised."',
          competencyTags: ['supervised', 'classification', 'quality']
        },
        {
          id: 'c',
          text: '"Reinforcement learning — клиент получает награду за то, что остаётся."',
          score: 15,
          feedback: 'Петя хмыкает: "RL тут из пушки по воробьям. Обычная классификация по таблице."',
          competencyTags: ['supervised', 'reinforcement', 'documentation']
        },
        {
          id: 'd',
          text: '"Сначала кластеризация, потом на каждый кластер — отдельная модель."',
          score: 55,
          feedback: 'Петя: "Иногда так делают, но для старта достаточно одной supervised-модели на всех."',
          competencyTags: ['supervised', 'unsupervised', 'clustering', 'autonomy']
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
          competencyTags: ['class-imbalance', 'metrics', 'quality']
        },
        {
          id: 'b',
          text: '"Нет. При таком дисбалансе нужны precision, recall и F1 по классу мошенничества."',
          score: 95,
          feedback: 'Петя одобрительно: "Именно. Accuracy вводит в заблуждение при сильном дисбалансе."',
          competencyTags: ['class-imbalance', 'precision', 'recall', 'f1', 'process.sdlc']
        },
        {
          id: 'c',
          text: '"Нужно уравнять классы — дублировать мошеннические примеры."',
          score: 50,
          feedback: 'Петя: "Оверсэмплинг — один из приёмов, но сначала выбери адекватные метрики."',
          competencyTags: ['class-imbalance', 'oversampling', 'autonomy']
        },
        {
          id: 'd',
          text: '"Устроит, если бизнес согласен с 5% ошибок."',
          score: 25,
          feedback: 'Петя: "5% ошибок — это про все предсказания. При 1% мошенников ошибки в основном по минорному классу."',
          competencyTags: ['class-imbalance', 'metrics', 'documentation']
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
          competencyTags: ['overfitting', 'quality']
        },
        {
          id: 'b',
          text: '"Похоже на переобучение. Попробуй регуляризацию или уменьши сложность модели."',
          score: 80,
          feedback: 'Петя кивает: "Верно, классический overfitting. Регуляризация — хорошее начало."',
          competencyTags: ['overfitting', 'regularization', 'autonomy']
        },
        {
          id: 'c',
          text: '"Переобучение. Я бы начал с cross-validation, посмотрел learning curves, проверил data leakage и уже потом решал."',
          score: 100,
          feedback: 'Петя поднимает бровь: "О, а ты шаришь. Сначала диагностика, потом лечение."',
          competencyTags: ['overfitting', 'cross-validation', 'data-leakage', 'regularization', 'process.sdlc']
        },
        {
          id: 'd',
          text: '"Нужно больше данных, и всё будет ок."',
          score: 25,
          feedback: 'Петя хмыкает: "Больше данных — не всегда ответ. Тут явный overfitting."',
          competencyTags: ['overfitting', 'documentation']
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

const DEEP_LEARNING_QUESTIONS = {
  junior: [
    {
      id: 'ai-dl-01',
      scenario: 'У тебя задача классификации изображений. На трейне точность 99%, на валидации 70%. Данных мало, модель глубокая.',
      question: 'Какое первое объяснение и что сделаешь?',
      choices: [
        {
          id: 'a',
          text: '"Всё ок, просто нужно ещё обучать больше эпох."',
          score: 10,
          feedback: 'Петя: "Похоже на переобучение. Больше эпох обычно усугубит."',
          competencyTags: ['quality']
        },
        {
          id: 'b',
          text: '"Переобучение. Попробую аугментации, регуляризацию, dropout и уменьшу модель."',
          score: 95,
          feedback: 'Петя кивает: "Да. Для маленьких датасетов это базовый набор."',
          competencyTags: ['autonomy']
        },
        {
          id: 'c',
          text: '"Надо сменить задачу: сделаем кластеризацию вместо классификации."',
          score: 0,
          feedback: 'Петя: "Задача не поменялась. Нужно лечить generalization."',
          competencyTags: ['documentation']
        },
        {
          id: 'd',
          text: '"Начну с проверки утечки данных и корректности разбиения train/val."',
          score: 80,
          feedback: 'Петя: "Хорошо. Диагностика утечек — обязательный шаг."',
          competencyTags: ['process.sdlc']
        }
      ],
      explanation: 'Разница между train и val метриками часто означает переобучение или проблемы с разбиением/утечкой данных. Помогают аугментации и регуляризация.',
      domainId: 'deep-learning',
      difficulty: 1 as const
    },
    {
      id: 'ai-dl-02',
      scenario: 'Ты обучаешь нейросеть, loss на трейне падает, но accuracy почти не растёт. В логе видно, что learning rate = 0.1 для Adam.',
      question: 'Что скажешь?',
      choices: [
        {
          id: 'a',
          text: '"0.1 — нормально, Adam сам адаптирует шаг."',
          score: 10,
          feedback: 'Петя: "Для Adam 0.1 часто слишком много. Можно улететь в нестабильность."',
          competencyTags: ['quality']
        },
        {
          id: 'b',
          text: '"Скорее всего learning rate слишком высокий. Попробую 1e-3/1e-4 и scheduler."',
          score: 95,
          feedback: 'Петя: "Да. LR — один из первых рычагов."',
          competencyTags: ['autonomy']
        },
        {
          id: 'c',
          text: '"Нужно убрать валидацию, она мешает обучению."',
          score: 0,
          feedback: 'Петя: "Валидация не мешает. Она показывает реальность."',
          competencyTags: ['documentation']
        },
        {
          id: 'd',
          text: '"Сначала оформлю гипотезу и план экспериментов, чтобы не тюнить хаотично."',
          score: 70,
          feedback: 'Петя: "Норм. План экспериментов — это дисциплина."',
          competencyTags: ['process.sdlc']
        }
      ],
      explanation: 'Слишком высокий learning rate часто приводит к плохой сходимости. Для Adam типичные значения — 1e-3…1e-4 плюс scheduler.',
      domainId: 'deep-learning',
      difficulty: 1 as const
    },
    {
      id: 'ai-dl-03',
      scenario: 'Ты выбрал loss для бинарной классификации. В данных сильный дисбаланс: 1% положительных.',
      question: 'Что можно сделать, чтобы модель не игнорировала редкий класс?',
      choices: [
        {
          id: 'a',
          text: '"Ничего, accuracy всё покажет."',
          score: 0,
          feedback: 'Петя: "Accuracy при дисбалансе обманывает. Модель может всегда предсказывать 0."',
          competencyTags: ['quality']
        },
        {
          id: 'b',
          text: '"Использовать class weights / focal loss и следить за precision/recall."',
          score: 95,
          feedback: 'Петя: "Да. Веса классов и метрики по минорному классу — база."',
          competencyTags: ['autonomy']
        },
        {
          id: 'c',
          text: '"Сгенерировать случайные метки, чтобы баланс был 50/50."',
          score: 0,
          feedback: 'Петя: "Так ты убьёшь смысл данных."',
          competencyTags: ['documentation']
        },
        {
          id: 'd',
          text: '"Зафиксировать требования бизнеса: что хуже — FP или FN, и выбрать порог/метрику."',
          score: 80,
          feedback: 'Петя: "Правильно. Ошибки имеют цену, порог и метрика зависят от бизнеса."',
          competencyTags: ['customer.relations']
        }
      ],
      explanation: 'При дисбалансе важны метрики по минорному классу и техники вроде class weights/focal loss. Часто ещё тюнят порог под бизнес-стоимость ошибок.',
      domainId: 'deep-learning',
      difficulty: 1 as const
    }
  ],
  middle: [
    {
      id: 'ai-dl-04',
      scenario: 'Обучение нестабильно: loss иногда «взрывается» на одних и тех же данных. Модель на PyTorch, одна GPU.',
      question: 'Какой первый шаг наиболее разумен?',
      choices: [
        {
          id: 'a',
          text: 'Увеличить learning rate, чтобы быстрее «проскочить» нестабильность.',
          score: 10,
          feedback: 'Петя: "Чаще это усугубит. Нужна стабилизация."',
          competencyTags: ['quality']
        },
        {
          id: 'b',
          text: 'Включить gradient clipping и проверить нормализацию/инициализацию.',
          score: 100,
          feedback: 'Петя: "Да. Clipping и проверка причин нестабильности — базовый шаг."',
          competencyTags: ['process.sdlc']
        },
        {
          id: 'c',
          text: 'Сразу перейти на FP16 без дополнительных настроек.',
          score: 35,
          feedback: 'Петя: "Mixed precision помогает скорости, но может добавить нестабильности, если неаккуратно."',
          competencyTags: ['documentation']
        },
        {
          id: 'd',
          text: 'Сделать batch size в 10 раз больше, чтобы градиенты были «точнее».',
          score: 45,
          feedback: 'Петя: "Иногда помогает, но может упереться в память. Это не первый шаг."',
          competencyTags: ['autonomy']
        }
      ],
      explanation: 'При взрывах градиентов обычно начинают с диагностики и стабилизации (gradient clipping, нормализация, lr, инициализация).',
      domainId: 'deep-learning',
      difficulty: 2 as const
    },
    {
      id: 'ai-dl-05',
      scenario: 'На валидации качество растёт первые 5 эпох, затем падает, а train продолжает улучшаться.',
      question: 'Какое решение наиболее корректное?',
      choices: [
        {
          id: 'a',
          text: 'Продолжать обучение: модель «привыкнет» и на валидации тоже станет лучше.',
          score: 10,
          feedback: 'Петя: "Это переобучение. Дальше обычно хуже."',
          competencyTags: ['quality']
        },
        {
          id: 'b',
          text: 'Добавить early stopping и регуляризацию (dropout/weight decay), усилить аугментации.',
          score: 100,
          feedback: 'Петя: "Да. Это классический набор мер против overfitting."',
          competencyTags: ['process.sdlc']
        },
        {
          id: 'c',
          text: 'Убрать валидацию, она «мешает» прогрессу.',
          score: 0,
          feedback: 'Петя: "Валидация не мешает — она показывает реальность."',
          competencyTags: ['documentation']
        },
        {
          id: 'd',
          text: 'Сделать меньше эпох и поднять learning rate.',
          score: 50,
          feedback: 'Петя: "Сокращение эпох может помочь, но правильнее — early stopping + регуляризация."',
          competencyTags: ['autonomy']
        }
      ],
      explanation: 'Падение на валидации при росте на трейне — признак переобучения. Помогают early stopping, регуляризация и аугментации.',
      domainId: 'deep-learning',
      difficulty: 2 as const
    },
    {
      id: 'ai-dl-06',
      scenario: 'Данных мало, но есть предобученный backbone. Нужно быстро сделать модель под новую задачу.',
      question: 'Как правильно подойти к fine-tuning?',
      choices: [
        {
          id: 'a',
          text: 'Сразу обучать всю сеть с большим learning rate.',
          score: 20,
          feedback: 'Петя: "Можно быстро испортить веса. Обычно начинают аккуратнее."',
          competencyTags: ['quality']
        },
        {
          id: 'b',
          text: 'Заморозить backbone, обучить голову, затем постепенно размораживать слои с меньшим LR.',
          score: 100,
          feedback: 'Петя: "Да. Это снижает риск переобучения и деградации."',
          competencyTags: ['autonomy']
        },
        {
          id: 'c',
          text: 'Не использовать предобучение: пусть модель учится «с нуля».',
          score: 0,
          feedback: 'Петя: "На малых данных предобучение — must-have."',
          competencyTags: ['documentation']
        },
        {
          id: 'd',
          text: 'Увеличить размер модели в 10 раз, чтобы «влезло больше знаний».',
          score: 30,
          feedback: 'Петя: "На малых данных это чаще ухудшает."',
          competencyTags: ['quality']
        }
      ],
      explanation: 'Fine-tuning при малом датасете обычно делают в два шага: голова, затем частичное размораживание с меньшим LR.',
      domainId: 'deep-learning',
      difficulty: 2 as const
    }
  ],
  senior: [
    {
      id: 'ai-dl-07',
      scenario: 'Обучение стало в 2 раза медленнее после изменения пайплайна данных. Команда просит «ускорить» без потери качества.',
      question: 'Какой план действий ближе к сеньорскому?',
      choices: [
        {
          id: 'a',
          text: 'Сказать, что обучение всегда долгое и ничего не делать.',
          score: 0,
          feedback: 'Петя: "Это влияет на скорость команды и стоимость."',
          competencyTags: ['customer.relations']
        },
        {
          id: 'b',
          text: 'Профилировать pipeline (dataloader/augment/compute) и оптимизировать по найденным bottleneck.',
          score: 100,
          feedback: 'Петя: "Да. Сначала измерения, потом оптимизация."',
          competencyTags: ['process.sdlc']
        },
        {
          id: 'c',
          text: 'Сразу купить ещё GPU и не разбираться.',
          score: 40,
          feedback: 'Петя: "Иногда можно, но обычно сначала ищут bottleneck."',
          competencyTags: ['autonomy']
        },
        {
          id: 'd',
          text: 'Переписать модель на другую архитектуру без экспериментов.',
          score: 35,
          feedback: 'Петя: "Смена архитектуры — это тоже эксперимент. Начни с профилирования."',
          competencyTags: ['documentation']
        }
      ],
      explanation: 'Сеньорский подход к скорости — профилирование и системная оптимизация по bottleneck: данные, вычисления, настройки.',
      domainId: 'deep-learning',
      difficulty: 3 as const
    },
    {
      id: 'ai-dl-08',
      scenario: 'После обновления данных качество модели на проде просело. Подозрение на data drift.',
      question: 'Какое решение ближе к правильному?',
      choices: [
        {
          id: 'a',
          text: 'Откатить модель и забыть о проблеме.',
          score: 40,
          feedback: 'Петя: "Откат может быть временным, но проблему нужно решать."',
          competencyTags: ['process.sdlc']
        },
        {
          id: 'b',
          text: 'Поставить мониторинг входных распределений/качества, алерты и управляемый ретрейн-процесс.',
          score: 100,
          feedback: 'Петя: "Да. Drift — это процесс, а не разовая проблема."',
          competencyTags: ['quality']
        },
        {
          id: 'c',
          text: 'Увеличить модель: она будет устойчивее к дрейфу.',
          score: 15,
          feedback: 'Петя: "Размер не заменяет мониторинг и данные."',
          competencyTags: ['documentation']
        },
        {
          id: 'd',
          text: 'Попросить аналитиков почистить данные и на этом остановиться.',
          score: 55,
          feedback: 'Петя: "Чистка — часть решения, но нужна система: метрики, мониторинг, ретрейн."',
          competencyTags: ['customer.relations']
        }
      ],
      explanation: 'Data drift требует наблюдаемости и процессов: мониторинг распределений и качества, алерты, ретрейн и валидации.',
      domainId: 'deep-learning',
      difficulty: 3 as const
    },
    {
      id: 'ai-dl-09',
      scenario: 'Руководство просит воспроизводимость эксперимента: через месяц нужно повторить результат с теми же данными и параметрами.',
      question: 'Что сделаешь?',
      choices: [
        {
          id: 'a',
          text: 'Расскажу устно, а код пусть посмотрят сами.',
          score: 20,
          feedback: 'Петя: "Устно забудется. Нужны артефакты."',
          competencyTags: ['customer.relations']
        },
        {
          id: 'b',
          text: 'Зафиксирую конфиги, версии кода/данных, сиды, метрики и результаты в отчёте или трекере экспериментов.',
          score: 100,
          feedback: 'Петя: "Да. Это инженерная дисциплина."',
          competencyTags: ['documentation']
        },
        {
          id: 'c',
          text: 'Сделаю только скриншоты графиков обучения.',
          score: 35,
          feedback: 'Петя: "Скриншоты не дают воспроизводимости."',
          competencyTags: ['documentation']
        },
        {
          id: 'd',
          text: 'Сохраню только финальную модель и удалю всё остальное.',
          score: 40,
          feedback: 'Петя: "Без данных/конфигов модель не воспроизвести."',
          competencyTags: ['quality']
        }
      ],
      explanation: 'Сеньор фиксирует эксперимент как артефакт: данные, конфиги, метрики, версии и выводы для воспроизводимости.',
      domainId: 'deep-learning',
      difficulty: 3 as const
    }
  ],
  architect: [
    {
      id: 'ai-dl-10',
      scenario: 'Вы строите платформу обучения для нескольких команд. Требования: воспроизводимость и контроль артефактов.',
      question: 'Какое решение наиболее архитектурно верное?',
      choices: [
        {
          id: 'a',
          text: 'Пусть каждая команда хранит всё в своих папках на диске.',
          score: 10,
          feedback: 'Петя: "Это приведёт к хаосу и невоспроизводимости."',
          competencyTags: ['documentation']
        },
        {
          id: 'b',
          text: 'Версионирование данных/моделей, единые пайплайны, артефакт-стор и политика метрик/экспериментов.',
          score: 100,
          feedback: 'Петя: "Да. Платформа — это стандарты и артефакты."',
          competencyTags: ['process.sdlc']
        },
        {
          id: 'c',
          text: 'Только мощные GPU, остальное не важно.',
          score: 0,
          feedback: 'Петя: "Ресурсы важны, но без процессов всё развалится."',
          competencyTags: ['customer.relations']
        },
        {
          id: 'd',
          text: 'Один скрипт обучения и запрет менять его.',
          score: 35,
          feedback: 'Петя: "Слишком жёстко. Нужна платформа, а не запрет."',
          competencyTags: ['autonomy']
        }
      ],
      explanation: 'Платформенный уровень — управление артефактами и стандартами: версии данных, registry моделей, пайплайны, метрики.',
      domainId: 'deep-learning',
      difficulty: 4 as const
    },
    {
      id: 'ai-dl-11',
      scenario: 'Нужно поддержать distributed training так, чтобы другие команды могли запускать без ручных настроек.',
      question: 'Как подойти?',
      choices: [
        {
          id: 'a',
          text: 'Пусть каждый вручную настраивает distributed по докам фреймворка.',
          score: 25,
          feedback: 'Петя: "Так будет много ошибок и разных реализаций."',
          competencyTags: ['documentation']
        },
        {
          id: 'b',
          text: 'Сделать шаблоны/SDK запуска с конфигами, мониторингом, лимитами и преднастройками.',
          score: 100,
          feedback: 'Петя: "Да. Это платформенный подход."',
          competencyTags: ['process.sdlc']
        },
        {
          id: 'c',
          text: 'Запретить distributed, чтобы не усложнять.',
          score: 0,
          feedback: 'Петя: "Запрет — не решение."',
          competencyTags: ['customer.relations']
        },
        {
          id: 'd',
          text: 'Покупаем один очень дорогой сервер и всё.',
          score: 40,
          feedback: 'Петя: "Иногда, но не масштабируется и не универсально."',
          competencyTags: ['autonomy']
        }
      ],
      explanation: 'Архитектурно важно сделать повторяемый способ запуска: templates/SDK, конфиги, мониторинг и лимиты.',
      domainId: 'deep-learning',
      difficulty: 4 as const
    },
    {
      id: 'ai-dl-12',
      scenario: 'Надо закладывать требования комплаенса: аудит решений и объяснимость для критичной модели.',
      question: 'Что закладываешь в архитектуру?',
      choices: [
        {
          id: 'a',
          text: 'Ничего: это задача DS, а не платформы.',
          score: 0,
          feedback: 'Петя: "Требования комплаенса должны быть в архитектуре."',
          competencyTags: ['customer.relations']
        },
        {
          id: 'b',
          text: 'Политики логирования, трассировка, набор обязательных метрик, документация модели и контроль релизов.',
          score: 100,
          feedback: 'Петя: "Да. Наблюдаемость и процессы релизов."',
          competencyTags: ['documentation']
        },
        {
          id: 'c',
          text: 'Спрятать модель поглубже, чтобы никто не видел как работает.',
          score: 10,
          feedback: 'Петя: "Сокрытие не равно комплаенс."',
          competencyTags: ['documentation']
        },
        {
          id: 'd',
          text: 'Менять модель каждый день без проверок.',
          score: 0,
          feedback: 'Петя: "Так риски только вырастут."',
          competencyTags: ['process.sdlc']
        }
      ],
      explanation: 'Для критичных систем нужны аудит, наблюдаемость, документация, метрики и управляемые релизы.',
      domainId: 'deep-learning',
      difficulty: 4 as const
    }
  ]
}

const NLP_LLMS_QUESTIONS = {
  junior: [
    {
      id: 'ai-nlp-01',
      scenario: 'Тебе нужно искать похожие ответы в базе FAQ по тексту вопроса пользователя.',
      question: 'Какой подход выберешь в первую очередь?',
      choices: [
        {
          id: 'a',
          text: '"Сделаю точное совпадение строк: если текст равен — показываем ответ."',
          score: 10,
          feedback: 'Петя: "Люди пишут по-разному. Нужна семантика."',
          competencyTags: ['quality']
        },
        {
          id: 'b',
          text: '"Эмбеддинги + векторный поиск (semantic search), потом переранжирование."',
          score: 95,
          feedback: 'Петя: "Да. Эмбеддинги — стандарт для поиска похожих текстов."',
          competencyTags: ['process.sdlc']
        },
        {
          id: 'c',
          text: '"Только LLM: просто спросим модель, и она всё вспомнит."',
          score: 25,
          feedback: 'Петя: "Без базы знаний и retrieval будут галлюцинации."',
          competencyTags: ['documentation']
        },
        {
          id: 'd',
          text: '"Сначала соберу требования: latency/стоимость/точность, и выберу between BM25 vs embeddings."',
          score: 75,
          feedback: 'Петя: "Хороший подход. Требования определяют архитектуру."',
          competencyTags: ['customer.relations']
        }
      ],
      explanation: 'Для поиска похожих текстов типичный baseline — эмбеддинги + векторный поиск, часто с переранжированием. LLM без retrieval может галлюцинировать.',
      domainId: 'nlp-llms',
      difficulty: 1 as const
    },
    {
      id: 'ai-nlp-02',
      scenario: 'Ты делаешь RAG: LLM отвечает на вопросы по документам компании. Иногда модель уверенно выдаёт неверные факты.',
      question: 'Что первое улучшишь?',
      choices: [
        {
          id: 'a',
          text: '"Запрещу пользователям задавать сложные вопросы."',
          score: 0,
          feedback: 'Петя: "Нам надо улучшать систему, а не прятать проблему."',
          competencyTags: ['customer.relations']
        },
        {
          id: 'b',
          text: '"Усилю retrieval: качество чанкинга, топ-k, фильтрацию, добавлю цитаты/ссылки."',
          score: 90,
          feedback: 'Петя: "Да. Обычно проблема в retrieval и контексте."',
          competencyTags: ['quality']
        },
        {
          id: 'c',
          text: '"Поставлю temperature = 2, чтобы ответы были креативнее."',
          score: 0,
          feedback: 'Петя: "Креативность увеличит галлюцинации."',
          competencyTags: ['documentation']
        },
        {
          id: 'd',
          text: '"Оформлю план оценки: набор вопросов, метрики, регресс-тесты на фактах."',
          score: 80,
          feedback: 'Петя: "Правильно. Нужна измеримость и регрессия."',
          competencyTags: ['process.sdlc']
        }
      ],
      explanation: 'Галлюцинации в RAG часто лечатся улучшением retrieval, контекстом, и обязательной оценкой качества (eval set, регресс-тесты).',
      domainId: 'nlp-llms',
      difficulty: 1 as const
    },
    {
      id: 'ai-nlp-03',
      scenario: 'В проде выросла стоимость LLM и время ответа. Пользователи жалуются.',
      question: 'Что сделаешь в первую очередь?',
      choices: [
        {
          id: 'a',
          text: '"Ничего, цена — это проблема бизнеса."',
          score: 0,
          feedback: 'Петя: "Это твоя система, ты отвечаешь за эффективность."',
          competencyTags: ['customer.relations']
        },
        {
          id: 'b',
          text: '"Добавлю кэширование, уменьшение контекста, и более дешёвую модель для простых запросов."',
          score: 95,
          feedback: 'Петя: "Да. Маршрутизация и оптимизация контекста дают быстрый эффект."',
          competencyTags: ['autonomy']
        },
        {
          id: 'c',
          text: '"Увеличу max_tokens, чтобы модель быстрее отвечала."',
          score: 0,
          feedback: 'Петя: "Так будет ещё дороже и медленнее."',
          competencyTags: ['documentation']
        },
        {
          id: 'd',
          text: '"Описать SLO и бюджет, а потом измерять latency/token usage по шагам пайплайна."',
          score: 80,
          feedback: 'Петя: "Верно. Сначала измерить, потом оптимизировать."',
          competencyTags: ['process.sdlc']
        }
      ],
      explanation: 'Оптимизация LLM часто начинается с измерений, кэширования, сокращения контекста и маршрутизации на более дешёвые модели.',
      domainId: 'nlp-llms',
      difficulty: 1 as const
    }
  ],
  middle: [
    {
      id: 'ai-nlp-04',
      scenario: 'Ты строишь prompt для LLM. Модель иногда «галлюцинирует» факты в ответе.',
      question: 'Какой практичный шаг поможет снизить галлюцинации в продукте?',
      choices: [
        {
          id: 'a',
          text: 'Поднять temperature, чтобы ответ был более «уверенным».',
          score: 0,
          feedback: 'Петя: "Temperature выше — больше вариативности и галлюцинаций."',
          competencyTags: ['quality']
        },
        {
          id: 'b',
          text: 'Добавить RAG: искать факты в базе/доках и давать их модели в контексте.',
          score: 100,
          feedback: 'Петя: "Да. RAG + ссылки на источники — базовый продовый приём."',
          competencyTags: ['process.sdlc']
        },
        {
          id: 'c',
          text: 'Запретить пользователю задавать вопросы о фактах.',
          score: 10,
          feedback: 'Петя: "Можно ограничивать, но это не решение."',
          competencyTags: ['customer.relations']
        },
        {
          id: 'd',
          text: 'Всегда отвечать «не знаю», чтобы не ошибаться.',
          score: 35,
          feedback: 'Петя: "Фоллбек нужен, но лучше ещё и ground truth подтягивать."',
          competencyTags: ['documentation']
        }
      ],
      explanation: 'RAG (retrieval-augmented generation) снижает галлюцинации, привязывая ответ к источникам.',
      domainId: 'nlp-llms',
      difficulty: 2 as const
    },
    {
      id: 'ai-nlp-05',
      scenario: 'Нужно оценить качество LLM-ассистента на задаче суммаризации тикетов. ROUGE даёт нестабильные выводы.',
      question: 'Как правильно построить оценку?',
      choices: [
        {
          id: 'a',
          text: 'Считать только ROUGE и ничего больше.',
          score: 25,
          feedback: 'Петя: "Для суммаризации важна полезность и смысл, а не только совпадение n-грамм."',
          competencyTags: ['quality']
        },
        {
          id: 'b',
          text: 'Комбинировать авто-метрики + ручную разметку по рубрике + регрессионный набор кейсов.',
          score: 100,
          feedback: 'Петя: "Да. Для LLM обычно нужен human eval и регрессионные тесты."',
          competencyTags: ['process.sdlc']
        },
        {
          id: 'c',
          text: 'Оценивать по длине ответа: чем короче, тем лучше.',
          score: 0,
          feedback: 'Петя: "Длина не равна качеству."',
          competencyTags: ['documentation']
        },
        {
          id: 'd',
          text: 'Спросить одного пользователя «норм?» и считать, что всё ок.',
          score: 35,
          feedback: 'Петя: "Нужна воспроизводимая методика оценки."',
          competencyTags: ['customer.relations']
        }
      ],
      explanation: 'LLM-фичи оценивают смесью: авто-метрики, ручной evaluation, регрессионные наборы и мониторинг.',
      domainId: 'nlp-llms',
      difficulty: 2 as const
    },
    {
      id: 'ai-nlp-06',
      scenario: 'Ты делаешь классификацию обращений. Классы несбалансированы: редкие, но важные категории.',
      question: 'Что выберешь как базовый план?',
      choices: [
        {
          id: 'a',
          text: 'Смотреть только accuracy и не усложнять.',
          score: 10,
          feedback: 'Петя: "Дисбаланс сломает оценку."',
          competencyTags: ['quality']
        },
        {
          id: 'b',
          text: 'Стратифицированные сплиты, метрики per-class (macro F1), веса классов/oversampling.',
          score: 100,
          feedback: 'Петя: "Да. Это корректная оценка и обучение."',
          competencyTags: ['process.sdlc']
        },
        {
          id: 'c',
          text: 'Удалить редкие классы, чтобы «не мешали».',
          score: 25,
          feedback: 'Петя: "Если они важны бизнесу — нельзя."',
          competencyTags: ['customer.relations']
        },
        {
          id: 'd',
          text: 'Сделать всё одним классом «прочее».',
          score: 45,
          feedback: 'Петя: "Иногда можно, но это решение должно быть осознанным."',
          competencyTags: ['documentation']
        }
      ],
      explanation: 'При дисбалансе нужны корректные метрики и техники: веса классов, oversampling и macro-F1.',
      domainId: 'nlp-llms',
      difficulty: 2 as const
    }
  ],
  senior: [
    {
      id: 'ai-nlp-07',
      scenario: 'Важно, чтобы LLM не раскрывала персональные данные из контекста и логов.',
      question: 'Какой набор мер выглядит наиболее зрелым?',
      choices: [
        {
          id: 'a',
          text: 'Ничего: это ответственность пользователя.',
          score: 0,
          feedback: 'Петя: "Безопасность — ответственность команды."',
          competencyTags: ['customer.relations']
        },
        {
          id: 'b',
          text: 'Санитизация/редакция данных, политика логов, ограничения tools, тесты на leakage.',
          score: 100,
          feedback: 'Петя: "Да. Нужен системный контроль утечек."',
          competencyTags: ['quality']
        },
        {
          id: 'c',
          text: 'Просто поставить temperature=0.',
          score: 25,
          feedback: 'Петя: "Это не решает утечки, только снижает вариативность."',
          competencyTags: ['documentation']
        },
        {
          id: 'd',
          text: 'Запретить использовать LLM.',
          score: 15,
          feedback: 'Петя: "Обычно ищут управляемый риск, а не запрет."',
          competencyTags: ['customer.relations']
        }
      ],
      explanation: 'Для LLM-продукта нужны системные меры против утечек: фильтры, редактирование, политика логов и тесты.',
      domainId: 'nlp-llms',
      difficulty: 3 as const
    },
    {
      id: 'ai-nlp-08',
      scenario: 'Вы внедрили RAG, но ответы противоречат документам: модель выбирает нерелевантные чанки.',
      question: 'Как улучшать правильно?',
      choices: [
        {
          id: 'a',
          text: 'Увеличить top-k до 50 и считать, что всё решено.',
          score: 35,
          feedback: 'Петя: "Больше контекста не гарантирует релевантность."',
          competencyTags: ['quality']
        },
        {
          id: 'b',
          text: 'Измерить retrieval (recall@k/MRR), улучшить chunking, embeddings, rerank и фильтры.',
          score: 100,
          feedback: 'Петя: "Да. Сначала метрики retrieval, потом улучшения."',
          competencyTags: ['process.sdlc']
        },
        {
          id: 'c',
          text: 'Сделать промпт длиннее.',
          score: 30,
          feedback: 'Петя: "Промпт не компенсирует плохой retrieval."',
          competencyTags: ['documentation']
        },
        {
          id: 'd',
          text: 'Попросить пользователей переформулировать вопрос.',
          score: 25,
          feedback: 'Петя: "UX помогает, но базовая проблема — retrieval."',
          competencyTags: ['customer.relations']
        }
      ],
      explanation: 'Качество RAG часто упирается в retrieval. Нужны метрики retrieval и улучшения: chunking, embeddings, rerank.',
      domainId: 'nlp-llms',
      difficulty: 3 as const
    },
    {
      id: 'ai-nlp-09',
      scenario: 'Нужно выкатывать изменения промптов/моделей без регрессий качества.',
      question: 'Что предложишь?',
      choices: [
        {
          id: 'a',
          text: 'Выкатывать сразу всем: пользователи сами скажут, если плохо.',
          score: 10,
          feedback: 'Петя: "Это рискованно."',
          competencyTags: ['customer.relations']
        },
        {
          id: 'b',
          text: 'Эталонные кейсы, регрессионные тесты, канарейка и мониторинг метрик/стоимости.',
          score: 100,
          feedback: 'Петя: "Да. Для LLM это особенно важно."',
          competencyTags: ['process.sdlc']
        },
        {
          id: 'c',
          text: 'Запретить менять промпты после релиза.',
          score: 25,
          feedback: 'Петя: "Нереалистично. Нужен управляемый процесс."',
          competencyTags: ['documentation']
        },
        {
          id: 'd',
          text: 'Сделать один A/B тест и на этом остановиться.',
          score: 55,
          feedback: 'Петя: "A/B полезен, но нужен контур регрессий."',
          competencyTags: ['autonomy']
        }
      ],
      explanation: 'Сеньорский подход — регресс-тесты, канарейка, мониторинг и контроль качества изменений.',
      domainId: 'nlp-llms',
      difficulty: 3 as const
    }
  ],
  architect: [
    {
      id: 'ai-nlp-10',
      scenario: 'Компания хочет LLM-ассистента для нескольких департаментов. Нужны разграничение доступа и аудит.',
      question: 'Что закладываешь в архитектуру?',
      choices: [
        {
          id: 'a',
          text: 'Один общий чат на всех, без ролей и политик.',
          score: 0,
          feedback: 'Петя: "Так вы точно поймаете утечки."',
          competencyTags: ['customer.relations']
        },
        {
          id: 'b',
          text: 'RBAC/изоляция данных, аудит, политики хранения, redaction и безопасный RAG.',
          score: 100,
          feedback: 'Петя: "Да. Это системная безопасность."',
          competencyTags: ['process.sdlc']
        },
        {
          id: 'c',
          text: 'Полностью запретить логи.',
          score: 35,
          feedback: 'Петя: "Аудит нужен. Логи можно обезличивать."',
          competencyTags: ['documentation']
        },
        {
          id: 'd',
          text: 'Довериться провайдеру и не думать о политике данных.',
          score: 20,
          feedback: 'Петя: "Нельзя перекладывать ответственность полностью."',
          competencyTags: ['customer.relations']
        }
      ],
      explanation: 'Корпоративный LLM требует доступа, изоляции данных, аудита и политик безопасности.',
      domainId: 'nlp-llms',
      difficulty: 4 as const
    },
    {
      id: 'ai-nlp-11',
      scenario: 'Нужно поддерживать несколько провайдеров/версий моделей и переключать без переписывания продукта.',
      question: 'Какой дизайн выберешь?',
      choices: [
        {
          id: 'a',
          text: 'Захардкодить одного провайдера везде.',
          score: 10,
          feedback: 'Петя: "Это vendor lock-in."',
          competencyTags: ['documentation']
        },
        {
          id: 'b',
          text: 'Слой-абстракция + маршрутизация по конфигам + мониторинг стоимости/качества.',
          score: 100,
          feedback: 'Петя: "Да. Архитектура для смены провайдера."',
          competencyTags: ['process.sdlc']
        },
        {
          id: 'c',
          text: 'Поддерживать 10 провайдеров сразу без критериев.',
          score: 35,
          feedback: 'Петя: "Нужны критерии, иначе зоопарк."',
          competencyTags: ['autonomy']
        },
        {
          id: 'd',
          text: 'Выбрать самую дешёвую модель и забыть про качество.',
          score: 0,
          feedback: 'Петя: "Стоимость и качество надо балансировать."',
          competencyTags: ['customer.relations']
        }
      ],
      explanation: 'Архитектурно полезна абстракция над LLM провайдерами и конфигурируемая маршрутизация с наблюдаемостью.',
      domainId: 'nlp-llms',
      difficulty: 4 as const
    },
    {
      id: 'ai-nlp-12',
      scenario: 'Вы вводите tools/function calling. Ошибки tool-вызовов приводят к неверным действиям.',
      question: 'Как минимизировать риски?',
      choices: [
        {
          id: 'a',
          text: 'Доверять модели: она умная, сама разберётся.',
          score: 0,
          feedback: 'Петя: "Нужны guardrails."',
          competencyTags: ['quality']
        },
        {
          id: 'b',
          text: 'Схемы валидации, ограничения инструментов, dry-run, логирование и подтверждения для критичных действий.',
          score: 100,
          feedback: 'Петя: "Да. Это безопасное исполнение tools."',
          competencyTags: ['process.sdlc']
        },
        {
          id: 'c',
          text: 'Скрыть ошибки tools и всегда отвечать успехом.',
          score: 0,
          feedback: 'Петя: "Так создашь скрытые инциденты."',
          competencyTags: ['documentation']
        },
        {
          id: 'd',
          text: 'Запретить tool calling.',
          score: 25,
          feedback: 'Петя: "Если бизнесу нужно — делаем безопасно, а не запрещаем."',
          competencyTags: ['customer.relations']
        }
      ],
      explanation: 'Tools требуют безопасного исполнения: валидации, ограничений, наблюдаемости и подтверждений.',
      domainId: 'nlp-llms',
      difficulty: 4 as const
    }
  ]
}

const COMPUTER_VISION_QUESTIONS = {
  junior: [
    {
      id: 'ai-cv-01',
      scenario: 'Нужно находить дефекты на фото деталей. Картинки разных размеров, освещение разное. Данных немного.',
      question: 'С чего начнёшь?',
      choices: [
        {
          id: 'a',
          text: '"Буду обучать сеть с нуля на 200 фото."',
          score: 10,
          feedback: 'Петя: "С нуля на малых данных обычно плохо. Лучше transfer learning."',
          competencyTags: ['quality']
        },
        {
          id: 'b',
          text: '"Возьму предобученную модель и дообучу, добавлю аугментации."',
          score: 95,
          feedback: 'Петя: "Да. Transfer learning и аугментации — самое разумное."',
          competencyTags: ['autonomy']
        },
        {
          id: 'c',
          text: '"Сделаю только BM25 по пикселям."',
          score: 0,
          feedback: 'Петя: "BM25 — это про текст. Тут CV."',
          competencyTags: ['documentation']
        },
        {
          id: 'd',
          text: '"Сначала уточню критерий: классификация дефект/не дефект или детекция/сегментация?"',
          score: 80,
          feedback: 'Петя: "Правильно. Постановка задачи влияет на разметку и модель."',
          competencyTags: ['customer.relations']
        }
      ],
      explanation: 'На небольших датасетах в CV обычно используют transfer learning + аугментации. Важно чётко определить задачу (classification/detection/segmentation).',
      domainId: 'computer-vision',
      difficulty: 1 as const
    },
    {
      id: 'ai-cv-02',
      scenario: 'Ты обучил детектор. На тесте много false positives: модель "видит" дефект там, где его нет.',
      question: 'Какой шаг даст быстрый эффект?',
      choices: [
        {
          id: 'a',
          text: '"Подниму confidence threshold и посмотрю precision/recall."',
          score: 85,
          feedback: 'Петя: "Да. Порог — простой рычаг, но следи за recall."',
          competencyTags: ['quality']
        },
        {
          id: 'b',
          text: '"Уберу NMS, она мешает."',
          score: 20,
          feedback: 'Петя: "NMS обычно снижает дубли. Проблема чаще в данных/порогах."',
          competencyTags: ['documentation']
        },
        {
          id: 'c',
          text: '"Ничего, пусть операторы фильтруют руками."',
          score: 0,
          feedback: 'Петя: "Так ты перекладываешь качество на людей."',
          competencyTags: ['customer.relations']
        },
        {
          id: 'd',
          text: '"Проверю разметку negative примеров и добавлю hard negatives."',
          score: 90,
          feedback: 'Петя: "Отлично. Hard negatives часто сильно снижают FP."',
          competencyTags: ['process.sdlc']
        }
      ],
      explanation: 'FP можно снижать порогом и улучшением данных: hard negatives, проверка разметки, баланс классов.',
      domainId: 'computer-vision',
      difficulty: 1 as const
    },
    {
      id: 'ai-cv-03',
      scenario: 'В проде камера поменялась, качество картинки стало хуже, метрики резко упали.',
      question: 'Как это правильно назвать и что делать?',
      choices: [
        {
          id: 'a',
          text: '"Это нормально, просто обучим заново раз в год."',
          score: 20,
          feedback: 'Петя: "Нужно быстрее реагировать и мониторить."',
          competencyTags: ['autonomy']
        },
        {
          id: 'b',
          text: '"Это data drift / domain shift. Нужны мониторинг, алерты и доразметка новых данных."',
          score: 95,
          feedback: 'Петя: "Да. Камера изменилась — распределение тоже."',
          competencyTags: ['process.sdlc']
        },
        {
          id: 'c',
          text: '"Это баг фронтенда, CV тут ни при чём."',
          score: 10,
          feedback: 'Петя: "Может быть, но сначала классифицируй проблему и собери факты."',
          competencyTags: ['documentation']
        },
        {
          id: 'd',
          text: '"Согласую с бизнесом допустимые деградации и план обновления модели."',
          score: 80,
          feedback: 'Петя: "Верно. Ожидания и SLA надо фиксировать."',
          competencyTags: ['customer.relations']
        }
      ],
      explanation: 'Смена камеры — типичный domain shift. Нужно мониторить входные данные/метрики, иметь алерты и процесс дообучения на новых данных.',
      domainId: 'computer-vision',
      difficulty: 1 as const
    }
  ],
  middle: [
    {
      id: 'ai-cv-04',
      scenario: 'Разметка для детектора шумная: боксы смещены, иногда путают классы. Качество нестабильно.',
      question: 'Что сделаешь в первую очередь?',
      choices: [
        {
          id: 'a',
          text: 'Увеличу модель, чтобы она «переварила» шум.',
          score: 25,
          feedback: 'Петя: "Большая модель может сильнее переобучиться на шум."',
          competencyTags: ['quality']
        },
        {
          id: 'b',
          text: 'Аудит разметки: сэмплинг, правила, исправление ошибок и контроль качества.',
          score: 100,
          feedback: 'Петя: "Да. В CV данные часто важнее архитектуры."',
          competencyTags: ['process.sdlc']
        },
        {
          id: 'c',
          text: 'Уберу валидацию — она мешает смотреть «чистое» обучение.',
          score: 0,
          feedback: 'Петя: "Валидация — единственный контроль. Убирать нельзя."',
          competencyTags: ['documentation']
        },
        {
          id: 'd',
          text: 'Поставлю порог повыше и закрою задачу.',
          score: 40,
          feedback: 'Петя: "Порог — настройка, но качество разметки это не чинит."',
          competencyTags: ['autonomy']
        }
      ],
      explanation: 'При шумной разметке ключевое — процессы качества данных: аудит, правила, доразметка, консистентность.',
      domainId: 'computer-vision',
      difficulty: 2 as const
    },
    {
      id: 'ai-cv-05',
      scenario: 'Сегментация хорошо работает на дневных кадрах, но на ночных резко хуже.',
      question: 'Какой инженерный план наиболее правильный?',
      choices: [
        {
          id: 'a',
          text: 'Сказать, что ночью модель не поддерживается.',
          score: 30,
          feedback: 'Петя: "Если бизнесу это нужно — надо решать, а не отказываться."',
          competencyTags: ['customer.relations']
        },
        {
          id: 'b',
          text: 'Собрать ночные данные, добавить аугментации освещения и сделать отдельный eval-срез.',
          score: 100,
          feedback: 'Петя: "Да. Это domain shift: лечится данными и оценкой."',
          competencyTags: ['process.sdlc']
        },
        {
          id: 'c',
          text: 'Увеличить число эпох: может «дотянет».',
          score: 25,
          feedback: 'Петя: "Без ночных данных не дотянет."',
          competencyTags: ['quality']
        },
        {
          id: 'd',
          text: 'Поменять оптимизатор — проблема в Adam.',
          score: 35,
          feedback: 'Петя: "Оптимизатор редко решает доменный сдвиг."',
          competencyTags: ['documentation']
        }
      ],
      explanation: 'Падение качества на ночных сценах — доменный сдвиг. Нужны данные и отдельные срезы оценки.',
      domainId: 'computer-vision',
      difficulty: 2 as const
    },
    {
      id: 'ai-cv-06',
      scenario: 'Клиент просит объяснить, почему детектор не увидел объект на конкретном кадре.',
      question: 'Какое действие самое профессиональное?',
      choices: [
        {
          id: 'a',
          text: 'Сказать, что нейросети не объясняются.',
          score: 0,
          feedback: 'Петя: "Есть инструменты диагностики."',
          competencyTags: ['customer.relations']
        },
        {
          id: 'b',
          text: 'Диагностика: проверка порогов/NMS, визуализации (grad-cam), поиск похожих кейсов в данных.',
          score: 100,
          feedback: 'Петя: "Да. Гипотезы, артефакты и проверка."',
          competencyTags: ['process.sdlc']
        },
        {
          id: 'c',
          text: 'Поднять confidence, чтобы «точно видел».',
          score: 20,
          feedback: 'Петя: "Поднятие порога снижает recall. Это надо измерять."',
          competencyTags: ['quality']
        },
        {
          id: 'd',
          text: 'Срочно сменить модель на другую архитектуру.',
          score: 35,
          feedback: 'Петя: "Без анализа это лотерея."',
          competencyTags: ['autonomy']
        }
      ],
      explanation: 'Правильный подход — диагностика: пороги, NMS, причины в данных, визуализации и воспроизводимый разбор кейса.',
      domainId: 'computer-vision',
      difficulty: 2 as const
    }
  ],
  senior: [
    {
      id: 'ai-cv-07',
      scenario: 'Нужно 30 FPS inference на edge-устройстве, но текущая модель не укладывается по latency.',
      question: 'Какой план ближе к правильному?',
      choices: [
        {
          id: 'a',
          text: 'Снизить FPS до 5 и считать, что задача решена.',
          score: 25,
          feedback: 'Петя: "Это изменение требований. Нужно обсудить компромисс."',
          competencyTags: ['customer.relations']
        },
        {
          id: 'b',
          text: 'Профилирование + оптимизации: quantization/pruning/distillation, runtime, пайплайн данных.',
          score: 100,
          feedback: 'Петя: "Да. Системная оптимизация под SLA."',
          competencyTags: ['process.sdlc']
        },
        {
          id: 'c',
          text: 'Взять самое мощное edge-устройство, не измеряя стоимость.',
          score: 45,
          feedback: 'Петя: "Иногда можно, но нужен расчёт стоимости и рисков."',
          competencyTags: ['autonomy']
        },
        {
          id: 'd',
          text: 'Уменьшить разрешение в 10 раз без оценки качества.',
          score: 35,
          feedback: 'Петя: "Разрешение — рычаг, но надо измерять влияние."',
          competencyTags: ['quality']
        }
      ],
      explanation: 'Сеньорский подход — измерения и оптимизации модели/рантайма, затем согласование компромиссов качества/скорости.',
      domainId: 'computer-vision',
      difficulty: 3 as const
    },
    {
      id: 'ai-cv-08',
      scenario: 'После обновления камеры (баланс белого) выросло число false positives.',
      question: 'Что сделаешь как сеньор?',
      choices: [
        {
          id: 'a',
          text: 'Игнорировать: пользователи привыкнут.',
          score: 0,
          feedback: 'Петя: "Нет. Это регрессия качества."',
          competencyTags: ['customer.relations']
        },
        {
          id: 'b',
          text: 'Мониторинг по срезам, сбор новых данных, обновление аугментаций/калибровок и ретрейн.',
          score: 100,
          feedback: 'Петя: "Да. Это доменный сдвиг и процесс."',
          competencyTags: ['process.sdlc']
        },
        {
          id: 'c',
          text: 'Поднять порог confidence на глаз.',
          score: 35,
          feedback: 'Петя: "Порог — ок, но только после измерений на отложенном наборе."',
          competencyTags: ['quality']
        },
        {
          id: 'd',
          text: 'Сменить фреймворк на другой.',
          score: 10,
          feedback: 'Петя: "Фреймворк не при чём."',
          competencyTags: ['documentation']
        }
      ],
      explanation: 'Изменение камеры — изменение распределений. Нужны срезы мониторинга, данные и процесс обновления модели.',
      domainId: 'computer-vision',
      difficulty: 3 as const
    },
    {
      id: 'ai-cv-09',
      scenario: 'Нужно договориться с продуктом о метриках качества детектора (FP/FN имеют разную цену).',
      question: 'Что сделаешь?',
      choices: [
        {
          id: 'a',
          text: 'Выберу mAP и не буду обсуждать.',
          score: 35,
          feedback: 'Петя: "mAP не всегда отражает бизнес-цену ошибок."',
          competencyTags: ['documentation']
        },
        {
          id: 'b',
          text: 'Согласую стоимость FP/FN, выберу KPI (precision/recall@threshold) и заведу регрессионные отчёты по срезам.',
          score: 100,
          feedback: 'Петя: "Да. Это зрелая работа со стейкхолдерами."',
          competencyTags: ['customer.relations']
        },
        {
          id: 'c',
          text: 'Оставлю пороги по умолчанию и буду надеяться.',
          score: 20,
          feedback: 'Петя: "Порог должен соответствовать бизнесу."',
          competencyTags: ['quality']
        },
        {
          id: 'd',
          text: 'Скажу, что метрики — это проблема аналитика.',
          score: 0,
          feedback: 'Петя: "Нет."',
          competencyTags: ['customer.relations']
        }
      ],
      explanation: 'Сеньор помогает согласовать метрики с бизнесом: стоимость ошибок, пороги, срезы, регрессионные тесты.',
      domainId: 'computer-vision',
      difficulty: 3 as const
    }
  ],
  architect: [
    {
      id: 'ai-cv-10',
      scenario: 'Вы строите CV-сервис для нескольких продуктов. Требуются SLA и безопасные обновления моделей.',
      question: 'Что закладываешь в архитектуру?',
      choices: [
        {
          id: 'a',
          text: 'Один монолит без наблюдаемости и версий моделей.',
          score: 10,
          feedback: 'Петя: "Трудно сопровождать и масштабировать."',
          competencyTags: ['documentation']
        },
        {
          id: 'b',
          text: 'Версионирование моделей/API, мониторинг latency/качества, канареечные релизы и откаты.',
          score: 100,
          feedback: 'Петя: "Да. Это платформа и процессы."',
          competencyTags: ['process.sdlc']
        },
        {
          id: 'c',
          text: 'Пусть каждая команда деплоит модели как хочет.',
          score: 30,
          feedback: 'Петя: "Будет зоопарк и инциденты."',
          competencyTags: ['autonomy']
        },
        {
          id: 'd',
          text: 'Сделать один endpoint predict и считать, что достаточно.',
          score: 45,
          feedback: 'Петя: "Нужны версии, SLA и наблюдаемость."',
          competencyTags: ['quality']
        }
      ],
      explanation: 'Архитектура CV-сервиса требует версий, наблюдаемости, SLA и управляемых релизов моделей.',
      domainId: 'computer-vision',
      difficulty: 4 as const
    },
    {
      id: 'ai-cv-11',
      scenario: 'Безопасность требует не сохранять изображения в логах, но расследования инцидентов должны быть возможны.',
      question: 'Как сбалансировать требования?',
      choices: [
        {
          id: 'a',
          text: 'Полностью запретить любые логи.',
          score: 30,
          feedback: 'Петя: "Нужен аудит. Можно логировать безопасно."',
          competencyTags: ['documentation']
        },
        {
          id: 'b',
          text: 'Логировать метаданные/хэши, хранить выборочные данные в защищённом хранилище с ролями и сроками.',
          score: 100,
          feedback: 'Петя: "Да. Это компромисс безопасность/аудит."',
          competencyTags: ['process.sdlc']
        },
        {
          id: 'c',
          text: 'Сохранять все изображения «на всякий случай».',
          score: 0,
          feedback: 'Петя: "Это риск и нарушение."',
          competencyTags: ['quality']
        },
        {
          id: 'd',
          text: 'Не делать ничего, пусть безопасность решает сама.',
          score: 10,
          feedback: 'Петя: "Архитектура должна учитывать требования."',
          competencyTags: ['customer.relations']
        }
      ],
      explanation: 'Для баланса безопасности и аудита логируют минимум (метаданные), а чувствительные данные хранят ограниченно и контролируемо.',
      domainId: 'computer-vision',
      difficulty: 4 as const
    },
    {
      id: 'ai-cv-12',
      scenario: 'Нужно обеспечивать совместимость разных версий модели с разными клиентами и обновлять постепенно.',
      question: 'Какой паттерн лучше?',
      choices: [
        {
          id: 'a',
          text: 'Всегда обновлять всем сразу.',
          score: 15,
          feedback: 'Петя: "Высокий риск регрессий."',
          competencyTags: ['quality']
        },
        {
          id: 'b',
          text: 'Версионирование API/моделей, совместимость контрактов, постепенный rollout и стратегия отката.',
          score: 100,
          feedback: 'Петя: "Да. Управляемые релизы."',
          competencyTags: ['process.sdlc']
        },
        {
          id: 'c',
          text: 'Скрывать изменения, не уведомляя клиентов.',
          score: 0,
          feedback: 'Петя: "Контракты нарушать нельзя."',
          competencyTags: ['customer.relations']
        },
        {
          id: 'd',
          text: 'Деплоить разные версии в разные места без правил.',
          score: 20,
          feedback: 'Петя: "Будет хаос."',
          competencyTags: ['documentation']
        }
      ],
      explanation: 'Нужны версии и контракты: versioned API, постепенный rollout и стратегии отката.',
      domainId: 'computer-vision',
      difficulty: 4 as const
    }
  ]
}

const MLOPS_QUESTIONS = {
  junior: [
    {
      id: 'ai-mlops-01',
      scenario: 'Тебе нужно деплоить модель в прод. Команда просит: повторяемость обучения и предсказаний, чтобы можно было воспроизвести результат.',
      question: 'Что обязательно сделаешь?',
      choices: [
        {
          id: 'a',
          text: '"Сохраню только веса модели, остальное не важно."',
          score: 20,
          feedback: 'Петя: "Важны данные, код, параметры и окружение."',
          competencyTags: ['documentation']
        },
        {
          id: 'b',
          text: '"Версионирование данных/кода/параметров, логирование экспериментов, артефакты модели."',
          score: 95,
          feedback: 'Петя: "Да. Это база воспроизводимости."',
          competencyTags: ['process.sdlc']
        },
        {
          id: 'c',
          text: '"Запущу обучение на своём ноутбуке и скину модель в чат."',
          score: 0,
          feedback: 'Петя: "Так прод не строят."',
          competencyTags: ['quality']
        },
        {
          id: 'd',
          text: '"Согласую с бизнесом, какие метрики важны, и как будем откатываться."',
          score: 80,
          feedback: 'Петя: "Правильно. Прод — это не только ML, но и процесс."',
          competencyTags: ['customer.relations']
        }
      ],
      explanation: 'Воспроизводимость достигается версионированием данных/кода/параметров, логированием экспериментов и хранением артефактов.',
      domainId: 'mlops',
      difficulty: 1 as const
    },
    {
      id: 'ai-mlops-02',
      scenario: 'После релиза модели метрика качества в проде постепенно ухудшается. В данных появились новые паттерны.',
      question: 'Что это и что нужно иметь в системе?',
      choices: [
        {
          id: 'a',
          text: '"Это нормально, модели всегда деградируют. Ничего не делаем."',
          score: 0,
          feedback: 'Петя: "Нужно мониторить и реагировать."',
          competencyTags: ['autonomy']
        },
        {
          id: 'b',
          text: '"Data drift/концепт-дрифт. Нужны мониторинг, алерты, план переобучения."',
          score: 95,
          feedback: 'Петя: "Да. Это классика MLOps."',
          competencyTags: ['process.sdlc']
        },
        {
          id: 'c',
          text: '"Поменяю шрифт на дашборде, чтобы метрика выглядела лучше."',
          score: 0,
          feedback: 'Петя: "Очень смешно. Дальше."',
          competencyTags: ['documentation']
        },
        {
          id: 'd',
          text: '"Зафиксировать SLO и канареечные релизы, чтобы падение ловить раньше."',
          score: 80,
          feedback: 'Петя: "Верно. Релизы должны быть безопасными."',
          competencyTags: ['quality']
        }
      ],
      explanation: 'В проде качество может падать из-за drift. MLOps требует мониторинга данных/метрик, алертов и процесса переобучения/релиза.',
      domainId: 'mlops',
      difficulty: 1 as const
    },
    {
      id: 'ai-mlops-03',
      scenario: 'Продактовая команда просит делать релизы модели каждую неделю без "сюрпризов".',
      question: 'Что из этого ближе всего к правильному процессу?',
      choices: [
        {
          id: 'a',
          text: '"Каждый раз обучаем заново и сразу выкатываем без тестов."',
          score: 0,
          feedback: 'Петя: "Это гарантирует сюрпризы."',
          competencyTags: ['quality']
        },
        {
          id: 'b',
          text: '"CI/CD для ML: автоматические проверки данных, eval на наборе, регресс-тесты, staged rollout."',
          score: 95,
          feedback: 'Петя: "Да. ML-пайплайн должен быть тестируемым."',
          competencyTags: ['process.sdlc']
        },
        {
          id: 'c',
          text: '"Попросим пользователей потерпеть пару дней после релиза."',
          score: 10,
          feedback: 'Петя: "Так продукт не работает."',
          competencyTags: ['customer.relations']
        },
        {
          id: 'd',
          text: '"Опишу критерии отката и ответственность, чтобы команда знала, что делать."',
          score: 75,
          feedback: 'Петя: "Норм. Без ответственности процесс не держится."',
          competencyTags: ['autonomy']
        }
      ],
      explanation: 'Надёжные частые релизы требуют автоматизированных проверок (data checks, eval), регрессии и безопасного раската.',
      domainId: 'mlops',
      difficulty: 1 as const
    }
  ],
  middle: [
    {
      id: 'ai-mlops-04',
      scenario: 'После релиза появились жалобы: ответы стали «странными». Нужно быстро понять, это баг или данные изменились.',
      question: 'Что сделаешь первым делом?',
      choices: [
        {
          id: 'a',
          text: 'Сразу ретрейн на новых данных, без анализа.',
          score: 35,
          feedback: 'Петя: "Можно ухудшить. Сначала диагностика."',
          competencyTags: ['autonomy']
        },
        {
          id: 'b',
          text: 'Проверю метрики на проде, версии модели/фичей и изменения входных распределений.',
          score: 100,
          feedback: 'Петя: "Да. Наблюдаемость и проверка версий."',
          competencyTags: ['process.sdlc']
        },
        {
          id: 'c',
          text: 'Игнорировать: на тесте было хорошо, значит всё ок.',
          score: 0,
          feedback: 'Петя: "Прод — другой мир."',
          competencyTags: ['documentation']
        },
        {
          id: 'd',
          text: 'Попросить поддержку не принимать жалобы.',
          score: 0,
          feedback: 'Петя: "Нет."',
          competencyTags: ['customer.relations']
        }
      ],
      explanation: 'Первый шаг в MLOps-инциденте — диагностика: метрики, версии, drift и фактические изменения данных.',
      domainId: 'mlops',
      difficulty: 2 as const
    },
    {
      id: 'ai-mlops-05',
      scenario: 'Команда хочет воспроизводимость экспериментов и возможность сравнивать модели.',
      question: 'Что добавишь в процесс?',
      choices: [
        {
          id: 'a',
          text: 'Пусть все пишут результаты в общий чат.',
          score: 20,
          feedback: 'Петя: "Чат — не система."',
          competencyTags: ['documentation']
        },
        {
          id: 'b',
          text: 'Трекинг экспериментов: метрики, параметры, датасеты, артефакты и версии кода.',
          score: 100,
          feedback: 'Петя: "Да. Это база MLOps."',
          competencyTags: ['process.sdlc']
        },
        {
          id: 'c',
          text: 'Хранить только лучшую модель и удалять остальное.',
          score: 35,
          feedback: 'Петя: "Нужно уметь сравнивать и воспроизводить."',
          competencyTags: ['quality']
        },
        {
          id: 'd',
          text: 'Не фиксировать сиды и версии, иначе «слишком бюрократично».',
          score: 0,
          feedback: 'Петя: "Без этого нет воспроизводимости."',
          competencyTags: ['documentation']
        }
      ],
      explanation: 'Воспроизводимость требует учёта параметров, данных, метрик, артефактов и версий кода.',
      domainId: 'mlops',
      difficulty: 2 as const
    },
    {
      id: 'ai-mlops-06',
      scenario: 'Хочется выкатывать модели чаще, но боитесь регрессий качества.',
      question: 'Какой подход наиболее правильный?',
      choices: [
        {
          id: 'a',
          text: 'Запретить релизы чаще чем раз в месяц.',
          score: 25,
          feedback: 'Петя: "Нужно не запрещать, а ставить guardrails."',
          competencyTags: ['customer.relations']
        },
        {
          id: 'b',
          text: 'Офлайн/онлайн валидации, канарейка, мониторинг и автоматический откат.',
          score: 100,
          feedback: 'Петя: "Да. Управляемый релиз."',
          competencyTags: ['process.sdlc']
        },
        {
          id: 'c',
          text: 'Выкатывать сразу всем — быстрее узнаем правду.',
          score: 10,
          feedback: 'Петя: "Риск."',
          competencyTags: ['quality']
        },
        {
          id: 'd',
          text: 'Проверять качество вручную раз в неделю.',
          score: 40,
          feedback: 'Петя: "Надо автоматизировать."',
          competencyTags: ['autonomy']
        }
      ],
      explanation: 'Частые релизы требуют автоматизированных проверок и управляемого rollout: канарейки, мониторинг, откат.',
      domainId: 'mlops',
      difficulty: 2 as const
    }
  ],
  senior: [
    {
      id: 'ai-mlops-07',
      scenario: 'Часть фичей считается офлайн, часть онлайн, и возникают расхождения в значениях.',
      question: 'Какое решение самое зрелое?',
      choices: [
        {
          id: 'a',
          text: 'Пусть DS переписывают фичи в каждом сервисе вручную.',
          score: 0,
          feedback: 'Петя: "Так появляются расхождения."',
          competencyTags: ['quality']
        },
        {
          id: 'b',
          text: 'Единый источник трансформаций/контракты фичей + тесты консистентности offline/online.',
          score: 100,
          feedback: 'Петя: "Да. Это снижает баги и инциденты."',
          competencyTags: ['process.sdlc']
        },
        {
          id: 'c',
          text: 'Запретить онлайн-фичи.',
          score: 35,
          feedback: 'Петя: "Не всегда возможно."',
          competencyTags: ['customer.relations']
        },
        {
          id: 'd',
          text: 'Игнорировать, если метрика на тесте была хорошая.',
          score: 0,
          feedback: 'Петя: "Нет."',
          competencyTags: ['documentation']
        }
      ],
      explanation: 'Сеньорский MLOps — консистентность данных/фичей через контракты и единый источник трансформаций + тесты.',
      domainId: 'mlops',
      difficulty: 3 as const
    },
    {
      id: 'ai-mlops-08',
      scenario: 'После обновления кода препроцессинга качество резко изменилось: подозрение на несовместимость данных.',
      question: 'Что поможет предотвращать такое в будущем?',
      choices: [
        {
          id: 'a',
          text: 'Ничего: будем откатывать руками.',
          score: 25,
          feedback: 'Петя: "Нужно системно."',
          competencyTags: ['autonomy']
        },
        {
          id: 'b',
          text: 'Data contracts/схемы, тесты на данные, версионирование пайплайна и проверка совместимости.',
          score: 100,
          feedback: 'Петя: "Да. Контракты и тесты данных."',
          competencyTags: ['process.sdlc']
        },
        {
          id: 'c',
          text: 'Запретить любые изменения препроцессинга.',
          score: 20,
          feedback: 'Петя: "Нереалистично. Нужен контроль."',
          competencyTags: ['customer.relations']
        },
        {
          id: 'd',
          text: 'Скрыть детали препроцессинга от команды.',
          score: 0,
          feedback: 'Петя: "Нет."',
          competencyTags: ['documentation']
        }
      ],
      explanation: 'Контракты данных, тесты и версионирование пайплайнов помогают предотвращать неожиданные регрессии.',
      domainId: 'mlops',
      difficulty: 3 as const
    },
    {
      id: 'ai-mlops-09',
      scenario: 'Надо объяснить стейкхолдерам, почему релиз задерживается: нужны дополнительные проверки.',
      question: 'Какой подход правильный?',
      choices: [
        {
          id: 'a',
          text: 'Сказать: «так надо», без деталей.',
          score: 25,
          feedback: 'Петя: "Нужно объяснять риски и план."',
          competencyTags: ['customer.relations']
        },
        {
          id: 'b',
          text: 'Описать риски инцидентов и план: автоматизация, критерии качества, канарейки и мониторинг.',
          score: 100,
          feedback: 'Петя: "Да. Управление ожиданиями."',
          competencyTags: ['documentation']
        },
        {
          id: 'c',
          text: 'Свалить вину на инфраструктуру.',
          score: 0,
          feedback: 'Петя: "Нет."',
          competencyTags: ['customer.relations']
        },
        {
          id: 'd',
          text: 'Сказать, что ML всегда непредсказуем.',
          score: 30,
          feedback: 'Петя: "Это правда, но процесс должен быть управляемым."',
          competencyTags: ['autonomy']
        }
      ],
      explanation: 'Сеньор объясняет риски и предлагает меры качества: автоматизация проверок, rollout, мониторинг.',
      domainId: 'mlops',
      difficulty: 3 as const
    }
  ],
  architect: [
    {
      id: 'ai-mlops-10',
      scenario: 'Компания хочет общую ML-платформу для разных команд и продуктов.',
      question: 'Что должно быть в «ядре» платформы?',
      choices: [
        {
          id: 'a',
          text: 'Только GPU-кластер.',
          score: 15,
          feedback: 'Петя: "Ресурсы — лишь часть."',
          competencyTags: ['documentation']
        },
        {
          id: 'b',
          text: 'Registry моделей, pipelines, наблюдаемость, стандарты экспериментов, роли/доступы и политики.',
          score: 100,
          feedback: 'Петя: "Да. Это и есть платформа."',
          competencyTags: ['process.sdlc']
        },
        {
          id: 'c',
          text: 'Один общий ноутбук на всех.',
          score: 0,
          feedback: 'Петя: "Нет."',
          competencyTags: ['quality']
        },
        {
          id: 'd',
          text: 'Запретить командам менять что-либо.',
          score: 20,
          feedback: 'Петя: "Платформа должна помогать, а не запрещать."',
          competencyTags: ['customer.relations']
        }
      ],
      explanation: 'Платформа — это стандарты и сервисы вокруг ML: артефакты, пайплайны, мониторинг и доступы.',
      domainId: 'mlops',
      difficulty: 4 as const
    },
    {
      id: 'ai-mlops-11',
      scenario: 'Нужно балансировать гибкость команд и единые правила платформы.',
      question: 'Какой компромисс лучше?',
      choices: [
        {
          id: 'a',
          text: 'Жёстко стандартизировать всё и запретить исключения.',
          score: 35,
          feedback: 'Петя: "Будет сопротивление и обходы."',
          competencyTags: ['customer.relations']
        },
        {
          id: 'b',
          text: 'Сделать «золотой путь» + расширяемость шаблонами + SLA для базовых сценариев.',
          score: 100,
          feedback: 'Петя: "Да. Платформы так и делают."',
          competencyTags: ['autonomy']
        },
        {
          id: 'c',
          text: 'Пусть каждая команда делает как хочет, платформа не нужна.',
          score: 0,
          feedback: 'Петя: "Тогда проблема не решится."',
          competencyTags: ['process.sdlc']
        },
        {
          id: 'd',
          text: 'Договориться только устно.',
          score: 20,
          feedback: 'Петя: "Нужны правила и артефакты."',
          competencyTags: ['documentation']
        }
      ],
      explanation: 'Лучший компромисс — golden path + расширяемость: стандартизировать базу, но дать путь для кастома.',
      domainId: 'mlops',
      difficulty: 4 as const
    },
    {
      id: 'ai-mlops-12',
      scenario: 'Безопасность требует контроль доступа к моделям и данным (PII) и аудит релизов.',
      question: 'Что добавишь?',
      choices: [
        {
          id: 'a',
          text: 'Никаких ограничений: так быстрее.',
          score: 0,
          feedback: 'Петя: "Так нельзя."',
          competencyTags: ['customer.relations']
        },
        {
          id: 'b',
          text: 'RBAC, аудит релизов, политика хранения, секреты и approvals для критичных моделей.',
          score: 100,
          feedback: 'Петя: "Да."',
          competencyTags: ['process.sdlc']
        },
        {
          id: 'c',
          text: 'Скрыть всё в приватном репозитории и считать, что этого достаточно.',
          score: 30,
          feedback: 'Петя: "Нужны процессы, не только приватность."',
          competencyTags: ['documentation']
        },
        {
          id: 'd',
          text: 'Попросить юристов написать письмо.',
          score: 20,
          feedback: 'Петя: "Письмо не заменит контроль доступа."',
          competencyTags: ['customer.relations']
        }
      ],
      explanation: 'Архитектура ML-платформы должна учитывать доступы, аудит, комплаенс и approvals.',
      domainId: 'mlops',
      difficulty: 4 as const
    }
  ]
}

const SYSTEM_DESIGN_QUESTIONS = {
  junior: [
    {
      id: 'ai-sd-01',
      scenario: 'Тебе нужно сделать сервис рекомендаций. Продукт хочет "быстро в MVP" и потом масштабировать.',
      question: 'Какая первая архитектурная развилка самая важная?',
      choices: [
        {
          id: 'a',
          text: '"Сразу строим идеальную микросервисную платформу на 20 сервисов."',
          score: 20,
          feedback: 'Петя: "Для MVP это часто лишнее."',
          competencyTags: ['quality']
        },
        {
          id: 'b',
          text: '"Онлайн inference или оффлайн расчёт рекомендаций (batch) + кеш?"',
          score: 95,
          feedback: 'Петя: "Да. Это определяет latency, стоимость и сложность."',
          competencyTags: ['process.sdlc']
        },
        {
          id: 'c',
          text: '"Не важно. Главное — выбрать самый модный фреймворк."',
          score: 0,
          feedback: 'Петя: "Фреймворк — не архитектура."',
          competencyTags: ['documentation']
        },
        {
          id: 'd',
          text: '"Сначала уточню требования по latency/обновлению/объёму и зафиксирую контракт."',
          score: 80,
          feedback: 'Петя: "Верно. Требования первичны."',
          competencyTags: ['customer.relations']
        }
      ],
      explanation: 'В рекомендациях ключевое: online vs batch. Это влияет на SLA, стоимость, инфраструктуру и подход к данным.',
      domainId: 'system-design',
      difficulty: 1 as const
    },
    {
      id: 'ai-sd-02',
      scenario: 'Модель в проде даёт ответы, но иногда время ответа растёт до секунд. Инциденты участились.',
      question: 'Какой подход к стабильности наиболее разумный?',
      choices: [
        {
          id: 'a',
          text: '"Ничего. Пользователи привыкнут."',
          score: 0,
          feedback: 'Петя: "Нет. Нужны SLO и защита."',
          competencyTags: ['customer.relations']
        },
        {
          id: 'b',
          text: '"Ввести таймауты, деградацию (fallback), кэш, и лимиты на запросы."',
          score: 95,
          feedback: 'Петя: "Да. Это инженерная ответственность."',
          competencyTags: ['autonomy']
        },
        {
          id: 'c',
          text: '"Удалю мониторинг, он только раздражает алертами."',
          score: 0,
          feedback: 'Петя: "Мониторинг нужен, просто его надо настроить."',
          competencyTags: ['documentation']
        },
        {
          id: 'd',
          text: '"Сформулировать SLO, поставить метрики/трейсы и провести постмортемы."',
          score: 85,
          feedback: 'Петя: "Верно. Без измерений не будет стабильности."',
          competencyTags: ['process.sdlc']
        }
      ],
      explanation: 'Стабильность достигается SLO, мониторингом, таймаутами, деградацией, кэшем и лимитами. Постмортемы улучшают процесс.',
      domainId: 'system-design',
      difficulty: 1 as const
    },
    {
      id: 'ai-sd-03',
      scenario: 'Продукт просит объяснимость модели: почему она дала такой скор? Особенно для отказов.',
      question: 'Что ты предложишь как разумный первый шаг?',
      choices: [
        {
          id: 'a',
          text: '"Скажем пользователю: модель так решила, не задавайте вопросов."',
          score: 0,
          feedback: 'Петя: "Это путь к конфликтам и регуляторным рискам."',
          competencyTags: ['customer.relations']
        },
        {
          id: 'b',
          text: '"Логировать фичи/версии модели и добавить простые объяснения (SHAP/feature importance) где применимо."',
          score: 90,
          feedback: 'Петя: "Да. Начать можно с логирования и интерпретации."',
          competencyTags: ['documentation']
        },
        {
          id: 'c',
          text: '"Сразу перепишем всё на LLM, она объясняет лучше."',
          score: 10,
          feedback: 'Петя: "LLM не заменяет воспроизводимость и факты."',
          competencyTags: ['quality']
        },
        {
          id: 'd',
          text: '"Согласовать с бизнесом, какие объяснения реально нужны и как их оценивать."',
          score: 80,
          feedback: 'Петя: "Верно. Требования и оценка — часть дизайна."',
          competencyTags: ['process.sdlc']
        }
      ],
      explanation: 'Объяснимость начинается с воспроизводимости (версии модели/фичей) и простых методов интерпретации, плюс договорённость с бизнесом о формате.',
      domainId: 'system-design',
      difficulty: 1 as const
    }
  ],
  middle: [
    {
      id: 'ai-sd-04',
      scenario: 'Ты проектируешь сервис инференса модели. Требования: p95 latency < 200ms, нагрузка скачет.',
      question: 'Что предложишь как базовый план?',
      choices: [
        {
          id: 'a',
          text: 'Один инстанс без лимитов и очередей: так проще.',
          score: 20,
          feedback: 'Петя: "На скачках это даст инциденты."',
          competencyTags: ['quality']
        },
        {
          id: 'b',
          text: 'Горизонтальное масштабирование, лимиты, таймауты, очереди/батчинг и наблюдаемость.',
          score: 100,
          feedback: 'Петя: "Да. Это инженерный минимум под SLA."',
          competencyTags: ['process.sdlc']
        },
        {
          id: 'c',
          text: 'Не измерять latency: главное, чтобы «в среднем» быстро.',
          score: 0,
          feedback: 'Петя: "SLA держится на метриках, не на ощущениях."',
          competencyTags: ['documentation']
        },
        {
          id: 'd',
          text: 'Попросить пользователей не создавать нагрузку.',
          score: 0,
          feedback: 'Петя: "Нет."',
          competencyTags: ['customer.relations']
        }
      ],
      explanation: 'Инференс-сервис под SLA требует масштабирования, контроля нагрузки и наблюдаемости (SLO/метрики/трейсы).',
      domainId: 'system-design',
      difficulty: 2 as const
    },
    {
      id: 'ai-sd-05',
      scenario: 'Нужно хранить и вычислять фичи для онлайн-инференса и избежать offline/online skew.',
      question: 'Какой подход наиболее правильный?',
      choices: [
        {
          id: 'a',
          text: 'Считать фичи отдельно в каждом месте руками — быстрее.',
          score: 0,
          feedback: 'Петя: "Так ты гарантированно получишь расхождения."',
          competencyTags: ['quality']
        },
        {
          id: 'b',
          text: 'Контракты фичей и единый источник трансформаций + тесты консистентности.',
          score: 100,
          feedback: 'Петя: "Да. Это снижает инциденты."',
          competencyTags: ['process.sdlc']
        },
        {
          id: 'c',
          text: 'Хранить фичи в Google Sheets.',
          score: 0,
          feedback: 'Петя: "Нет."',
          competencyTags: ['documentation']
        },
        {
          id: 'd',
          text: 'Не фиксировать форматы и схемы: они мешают гибкости.',
          score: 15,
          feedback: 'Петя: "Без контрактов вы сломаете совместимость."',
          competencyTags: ['autonomy']
        }
      ],
      explanation: 'Offline/online skew предотвращают через контракты и единые трансформации, тесты и версионирование.',
      domainId: 'system-design',
      difficulty: 2 as const
    },
    {
      id: 'ai-sd-06',
      scenario: 'Сервис инференса падает при всплесках. Постмортем показал, что отсутствуют деградации и лимиты.',
      question: 'Что добавишь в дизайн?',
      choices: [
        {
          id: 'a',
          text: 'Ничего: просто будем быстрее поднимать упавшие инстансы.',
          score: 20,
          feedback: 'Петя: "Это лечение симптомов."',
          competencyTags: ['autonomy']
        },
        {
          id: 'b',
          text: 'Rate limits, timeouts, fallback, circuit breaker, защита от перегрузки и SLO.',
          score: 100,
          feedback: 'Петя: "Да. Защита от перегрузки — часть архитектуры."',
          competencyTags: ['process.sdlc']
        },
        {
          id: 'c',
          text: 'Убрать мониторинг, чтобы не было алертов.',
          score: 0,
          feedback: 'Петя: "Нет."',
          competencyTags: ['documentation']
        },
        {
          id: 'd',
          text: 'Согласовать с бизнесом, что downtime допустим.',
          score: 45,
          feedback: 'Петя: "Согласование важно, но архитектуру всё равно надо усиливать."',
          competencyTags: ['customer.relations']
        }
      ],
      explanation: 'Надёжность достигается защитой от перегрузки и деградациями: лимиты, таймауты, фоллбеки, circuit breakers.',
      domainId: 'system-design',
      difficulty: 2 as const
    }
  ],
  senior: [
    {
      id: 'ai-sd-07',
      scenario: 'Команда хочет добавить новую модель в прод, но боится регрессий и не понимает, как безопасно релизить.',
      question: 'Что предложишь как сеньор?',
      choices: [
        {
          id: 'a',
          text: 'Выкатывать сразу всем — быстрее узнаем.',
          score: 10,
          feedback: 'Петя: "Слишком рискованно."',
          competencyTags: ['quality']
        },
        {
          id: 'b',
          text: 'Канареечный релиз, shadow/candidate traffic, мониторинг метрик качества и быстрый откат.',
          score: 100,
          feedback: 'Петя: "Да. Это зрелый релизный процесс."',
          competencyTags: ['process.sdlc']
        },
        {
          id: 'c',
          text: 'Запретить релизы моделей, чтобы не было регрессий.',
          score: 20,
          feedback: 'Петя: "Бизнесу нужны изменения. Нужен процесс, не запрет."',
          competencyTags: ['customer.relations']
        },
        {
          id: 'd',
          text: 'Хранить только последнюю версию модели без истории.',
          score: 25,
          feedback: 'Петя: "Без версий откат невозможен."',
          competencyTags: ['documentation']
        }
      ],
      explanation: 'Сеньорский релиз ML — канарейки/shadow, мониторинг метрик и возможность отката.',
      domainId: 'system-design',
      difficulty: 3 as const
    },
    {
      id: 'ai-sd-08',
      scenario: 'Нужно обеспечить масштабируемость инференса и контролировать стоимость при росте нагрузки.',
      question: 'Что закладываешь?',
      choices: [
        {
          id: 'a',
          text: 'Игнорировать стоимость: главное — точность.',
          score: 20,
          feedback: 'Петя: "Стоимость — часть качества продукта."',
          competencyTags: ['customer.relations']
        },
        {
          id: 'b',
          text: 'Бюджеты/лимиты, авто-скейлинг, батчинг, кэш, разные модели по сложности запроса.',
          score: 100,
          feedback: 'Петя: "Да. Управление cost/perf trade-off."',
          competencyTags: ['autonomy']
        },
        {
          id: 'c',
          text: 'Убрать метрики, чтобы не нервничать.',
          score: 0,
          feedback: 'Петя: "Нет."',
          competencyTags: ['documentation']
        },
        {
          id: 'd',
          text: 'Только увеличить кластер в 3 раза и всё.',
          score: 45,
          feedback: 'Петя: "Иногда нужно, но лучше начинать с измерений и оптимизаций."',
          competencyTags: ['process.sdlc']
        }
      ],
      explanation: 'Масштабирование и стоимость требуют наблюдаемости и оптимизаций: батчинг, кэш, маршрутизация, лимиты, скейлинг.',
      domainId: 'system-design',
      difficulty: 3 as const
    },
    {
      id: 'ai-sd-09',
      scenario: 'Требуется объяснимость и аудит для модели, влияющей на решения по людям (кредит/скоринг).',
      question: 'Что это значит для архитектуры?',
      choices: [
        {
          id: 'a',
          text: 'Ничего, это задача DS, в системе это не нужно.',
          score: 0,
          feedback: 'Петя: "Нужно: аудит и воспроизводимость — системные требования."',
          competencyTags: ['customer.relations']
        },
        {
          id: 'b',
          text: 'Логирование решений, версии модели/фичей, объяснения, доступы, отчётность и процессы.',
          score: 100,
          feedback: 'Петя: "Да. Это часть системного дизайна."',
          competencyTags: ['documentation']
        },
        {
          id: 'c',
          text: 'Скрыть модель, чтобы никто не мог проверить.',
          score: 10,
          feedback: 'Петя: "Это повышает риск."',
          competencyTags: ['quality']
        },
        {
          id: 'd',
          text: 'Не хранить ничего и надеяться, что регулятор не спросит.',
          score: 0,
          feedback: 'Петя: "Нет."',
          competencyTags: ['documentation']
        }
      ],
      explanation: 'Для регулируемых систем нужны аудит и воспроизводимость: версии, логи решений, доступы и документация.',
      domainId: 'system-design',
      difficulty: 3 as const
    }
  ],
  architect: [
    {
      id: 'ai-sd-10',
      scenario: 'Компания хочет единую платформу для ML: обучение, registry, деплой, мониторинг.',
      question: 'Что является архитектурным «скелетом» решения?',
      choices: [
        {
          id: 'a',
          text: 'Один большой монолит без контрактов и версий.',
          score: 10,
          feedback: 'Петя: "Так быстро превратится в хаос."',
          competencyTags: ['quality']
        },
        {
          id: 'b',
          text: 'Артефакты и контракты: registry моделей, версии данных/фичей, стандарты пайплайнов и наблюдаемость.',
          score: 100,
          feedback: 'Петя: "Да. Платформа = стандарты и артефакты."',
          competencyTags: ['process.sdlc']
        },
        {
          id: 'c',
          text: 'Только GPU-кластер, остальное сделают команды.',
          score: 20,
          feedback: 'Петя: "Ресурсы не заменяют процессы."',
          competencyTags: ['customer.relations']
        },
        {
          id: 'd',
          text: 'Запретить командам менять пайплайны.',
          score: 25,
          feedback: 'Петя: "Платформа должна помогать, а не запрещать."',
          competencyTags: ['autonomy']
        }
      ],
      explanation: 'Архитектура платформы строится вокруг артефактов, контрактов, версий и наблюдаемости.',
      domainId: 'system-design',
      difficulty: 4 as const
    },
    {
      id: 'ai-sd-11',
      scenario: 'Несколько команд хотят разные стеки и фреймворки. Нужно сохранить скорость и единообразие.',
      question: 'Какой подход лучше?',
      choices: [
        {
          id: 'a',
          text: 'Разрешить всем всё, без правил.',
          score: 0,
          feedback: 'Петя: "Так вы потеряете управляемость."',
          competencyTags: ['quality']
        },
        {
          id: 'b',
          text: 'Golden path + расширяемость: шаблоны, плагины, контракты и SLA на базовые сценарии.',
          score: 100,
          feedback: 'Петя: "Да. Это платформенная стратегия."',
          competencyTags: ['autonomy']
        },
        {
          id: 'c',
          text: 'Запретить все фреймворки кроме одного.',
          score: 35,
          feedback: 'Петя: "Слишком жёстко."',
          competencyTags: ['customer.relations']
        },
        {
          id: 'd',
          text: 'Договориться только устно.',
          score: 20,
          feedback: 'Петя: "Нужны артефакты: контракты и документация."',
          competencyTags: ['documentation']
        }
      ],
      explanation: 'Golden path + расширяемость позволяет командам двигаться быстро, не ломая платформу и контракты.',
      domainId: 'system-design',
      difficulty: 4 as const
    },
    {
      id: 'ai-sd-12',
      scenario: 'Требования комплаенса: доступы, аудит, хранение данных и безопасность релизов моделей.',
      question: 'Что добавишь в архитектуру платформы?',
      choices: [
        {
          id: 'a',
          text: 'Ничего: комплаенс — забота юристов.',
          score: 0,
          feedback: 'Петя: "Комплаенс влияет на архитектуру."',
          competencyTags: ['customer.relations']
        },
        {
          id: 'b',
          text: 'RBAC, аудит, политики хранения, approvals, версии артефактов и управляемые релизы.',
          score: 100,
          feedback: 'Петя: "Да. Это обязательные требования."',
          competencyTags: ['process.sdlc']
        },
        {
          id: 'c',
          text: 'Скрыть всё в приватном репозитории и не документировать.',
          score: 20,
          feedback: 'Петя: "Нужны процессы и аудит."',
          competencyTags: ['documentation']
        },
        {
          id: 'd',
          text: 'Менять модели каждый день без контроля.',
          score: 0,
          feedback: 'Петя: "Так риски максимальны."',
          competencyTags: ['quality']
        }
      ],
      explanation: 'Комплаенс — это доступы, аудит, политики хранения, approvals и управляемый релизный процесс.',
      domainId: 'system-design',
      difficulty: 4 as const
    }
  ]
}

const AI_ETHICS_QUESTIONS = {
  junior: [
    {
      id: 'ai-eth-01',
      scenario: 'Ты сделал модель скоринга. Бизнес замечает, что для одной группы пользователей отказов заметно больше. Данных о причинах мало.',
      question: 'Какой правильный первый шаг?',
      choices: [
        {
          id: 'a',
          text: '"Игнорировать: если модель точная, значит всё честно."',
          score: 0,
          feedback: 'Петя: "Точность не гарантирует справедливость."',
          competencyTags: ['quality']
        },
        {
          id: 'b',
          text: '"Проверить метрики fairness/смещения, качество данных и возможные прокси-признаки."',
          score: 95,
          feedback: 'Петя: "Да. Нужно измерить и понять источник смещения."',
          competencyTags: ['process.sdlc']
        },
        {
          id: 'c',
          text: '"Уберём все признаки — будет честно."',
          score: 10,
          feedback: 'Петя: "Так ты сломаешь модель. Нужен контроль смещения, а не капитуляция."',
          competencyTags: ['autonomy']
        },
        {
          id: 'd',
          text: '"Согласовать с бизнесом и юристами, какие риски допустимы и какие требования по compliance."',
          score: 80,
          feedback: 'Петя: "Верно. Этика — это и требования, и процесс."',
          competencyTags: ['customer.relations']
        }
      ],
      explanation: 'Fairness нельзя угадать — её измеряют. Дальше ищут источники смещения в данных/фичах и согласуют требования по compliance.',
      domainId: 'ai-ethics',
      difficulty: 1 as const
    },
    {
      id: 'ai-eth-02',
      scenario: 'Команда хочет использовать LLM для генерации ответов клиентам. Иногда модель может выдать токсичный или конфиденциальный контент.',
      question: 'Какая мера наиболее практична на старте?',
      choices: [
        {
          id: 'a',
          text: '"Отключим логи, чтобы не было доказательств."',
          score: 0,
          feedback: 'Петя: "Это хуже. Нужна наблюдаемость."',
          competencyTags: ['documentation']
        },
        {
          id: 'b',
          text: '"Добавить модерацию/фильтры, политики, и human-in-the-loop для рискованных кейсов."',
          score: 95,
          feedback: 'Петя: "Да. Слои защиты важнее магии."',
          competencyTags: ['quality']
        },
        {
          id: 'c',
          text: '"Сделаем temperature повыше — токсичность уйдёт."',
          score: 0,
          feedback: 'Петя: "Нет. Temperature не решает безопасность."',
          competencyTags: ['autonomy']
        },
        {
          id: 'd',
          text: '"Определить, какие ответы допустимы, и как будем измерять инциденты."',
          score: 80,
          feedback: 'Петя: "Верно. Требования и метрики безопасности — часть процесса."',
          competencyTags: ['process.sdlc']
        }
      ],
      explanation: 'Для LLM в клиентских сценариях нужны слои защиты: фильтры/модерация, политики, человеческая проверка для рискованных кейсов и измеримость.',
      domainId: 'ai-ethics',
      difficulty: 1 as const
    },
    {
      id: 'ai-eth-03',
      scenario: 'Модель обучали на данных пользователей. Пришёл запрос: удалить данные конкретного пользователя и исключить его влияние.',
      question: 'Что реалистично сделать?',
      choices: [
        {
          id: 'a',
          text: '"Просто удалим строку из датасета и всё."',
          score: 25,
          feedback: 'Петя: "Если модель уже обучена, влияние может остаться."',
          competencyTags: ['documentation']
        },
        {
          id: 'b',
          text: '"Нужен процесс: удаление источников, переобучение/частичное переобучение, аудит артефактов."',
          score: 95,
          feedback: 'Петя: "Да. Это инженерный процесс и ответственность."',
          competencyTags: ['process.sdlc']
        },
        {
          id: 'c',
          text: '"Ничего не делаем, это невозможно."',
          score: 10,
          feedback: 'Петя: "Сложно, но процесс можно построить."',
          competencyTags: ['autonomy']
        },
        {
          id: 'd',
          text: '"Согласовать с юристами сроки и уровень гарантий, чтобы не обещать невозможного."',
          score: 80,
          feedback: 'Петя: "Верно. Обещания должны быть реалистичны."',
          competencyTags: ['customer.relations']
        }
      ],
      explanation: 'Удаление влияния пользователя часто требует переобучения и контроля артефактов. Важно иметь процесс и реалистичные обещания (юридически и технически).',
      domainId: 'ai-ethics',
      difficulty: 1 as const
    }
  ],
  middle: [
    {
      id: 'ai-eth-04',
      scenario: 'В обучающих данных много контента из прошлого, и модель начинает воспроизводить устаревшие или дискриминационные паттерны.',
      question: 'Что сделаешь?',
      choices: [
        {
          id: 'a',
          text: 'Ничего: модель просто отражает реальность.',
          score: 0,
          feedback: 'Петя: "Это и есть риск. Нужны меры."',
          competencyTags: ['quality']
        },
        {
          id: 'b',
          text: 'Построю метрики/срезы, введу фильтры и обновление датасета, проверю прокси-признаки.',
          score: 100,
          feedback: 'Петя: "Да. Сначала измерить, потом менять данные и правила."',
          competencyTags: ['process.sdlc']
        },
        {
          id: 'c',
          text: 'Запретить пользователям жаловаться.',
          score: 0,
          feedback: 'Петя: "Нет."',
          competencyTags: ['customer.relations']
        },
        {
          id: 'd',
          text: 'Сделать модель менее точной — тогда будет честнее.',
          score: 30,
          feedback: 'Петя: "Не всегда. Нужен баланс и контроль смещения."',
          competencyTags: ['autonomy']
        }
      ],
      explanation: 'Для смещений нужен измеримый контроль: срезы, метрики fairness, фильтры и обновление данных.',
      domainId: 'ai-ethics',
      difficulty: 2 as const
    },
    {
      id: 'ai-eth-05',
      scenario: 'Вы хотите использовать LLM в HR-сценарии (отбор кандидатов). Юристы спрашивают про риски.',
      question: 'Какой ответ самый правильный?',
      choices: [
        {
          id: 'a',
          text: 'LLM нейтральна, рисков нет.',
          score: 0,
          feedback: 'Петя: "Это неверно."',
          competencyTags: ['documentation']
        },
        {
          id: 'b',
          text: 'Оценка рисков: human-in-the-loop, аудит решений, прозрачность критериев, срезы fairness, процесс апелляций.',
          score: 100,
          feedback: 'Петя: "Да. В HR нужны строгие процессы и контроль."',
          competencyTags: ['customer.relations']
        },
        {
          id: 'c',
          text: 'Спрячем критерии, чтобы никто не спорил.',
          score: 10,
          feedback: 'Петя: "Сокрытие повышает риск."',
          competencyTags: ['quality']
        },
        {
          id: 'd',
          text: 'Будем менять модель каждую неделю без отчётности.',
          score: 0,
          feedback: 'Петя: "Это повышает риск и осложняет аудит."',
          competencyTags: ['process.sdlc']
        }
      ],
      explanation: 'В чувствительных сценариях нужны контроль и процессы: аудит, роли, прозрачность, human-in-the-loop и метрики fairness.',
      domainId: 'ai-ethics',
      difficulty: 2 as const
    },
    {
      id: 'ai-eth-06',
      scenario: 'В проде LLM иногда выдаёт уверенные, но неверные советы. Это приводит к ошибочным действиям пользователей.',
      question: 'Какое решение практичнее всего?',
      choices: [
        {
          id: 'a',
          text: 'Отключить все предупреждения: пользователи сами разберутся.',
          score: 0,
          feedback: 'Петя: "Нет."',
          competencyTags: ['customer.relations']
        },
        {
          id: 'b',
          text: 'Ограничить область, добавить источники (RAG), явные дисклеймеры, фоллбеки и мониторинг инцидентов.',
          score: 100,
          feedback: 'Петя: "Да. Управление риском и измеримость."',
          competencyTags: ['process.sdlc']
        },
        {
          id: 'c',
          text: 'Сделать temperature выше, чтобы ответы были дружелюбнее.',
          score: 0,
          feedback: 'Петя: "Температура не решает качество."',
          competencyTags: ['documentation']
        },
        {
          id: 'd',
          text: 'Попросить поддержку отвечать за модель.',
          score: 10,
          feedback: 'Петя: "Ответственность должна быть у команды."',
          competencyTags: ['autonomy']
        }
      ],
      explanation: 'Этика и безопасность LLM в проде — это ограничение области, источники, фоллбеки, дисклеймеры и мониторинг.',
      domainId: 'ai-ethics',
      difficulty: 2 as const
    }
  ],
  senior: [
    {
      id: 'ai-eth-07',
      scenario: 'Нужно формализовать процесс реагирования на инциденты с LLM: токсичность, утечки, вредные советы.',
      question: 'Что предложишь как сеньор?',
      choices: [
        {
          id: 'a',
          text: 'Разбирать инциденты «по настроению» без процесса.',
          score: 0,
          feedback: 'Петя: "Нужен повторяемый процесс."',
          competencyTags: ['autonomy']
        },
        {
          id: 'b',
          text: 'SLO по безопасности, классификация инцидентов, runbooks, ретроспективы и регрессионные тесты.',
          score: 100,
          feedback: 'Петя: "Да. Это зрелое управление риском."',
          competencyTags: ['process.sdlc']
        },
        {
          id: 'c',
          text: 'Скрывать инциденты, чтобы не портить отчётность.',
          score: 0,
          feedback: 'Петя: "Так нельзя."',
          competencyTags: ['customer.relations']
        },
        {
          id: 'd',
          text: 'Запретить продукту использовать LLM.',
          score: 25,
          feedback: 'Петя: "Запрет — крайность. Лучше управляемый риск."',
          competencyTags: ['customer.relations']
        }
      ],
      explanation: 'Сеньор строит процесс: runbooks, SLO, регрессионные тесты и ретроспективы инцидентов.',
      domainId: 'ai-ethics',
      difficulty: 3 as const
    },
    {
      id: 'ai-eth-08',
      scenario: 'Модель используется в сценарии, где ошибки могут повлиять на здоровье/безопасность.',
      question: 'Какой подход наиболее корректный?',
      choices: [
        {
          id: 'a',
          text: 'Ускорить релизы, чтобы быстрее улучшать качество.',
          score: 20,
          feedback: 'Петя: "В критичных системах релизы должны быть особенно контролируемыми."',
          competencyTags: ['quality']
        },
        {
          id: 'b',
          text: 'Чёткие границы применения, human-in-the-loop, валидация, аудит и контроль изменений.',
          score: 100,
          feedback: 'Петя: "Да. Это безопасность и этика."',
          competencyTags: ['process.sdlc']
        },
        {
          id: 'c',
          text: 'Сделать UI красивее, чтобы ошибки не замечали.',
          score: 0,
          feedback: 'Петя: "Нет."',
          competencyTags: ['customer.relations']
        },
        {
          id: 'd',
          text: 'Спрятать метрики качества.',
          score: 0,
          feedback: 'Петя: "Нет."',
          competencyTags: ['documentation']
        }
      ],
      explanation: 'В критичных сценариях нужны границы применения, человеческий контроль, аудит и строгие процессы изменений.',
      domainId: 'ai-ethics',
      difficulty: 3 as const
    },
    {
      id: 'ai-eth-09',
      scenario: 'Регулятор спрашивает: можете ли вы объяснить, почему модель приняла решение, и воспроизвести его через полгода?',
      question: 'Что отвечаешь и что должно быть в системе?',
      choices: [
        {
          id: 'a',
          text: 'Нет, это невозможно для ML.',
          score: 0,
          feedback: 'Петя: "Нужно строить воспроизводимость."',
          competencyTags: ['documentation']
        },
        {
          id: 'b',
          text: 'Версии данных/модели/фичей, логирование решений, доступы и отчётность.',
          score: 100,
          feedback: 'Петя: "Да."',
          competencyTags: ['process.sdlc']
        },
        {
          id: 'c',
          text: 'Спрячем детали модели.',
          score: 10,
          feedback: 'Петя: "Это увеличит риск."',
          competencyTags: ['quality']
        },
        {
          id: 'd',
          text: 'Удалим все логи, чтобы не было вопросов.',
          score: 0,
          feedback: 'Петя: "Нет."',
          competencyTags: ['customer.relations']
        }
      ],
      explanation: 'Регуляторика требует воспроизводимости и объяснимости: версии, логи решений, контроль доступа и документацию.',
      domainId: 'ai-ethics',
      difficulty: 3 as const
    }
  ],
  architect: [
    {
      id: 'ai-eth-10',
      scenario: 'Компания запускает несколько AI-продуктов. Нужны единые политики этики/безопасности и контроль.',
      question: 'Что закладываешь на уровне компании?',
      choices: [
        {
          id: 'a',
          text: 'Никаких политик: каждая команда сама разберётся.',
          score: 10,
          feedback: 'Петя: "Так будут разные риски и инциденты."',
          competencyTags: ['autonomy']
        },
        {
          id: 'b',
          text: 'Политики, процессы approvals, аудит, стандарты мониторинга и инцидент-менеджмент.',
          score: 100,
          feedback: 'Петя: "Да. Это governance."',
          competencyTags: ['process.sdlc']
        },
        {
          id: 'c',
          text: 'Скрыть все данные и метрики.',
          score: 0,
          feedback: 'Петя: "Нет."',
          competencyTags: ['documentation']
        },
        {
          id: 'd',
          text: 'Запретить все AI-продукты.',
          score: 0,
          feedback: 'Петя: "Нет."',
          competencyTags: ['customer.relations']
        }
      ],
      explanation: 'Governance по AI включает политики, approvals, аудит, мониторинг и процессы реагирования на инциденты.',
      domainId: 'ai-ethics',
      difficulty: 4 as const
    },
    {
      id: 'ai-eth-11',
      scenario: 'Нужно сделать систему, где модели могут использовать инструменты (tools), но нельзя допустить опасных действий.',
      question: 'Какой архитектурный подход лучше?',
      choices: [
        {
          id: 'a',
          text: 'Дать модели полный доступ ко всем инструментам.',
          score: 0,
          feedback: 'Петя: "Это небезопасно."',
          competencyTags: ['quality']
        },
        {
          id: 'b',
          text: 'Список разрешённых действий, валидация схем, sandboxes, approvals для критичных операций и аудит.',
          score: 100,
          feedback: 'Петя: "Да. Guardrails и контроль."',
          competencyTags: ['process.sdlc']
        },
        {
          id: 'c',
          text: 'Скрыть логи, чтобы никто не увидел ошибки.',
          score: 0,
          feedback: 'Петя: "Нет."',
          competencyTags: ['documentation']
        },
        {
          id: 'd',
          text: 'Ничего не делать, ведь модель «умная».',
          score: 0,
          feedback: 'Петя: "Нужны ограничения."',
          competencyTags: ['autonomy']
        }
      ],
      explanation: 'Архитектура безопасных tools требует guardrails: allowlist действий, валидации, sandboxes, approvals и аудита.',
      domainId: 'ai-ethics',
      difficulty: 4 as const
    },
    {
      id: 'ai-eth-12',
      scenario: 'Нужно масштабировать практику оценки рисков по AI: команды выпускают модели часто.',
      question: 'Что делаете на уровне платформы/процессов?',
      choices: [
        {
          id: 'a',
          text: 'Проводить ручную проверку каждой модели без автоматизации.',
          score: 25,
          feedback: 'Петя: "Не масштабируется."',
          competencyTags: ['documentation']
        },
        {
          id: 'b',
          text: 'Автоматизированные тесты/регрессии по безопасности, стандарты мониторинга и gate в CI/CD.',
          score: 100,
          feedback: 'Петя: "Да. Это масштабируемый контроль."',
          competencyTags: ['process.sdlc']
        },
        {
          id: 'c',
          text: 'Скрыть все метрики, чтобы не было вопросов.',
          score: 0,
          feedback: 'Петя: "Нет."',
          competencyTags: ['customer.relations']
        },
        {
          id: 'd',
          text: 'Запретить быстрые релизы моделей.',
          score: 30,
          feedback: 'Петя: "Нужно управлять, а не запрещать."',
          competencyTags: ['autonomy']
        }
      ],
      explanation: 'Масштабируемый контроль рисков — это автоматизация: тесты, gates, стандарты и наблюдаемость.',
      domainId: 'ai-ethics',
      difficulty: 4 as const
    }
  ]
}

const DATA_ENGINEERING_QUESTIONS = {
  junior: [
    {
      id: 'ai-de-01',
      scenario: 'У вас есть логи событий из приложения: user_id, event_name, timestamp. Продакт просит ежедневные метрики DAU/WAU и конверсию по воронке.',
      question: 'Как бы ты организовал пайплайн данных?',
      choices: [
        {
          id: 'a',
          text: '"Сложу CSV на общий диск и буду считать вручную раз в неделю."',
          score: 10,
          feedback: 'Петя: "Ручной расчёт быстро сломается. Нужен повторяемый пайплайн."',
          competencyTags: ['pipelines', 'automation', 'process.sdlc']
        },
        {
          id: 'b',
          text: '"Сделаю ingestion → очистка/нормализация → витрины (таблицы метрик) по расписанию (оркестратор)."',
          score: 95,
          feedback: 'Петя кивает: "Да. Слои и расписание — база. Плюс витрины под продуктовые запросы."',
          competencyTags: ['etl', 'orchestration', 'data-marts', 'quality']
        },
        {
          id: 'c',
          text: '"Сразу пишем всё в OLTP базу и считаем DAU запросом к продовой базе."',
          score: 25,
          feedback: 'Петя: "Продавую базу метриками можно положить. Нужен аналитический контур."',
          competencyTags: ['oltp', 'analytics', 'customer.relations']
        },
        {
          id: 'd',
          text: '"Сначала сделаю дашборд, а потом разберусь с источниками."',
          score: 20,
          feedback: 'Петя: "Дашборд без корректных данных — иллюзия контроля. Сначала пайплайн и качество."',
          competencyTags: ['data-quality', 'pipelines', 'documentation']
        }
      ],
      explanation: 'Для продуктовых метрик нужен повторяемый пайплайн: ingestion, трансформации, контроль качества и витрины (data marts) с регулярным обновлением.',
      domainId: 'data-engineering',
      difficulty: 1 as const
    },
    {
      id: 'ai-de-02',
      scenario: 'В таблице заказов появились дубликаты: один и тот же order_id встречается несколько раз из-за ретраев при загрузке.',
      question: 'Что сделаешь, чтобы пайплайн был идемпотентным?',
      choices: [
        {
          id: 'a',
          text: '"Ничего, потом удалю дубликаты вручную."',
          score: 10,
          feedback: 'Петя: "Ручная чистка не масштабируется. Идемпотентность должна быть в дизайне."',
          competencyTags: ['idempotency', 'autonomy']
        },
        {
          id: 'b',
          text: '"Сделаю upsert по ключу (order_id) или merge в staging/warehouse, чтобы повторная загрузка не создавала новые строки."',
          score: 95,
          feedback: 'Петя: "Да. Upsert/merge по ключу + контроль уникальности — стандарт."',
          competencyTags: ['upsert', 'merge', 'keys', 'quality']
        },
        {
          id: 'c',
          text: '"Просто добавлю случайный суффикс к order_id."',
          score: 0,
          feedback: 'Петя: "Так ты легализуешь мусор. Ключ должен быть стабильным."',
          competencyTags: ['keys', 'documentation']
        },
        {
          id: 'd',
          text: '"Увеличу таймауты и дубликатов не будет."',
          score: 20,
          feedback: 'Петя: "Дубликаты часто появляются из-за ретраев и сетевых ошибок. Таймауты проблему не решают."',
          competencyTags: ['retries', 'pipelines', 'process.sdlc']
        }
      ],
      explanation: 'Идемпотентность достигается через upsert/merge по уникальному ключу, дедупликацию в staging и проверки ограничений.',
      domainId: 'data-engineering',
      difficulty: 1 as const
    },
    {
      id: 'ai-de-03',
      scenario: 'Ты построил витрину метрик. Через неделю бизнес заметил, что цифры "скачут" при пересчёте за прошлые дни.',
      question: 'Как бы ты снизил риск таких сюрпризов?',
      choices: [
        {
          id: 'a',
          text: '"Перестану пересчитывать прошлое — пусть будет как есть."',
          score: 30,
          feedback: 'Петя: "Иногда так делают, но нужно понимать причины. Иначе ошибки закрепляются."',
          competencyTags: ['backfill', 'customer.relations']
        },
        {
          id: 'b',
          text: '"Добавлю data quality checks, версионирование витрин/логики и явные правила backfill (например, окно пересчёта)."',
          score: 90,
          feedback: 'Петя: "Да. Качество данных + контроль изменений + понятная политика пересчёта."',
          competencyTags: ['data-quality', 'versioning', 'backfill', 'quality']
        },
        {
          id: 'c',
          text: '"Спрячу метрики, чтобы никто не видел."',
          score: 0,
          feedback: 'Петя: "Не вариант. Нужны прозрачность и контроль качества."',
          competencyTags: ['data-quality', 'documentation']
        },
        {
          id: 'd',
          text: '"Попросим аналитика объяснять руками каждый скачок."',
          score: 20,
          feedback: 'Петя: "Это дорого и нестабильно. Лучше автоматизировать проверки и процессы."',
          competencyTags: ['automation', 'data-quality', 'autonomy']
        }
      ],
      explanation: 'Стабильность метрик обеспечивают quality checks, контроль изменений логики расчёта и договорённая стратегия backfill/пересчёта.',
      domainId: 'data-engineering',
      difficulty: 1 as const
    }
  ],
  middle: [
    {
      id: 'ai-de-04',
      scenario: 'ETL-пайплайн периодически падает из-за «грязных» данных. Команда устала чинить вручную.',
      question: 'Что сделаешь, чтобы стабилизировать процесс?',
      choices: [
        {
          id: 'a',
          text: 'Пусть аналитики вручную правят данные перед загрузкой.',
          score: 20,
          feedback: 'Петя: "Это не масштабируется."',
          competencyTags: ['customer.relations']
        },
        {
          id: 'b',
          text: 'Ввести data quality checks, схемы/контракты, quarantine и алерты.',
          score: 100,
          feedback: 'Петя: "Да. Нужны автоматические проверки и управление ошибками."',
          competencyTags: ['process.sdlc']
        },
        {
          id: 'c',
          text: 'Отключить проверки, чтобы пайплайн не падал.',
          score: 0,
          feedback: 'Петя: "Так ты просто спрячешь проблему."',
          competencyTags: ['quality']
        },
        {
          id: 'd',
          text: 'Сохранить ошибки в лог и забыть.',
          score: 30,
          feedback: 'Петя: "Логи полезны, но нужна реакция и процесс."',
          competencyTags: ['documentation']
        }
      ],
      explanation: 'Стабильный ETL требует проверок качества, контрактов, quarantine-стратегии и наблюдаемости.',
      domainId: 'data-engineering',
      difficulty: 2 as const
    },
    {
      id: 'ai-de-05',
      scenario: 'Бизнес просит обновлять витрину каждые 15 минут. Сейчас пересчёт занимает часы.',
      question: 'Какой подход логичен?',
      choices: [
        {
          id: 'a',
          text: 'Пересчитывать всё целиком каждые 15 минут.',
          score: 10,
          feedback: 'Петя: "Это дорого."',
          competencyTags: ['quality']
        },
        {
          id: 'b',
          text: 'Инкрементальные обновления, partitioning, watermarking и контроль задержек.',
          score: 100,
          feedback: 'Петя: "Да. Инкрементальность — ключ."',
          competencyTags: ['autonomy']
        },
        {
          id: 'c',
          text: 'Уменьшить точность данных, чтобы быстрее.',
          score: 25,
          feedback: 'Петя: "Иногда можно, но это решение нужно согласовывать и измерять."',
          competencyTags: ['customer.relations']
        },
        {
          id: 'd',
          text: 'Скрыть задержки от бизнеса.',
          score: 0,
          feedback: 'Петя: "Нет."',
          competencyTags: ['customer.relations']
        }
      ],
      explanation: 'Частые обновления витрин обычно требуют инкрементальных пересчётов, партиционирования и watermarks.',
      domainId: 'data-engineering',
      difficulty: 2 as const
    },
    {
      id: 'ai-de-06',
      scenario: 'Данные приходят с опозданием и задним числом (late events). Из-за этого метрики «прыгают» после пересчётов.',
      question: 'Как правильно управлять этим?',
      choices: [
        {
          id: 'a',
          text: 'Запретить late events: пусть источник исправит.',
          score: 25,
          feedback: 'Петя: "Иногда можно, но чаще источник не идеален."',
          competencyTags: ['customer.relations']
        },
        {
          id: 'b',
          text: 'Явная политика: окна/задержки, backfill, версии витрин и коммуникация изменений.',
          score: 100,
          feedback: 'Петя: "Да. Это процесс и договорённости."',
          competencyTags: ['process.sdlc']
        },
        {
          id: 'c',
          text: 'Игнорировать: прыгает и прыгает.',
          score: 0,
          feedback: 'Петя: "Так вы потеряете доверие."',
          competencyTags: ['quality']
        },
        {
          id: 'd',
          text: 'Удалять старые данные, чтобы не пересчитывать.',
          score: 20,
          feedback: 'Петя: "Опасно для аналитики."',
          competencyTags: ['documentation']
        }
      ],
      explanation: 'Late events требуют политики окон/задержек, backfill-стратегий и прозрачной коммуникации влияния на метрики.',
      domainId: 'data-engineering',
      difficulty: 2 as const
    }
  ],
  senior: [
    {
      id: 'ai-de-07',
      scenario: 'В компании несколько источников данных и команд. Витрины ломаются из-за неожиданных изменений схем.',
      question: 'Какое решение будет самым зрелым?',
      choices: [
        {
          id: 'a',
          text: 'Просить всех писать в чат перед изменениями.',
          score: 30,
          feedback: 'Петя: "Чат не заменяет контракты."',
          competencyTags: ['documentation']
        },
        {
          id: 'b',
          text: 'Data contracts, schema registry, совместимость, CI-проверки и процесс депрекейта.',
          score: 100,
          feedback: 'Петя: "Да. Это снижает инциденты."',
          competencyTags: ['process.sdlc']
        },
        {
          id: 'c',
          text: 'Отключить проверки схем — так меньше падений.',
          score: 0,
          feedback: 'Петя: "Так вы сломаете качество."',
          competencyTags: ['quality']
        },
        {
          id: 'd',
          text: 'Дублировать данные в нескольких местах на всякий случай.',
          score: 25,
          feedback: 'Петя: "Это увеличит сложность и расхождения."',
          competencyTags: ['autonomy']
        }
      ],
      explanation: 'Сеньорский уровень — контракты данных, registry схем, проверки совместимости и управляемое изменение.',
      domainId: 'data-engineering',
      difficulty: 3 as const
    },
    {
      id: 'ai-de-08',
      scenario: 'Нужно обеспечить качество витрин: ошибки иногда незаметны, но приводят к неправильным решениям бизнеса.',
      question: 'Что добавишь в процесс?',
      choices: [
        {
          id: 'a',
          text: 'Ничего: если никто не заметил, значит всё ок.',
          score: 0,
          feedback: 'Петя: "Нет."',
          competencyTags: ['quality']
        },
        {
          id: 'b',
          text: 'Тесты данных, мониторинг аномалий, алерты и владелец метрик (data owner).',
          score: 100,
          feedback: 'Петя: "Да. Нужна наблюдаемость качества."',
          competencyTags: ['process.sdlc']
        },
        {
          id: 'c',
          text: 'Сделать отчёт раз в квартал.',
          score: 25,
          feedback: 'Петя: "Слишком редко."',
          competencyTags: ['documentation']
        },
        {
          id: 'd',
          text: 'Попросить аналитиков смотреть глазами каждый день.',
          score: 30,
          feedback: 'Петя: "Не масштабируется."',
          competencyTags: ['customer.relations']
        }
      ],
      explanation: 'Качество данных поддерживается тестами, мониторингом аномалий и ответственностью за метрики.',
      domainId: 'data-engineering',
      difficulty: 3 as const
    },
    {
      id: 'ai-de-09',
      scenario: 'В системе много зависимостей между витринами. Любое изменение вызывает каскад пересчётов и задержки.',
      question: 'Что будет правильным решением?',
      choices: [
        {
          id: 'a',
          text: 'Удалить зависимости и считать всё вручную.',
          score: 10,
          feedback: 'Петя: "Это не решение."',
          competencyTags: ['autonomy']
        },
        {
          id: 'b',
          text: 'Линия происхождения (lineage), оркестрация, инкрементальность и оптимизация графа зависимостей.',
          score: 100,
          feedback: 'Петя: "Да. Нужна управляемость графа."',
          competencyTags: ['process.sdlc']
        },
        {
          id: 'c',
          text: 'Ничего: пусть задачи идут как идут.',
          score: 0,
          feedback: 'Петя: "Нет."',
          competencyTags: ['quality']
        },
        {
          id: 'd',
          text: 'Прятать задержки от пользователей.',
          score: 0,
          feedback: 'Петя: "Нет."',
          competencyTags: ['customer.relations']
        }
      ],
      explanation: 'При множестве витрин важны lineage, оркестрация и оптимизация/инкрементальность графа зависимостей.',
      domainId: 'data-engineering',
      difficulty: 3 as const
    }
  ],
  architect: [
    {
      id: 'ai-de-10',
      scenario: 'Вы строите data platform для нескольких команд. Цели: стандарты, качество, безопасность и скорость разработки.',
      question: 'Что заложишь в основу?',
      choices: [
        {
          id: 'a',
          text: 'Пусть каждая команда строит пайплайны как хочет.',
          score: 20,
          feedback: 'Петя: "Будет зоопарк."',
          competencyTags: ['autonomy']
        },
        {
          id: 'b',
          text: 'Контракты данных, стандарты пайплайнов, наблюдаемость качества, RBAC и каталог данных.',
          score: 100,
          feedback: 'Петя: "Да. Это платформа."',
          competencyTags: ['process.sdlc']
        },
        {
          id: 'c',
          text: 'Только дешёвое хранилище.',
          score: 15,
          feedback: 'Петя: "Хранилище — часть, но без процессов будет хаос."',
          competencyTags: ['quality']
        },
        {
          id: 'd',
          text: 'Запретить любые изменения схем.',
          score: 25,
          feedback: 'Петя: "Нереалистично. Нужны управляемые изменения."',
          competencyTags: ['customer.relations']
        }
      ],
      explanation: 'Платформа данных строится вокруг контрактов, стандартов, наблюдаемости, безопасности и каталога/lineage.',
      domainId: 'data-engineering',
      difficulty: 4 as const
    },
    {
      id: 'ai-de-11',
      scenario: 'Нужно поддерживать self-service для команд и при этом контролировать качество и безопасность.',
      question: 'Какой подход наиболее удачный?',
      choices: [
        {
          id: 'a',
          text: 'Разрешить всем делать всё без ограничений.',
          score: 0,
          feedback: 'Петя: "Это риск."',
          competencyTags: ['quality']
        },
        {
          id: 'b',
          text: 'Golden path + шаблоны + политики/гейты качества и RBAC.',
          score: 100,
          feedback: 'Петя: "Да."',
          competencyTags: ['process.sdlc']
        },
        {
          id: 'c',
          text: 'Запретить self-service: только платформа делает пайплайны.',
          score: 35,
          feedback: 'Петя: "Скорость команд упадёт."',
          competencyTags: ['customer.relations']
        },
        {
          id: 'd',
          text: 'Договориться только устно.',
          score: 20,
          feedback: 'Петя: "Нужны артефакты и правила."',
          competencyTags: ['documentation']
        }
      ],
      explanation: 'Self-service обычно строят через golden path, шаблоны и автоматические гейты качества/безопасности.',
      domainId: 'data-engineering',
      difficulty: 4 as const
    },
    {
      id: 'ai-de-12',
      scenario: 'Нужно обеспечить аудит и соответствие требованиям (PII, доступы, хранение).',
      question: 'Что добавишь на уровне платформы?',
      choices: [
        {
          id: 'a',
          text: 'Ничего: безопасность — забота юристов.',
          score: 0,
          feedback: 'Петя: "Безопасность — часть архитектуры."',
          competencyTags: ['customer.relations']
        },
        {
          id: 'b',
          text: 'RBAC, аудит доступа, политики хранения, классификация данных и approvals.',
          score: 100,
          feedback: 'Петя: "Да."',
          competencyTags: ['process.sdlc']
        },
        {
          id: 'c',
          text: 'Скрыть логи, чтобы никто не видел ошибки.',
          score: 0,
          feedback: 'Петя: "Нет."',
          competencyTags: ['documentation']
        },
        {
          id: 'd',
          text: 'Раздать всем доступ к данным, чтобы было быстрее.',
          score: 0,
          feedback: 'Петя: "Нет."',
          competencyTags: ['quality']
        }
      ],
      explanation: 'Комплаенс в данных требует контроля доступа, аудита, политик хранения и управления PII.',
      domainId: 'data-engineering',
      difficulty: 4 as const
    }
  ]
}

export const AI_CAREER_PATH: CareerPath = {
  id: 'ai',
  name: 'AI & Machine Learning',
  description: 'Карьерный путь в машинном обучении и AI: от основ ML до проектирования платформ и MLOps.',
  icon: 'ai',
  levels: [
    { id: 'ai-junior', title: 'AI Junior', minAvgScore: 0, minDomainScore: 0, minDomainsAttempted: 1 },
    { id: 'ai-middle', title: 'AI Middle', minAvgScore: 50, minDomainScore: 30, minDomainsAttempted: 2 },
    { id: 'ai-senior', title: 'AI Senior', minAvgScore: 70, minDomainScore: 50, minDomainsAttempted: 4 },
    { id: 'ai-architect', title: 'AI Architect', minAvgScore: 85, minDomainScore: 70, minDomainsAttempted: 6 }
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
    {
      id: 'data-engineering',
      name: 'Инженерия данных',
      description: 'ETL, пайплайны данных, хранилища.',
      icon: 'domain',
      careerPathId: 'ai',
      topics: [
        { id: 'de-junior', name: 'Базовый уровень', level: 'ai-junior', questions: DATA_ENGINEERING_QUESTIONS.junior },
        { id: 'de-middle', name: 'Средний уровень', level: 'ai-middle', questions: DATA_ENGINEERING_QUESTIONS.middle },
        { id: 'de-senior', name: 'Продвинутый уровень', level: 'ai-senior', questions: DATA_ENGINEERING_QUESTIONS.senior },
        { id: 'de-architect', name: 'Архитектурный уровень', level: 'ai-architect', questions: DATA_ENGINEERING_QUESTIONS.architect }
      ]
    },
    {
      id: 'deep-learning',
      name: 'Глубокое обучение',
      description: 'Нейросети, оптимизация, регуляризация.',
      icon: 'domain',
      careerPathId: 'ai',
      topics: [
        { id: 'dl-junior', name: 'Базовый уровень', level: 'ai-junior', questions: DEEP_LEARNING_QUESTIONS.junior },
        { id: 'dl-middle', name: 'Средний уровень', level: 'ai-middle', questions: DEEP_LEARNING_QUESTIONS.middle },
        { id: 'dl-senior', name: 'Продвинутый уровень', level: 'ai-senior', questions: DEEP_LEARNING_QUESTIONS.senior },
        { id: 'dl-architect', name: 'Архитектурный уровень', level: 'ai-architect', questions: DEEP_LEARNING_QUESTIONS.architect }
      ],
      unlockCondition: { minScoreInAnyDomain: 30 }
    },
    {
      id: 'nlp-llms',
      name: 'NLP и большие языковые модели',
      description: 'Тексты, эмбеддинги, LLM.',
      icon: 'domain',
      careerPathId: 'ai',
      topics: [
        { id: 'nlp-junior', name: 'Базовый уровень', level: 'ai-junior', questions: NLP_LLMS_QUESTIONS.junior },
        { id: 'nlp-middle', name: 'Средний уровень', level: 'ai-middle', questions: NLP_LLMS_QUESTIONS.middle },
        { id: 'nlp-senior', name: 'Продвинутый уровень', level: 'ai-senior', questions: NLP_LLMS_QUESTIONS.senior },
        { id: 'nlp-architect', name: 'Архитектурный уровень', level: 'ai-architect', questions: NLP_LLMS_QUESTIONS.architect }
      ],
      unlockCondition: { minScoreInAnyDomain: 30 }
    },
    {
      id: 'computer-vision',
      name: 'Компьютерное зрение',
      description: 'Классификация и детекция на изображениях.',
      icon: 'domain',
      careerPathId: 'ai',
      topics: [
        { id: 'cv-junior', name: 'Базовый уровень', level: 'ai-junior', questions: COMPUTER_VISION_QUESTIONS.junior },
        { id: 'cv-middle', name: 'Средний уровень', level: 'ai-middle', questions: COMPUTER_VISION_QUESTIONS.middle },
        { id: 'cv-senior', name: 'Продвинутый уровень', level: 'ai-senior', questions: COMPUTER_VISION_QUESTIONS.senior },
        { id: 'cv-architect', name: 'Архитектурный уровень', level: 'ai-architect', questions: COMPUTER_VISION_QUESTIONS.architect }
      ],
      unlockCondition: { minDomainsWithScore: { count: 3, minScore: 50 } }
    },
    {
      id: 'mlops',
      name: 'MLOps и деплой моделей',
      description: 'Деплой, мониторинг, пайплайны.',
      icon: 'domain',
      careerPathId: 'ai',
      topics: [
        { id: 'mlops-junior', name: 'Базовый уровень', level: 'ai-junior', questions: MLOPS_QUESTIONS.junior },
        { id: 'mlops-middle', name: 'Средний уровень', level: 'ai-middle', questions: MLOPS_QUESTIONS.middle },
        { id: 'mlops-senior', name: 'Продвинутый уровень', level: 'ai-senior', questions: MLOPS_QUESTIONS.senior },
        { id: 'mlops-architect', name: 'Архитектурный уровень', level: 'ai-architect', questions: MLOPS_QUESTIONS.architect }
      ],
      unlockCondition: { minDomainsWithScore: { count: 3, minScore: 50 } }
    },
    {
      id: 'system-design',
      name: 'Проектирование AI-систем',
      description: 'Архитектура ML-систем и платформ.',
      icon: 'domain',
      careerPathId: 'ai',
      topics: [
        { id: 'sd-junior', name: 'Базовый уровень', level: 'ai-junior', questions: SYSTEM_DESIGN_QUESTIONS.junior },
        { id: 'sd-middle', name: 'Средний уровень', level: 'ai-middle', questions: SYSTEM_DESIGN_QUESTIONS.middle },
        { id: 'sd-senior', name: 'Продвинутый уровень', level: 'ai-senior', questions: SYSTEM_DESIGN_QUESTIONS.senior },
        { id: 'sd-architect', name: 'Архитектурный уровень', level: 'ai-architect', questions: SYSTEM_DESIGN_QUESTIONS.architect }
      ],
      unlockCondition: { minDomainsWithScore: { count: 3, minScore: 50 } }
    },
    {
      id: 'ai-ethics',
      name: 'Этика и безопасность AI',
      description: 'Смещение, честность, границы применения.',
      icon: 'domain',
      careerPathId: 'ai',
      topics: [
        { id: 'eth-junior', name: 'Базовый уровень', level: 'ai-junior', questions: AI_ETHICS_QUESTIONS.junior },
        { id: 'eth-middle', name: 'Средний уровень', level: 'ai-middle', questions: AI_ETHICS_QUESTIONS.middle },
        { id: 'eth-senior', name: 'Продвинутый уровень', level: 'ai-senior', questions: AI_ETHICS_QUESTIONS.senior },
        { id: 'eth-architect', name: 'Архитектурный уровень', level: 'ai-architect', questions: AI_ETHICS_QUESTIONS.architect }
      ],
      unlockCondition: { minDomainsWithScore: { count: 5, minScore: 60 } }
    }
  ],
  npcAssessors: [
    { npcId: 'petya-senior', domainIds: ['ml-fundamentals', 'data-engineering', 'deep-learning', 'mlops', 'system-design'] },
    { npcId: 'masha-qa', domainIds: ['ml-fundamentals', 'mlops'] },
    { npcId: 'olga-product', domainIds: ['ml-fundamentals', 'ai-ethics'] },
    { npcId: 'professor-neuronov', domainIds: ['ml-fundamentals', 'deep-learning', 'nlp-llms', 'computer-vision', 'ai-ethics'] }
  ],
  unlockCondition: { minRespect: 20 }
}
