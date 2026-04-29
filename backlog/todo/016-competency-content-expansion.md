# Наполнение матрицы — все домены компетенций

## Описание
Наполнить оставшиеся 7 доменов матрицы компетенций вопросами-ситуациями (в задаче 009 заполнен только ML Fundamentals). Каждый домен — минимум 12 вопросов (3 на уровень). Все вопросы — реальные рабочие ситуации, а не экзаменационные тесты. Правильные ответы должны отражать актуальные best practices в индустрии.

## Definition of Ready (DOR)
- [x] Задача четко сформулирована
- [x] Определены критерии приемки
- [x] Оценена сложность (Story Points)
- [x] Нет блокирующих зависимостей
- [x] Определены необходимые ресурсы/ассеты

## Definition of Done (DOD)
- [ ] Код написан и работает
- [ ] Код соответствует стайлгайду
- [ ] Функционал протестирован вручную
- [ ] Нет консольных ошибок
- [ ] Документация обновлена (если требуется)
- [ ] Код прошел ревью (если требуется)

## Критерии приемки
1. Каждый из 7 доменов содержит минимум 12 вопросов
2. Вопросы распределены по 4 уровням (ai-junior, ai-middle, ai-senior, ai-architect)
3. Каждый вопрос — рабочая ситуация с контекстом, не абстрактный теоретический вопрос
4. У каждого варианта ответа адекватный score, feedback от NPC и competencyTags
5. explanation содержит полезное объяснение (образовательная ценность)
6. Вопросы отражают актуальные best practices (2025-2026)
7. Нет дублирования тем между доменами
8. Компилируется без ошибок

## Технические детали

### Файл: `src/data/competencyMatrix.ts`

Дополнить существующие заглушки доменов реальными вопросами.

### Домен: Data Engineering (`data-engineering`)

**Темы по уровням:**

ai-junior:
- Обработка пропущенных значений (missing values strategy)
- Нормализация vs стандартизация (когда что применять)
- Разделение данных train/val/test (правильные пропорции, стратификация)

ai-middle:
- Feature engineering для табличных данных
- Обработка категориальных фичей (one-hot, target encoding, embeddings)
- Data quality — обнаружение аномалий и выбросов в данных

ai-senior:
- Построение data pipeline для ML (Airflow, dbt, Spark)
- Работа с большими датасетами (out-of-memory strategies)
- Data versioning и reproducibility (DVC, Delta Lake)

ai-architect:
- Проектирование data lake / data mesh для ML-команды
- Real-time feature store (Feast, Tecton)
- Data governance и compliance (GDPR, data lineage)

### Домен: Deep Learning (`deep-learning`)

ai-junior:
- Выбор функции активации (ReLU vs sigmoid vs tanh)
- Overfitting в нейросетях (dropout, batch norm, early stopping)
- Transfer learning — когда и зачем использовать pre-trained модели

ai-middle:
- Выбор архитектуры (CNN vs RNN vs Transformer для конкретной задачи)
- Оптимизация гиперпараметров (learning rate scheduling, batch size)
- Работа с GPU/TPU — оптимизация обучения (mixed precision, gradient accumulation)

ai-senior:
- Дистилляция знаний (knowledge distillation) для production
- Архитектура multi-task learning модели
- Обучение на зашумлённых данных (noisy labels)

ai-architect:
- Проектирование training infrastructure для крупных моделей
- Distributed training стратегии (data parallel, model parallel, pipeline parallel)
- Оценка ROI: когда обучать свою модель vs использовать API

### Домен: NLP / LLMs (`nlp-llms`)

ai-junior:
- Токенизация — BPE vs WordPiece vs SentencePiece
- Embeddings — Word2Vec vs FastText vs contextual (BERT)
- Prompt engineering — как формулировать промпты для LLM

ai-middle:
- RAG vs Fine-tuning — когда что использовать
- Оценка качества текстовой генерации (BLEU, ROUGE, human eval)
- Работа с контекстным окном LLM (chunking, summarization)

ai-senior:
- Проектирование RAG-системы (chunking strategy, reranking, hybrid search)
- Fine-tuning LLM (LoRA, QLoRA, full fine-tuning — trade-offs)
- Работа с галлюцинациями LLM (grounding, fact-checking, guardrails)

ai-architect:
- Проектирование multi-agent LLM системы
- Оптимизация стоимости LLM-инфраструктуры (caching, routing, model selection)
- LLM в production — latency, throughput, reliability

### Домен: Computer Vision (`computer-vision`)

ai-junior:
- Выбор архитектуры для image classification (ResNet, EfficientNet, ViT)
- Data augmentation для CV (когда какие аугментации уместны)
- Метрики для object detection (IoU, mAP)

ai-middle:
- Transfer learning в CV — fine-tuning стратегии
- Работа с малым количеством данных (few-shot, self-supervised)
- Выбор между detection моделями (YOLO, DETR, Faster R-CNN)

ai-senior:
- Оптимизация CV-моделей для edge-устройств (pruning, quantization, ONNX)
- Video understanding pipeline (sampling strategy, temporal models)
- Мультимодальные модели (CLIP, Flamingo) — когда применять

ai-architect:
- Real-time CV pipeline (камеры → inference → action) — архитектура
- Масштабирование CV-сервиса (batch inference, GPU sharing)
- Synthetic data generation для CV (когда оправдано, как валидировать)

### Домен: MLOps (`mlops`)

ai-junior:
- Model versioning (MLflow, W&B) — зачем и как
- Разница между dev-эксперимент и production-модель
- Базовый CI/CD для ML (тесты данных, тесты модели)

ai-middle:
- Containerization ML-моделей (Docker, служба inference)
- A/B тестирование моделей (canary deployment, shadow mode)
- Мониторинг моделей в production (data drift, concept drift)

ai-senior:
- Feature store — проектирование и выбор (online vs offline)
- ML Pipeline orchestration (Kubeflow, Vertex AI, SageMaker)
- Автоматический retraining — когда и как запускать

ai-architect:
- Проектирование ML Platform для организации (100+ DS)
- Cost optimization для ML-инфраструктуры (spot instances, auto-scaling)
- Governance и compliance ML-моделей (model registry, audit trail)

### Домен: System Design (`system-design`)

ai-junior:
- Выбор ML-фреймворка для задачи (sklearn vs PyTorch vs TensorFlow)
- REST API vs gRPC для serving модели
- Batch inference vs real-time inference — когда что

ai-middle:
- Проектирование рекомендательной системы (candidate generation + ranking)
- Кэширование predictions (когда и как)
- Обработка высокой нагрузки (rate limiting, queues, autoscaling)

ai-senior:
- Проектирование fraud detection системы (latency, features, fallback)
- Мультимодельная архитектура (ensemble serving, model routing)
- Offline evaluation vs online evaluation — стратегия

ai-architect:
- Проектирование end-to-end ML системы для стартапа vs enterprise
- Миграция от монолита к микросервисной ML-архитектуре
- Budgeting и capacity planning для AI-инфраструктуры

### Домен: AI Ethics & Safety (`ai-ethics`)

ai-junior:
- Bias в данных — как обнаружить и что делать
- Privacy — anonymization vs pseudonymization
- Основы responsible AI — чеклист перед деплоем

ai-middle:
- Fairness метрики (demographic parity, equalized odds)
- Explainability — SHAP, LIME, attention visualization
- GDPR и right to explanation — что это значит для ML

ai-senior:
- Проектирование guardrails для LLM (content filtering, red teaming)
- AI safety в high-stakes domains (медицина, финансы, автономные системы)
- Управление рисками AI-проекта (risk assessment framework)

ai-architect:
- AI governance framework для организации
- Responsible AI by design — как встроить в процесс разработки
- Регуляторные требования к AI (EU AI Act, NIST AI RMF) — архитектурные импликации

### Формат вопросов

Каждый вопрос следует шаблону:
1. **Scenario**: рабочая ситуация с контекстом (кто просит, какой проект, какие ограничения)
2. **Question**: конкретный вопрос к игроку
3. **4 choices**: от плохого (score 0-25) до отличного (score 100)
4. **Feedback**: реакция NPC в характере (Петя — саркастично, Профессор — академично)
5. **Explanation**: краткое, но полезное объяснение правильного подхода

### NPC-специализация для feedback

- **Петя Сеньор** (ml-fundamentals, data-engineering, deep-learning): саркастичный, но справедливый
- **Ольга Продакт** (system-design — бизнес-аспекты): "А как это повлияет на метрики?"
- **Маша QA** (mlops — тестирование и мониторинг): "А если сломается в проде?"
- **Профессор Нейронов** (nlp-llms, ai-ethics, computer-vision): академичный, глубокий

## Зависимости
- 009-competency-matrix-types (структура и типы)
- 010-assessment-manager (должен работать с вопросами)

## Оценка
- Story Points: 13 (большой объём контента, рекомендуется декомпозировать по доменам)
- Приоритет: Medium

## Метки
- `feature`, `gameplay`

## Примечание
Можно реализовывать параллельно несколькими людьми — каждый домен независим. Рекомендуется привлечь domain experts для review вопросов.
