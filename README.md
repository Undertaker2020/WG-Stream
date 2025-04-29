# WG-Stream

Клон Twitch-подібної платформи для прямих трансляцій, спілкування та управління каналами.

## Вступ

Платформа WG-Stream призначена для організації та проведення live-трансляцій, взаємодії стрімерів із глядачами через чат, а також комплексного управління каналами, підписками та спонсорськими планами. Система підтримує масштабованість завдяки пагінації та кешуванню, забезпечує безпеку через двофакторну автентифікацію й захищені API, а також пропонує гнучкі налаштування зовнішнього вигляду та сповіщень.

## Мета проекту

- **Гнучке створення каналів**: користувачі можуть реєструвати канали, завантажувати аватар і фон, налаштовувати опис та соціальні посилання.  
- **Якісні трансляції**: інтеграція з OBS через згенеровані RTMP/ARATMP ключі, підтримка потокового відео високої якості з мінімальною затримкою.  
- **Інтерактивний чат**: WebSocket-чат на базі GraphQL Subscriptions із кольоровим відображенням нікнеймів, емодзі та модерацією.  
- **Монетизація**: створення спонсорських і преміум-планів із інтеграцією Stripe, історією транзакцій та автоматичними нагородами (верифікація каналу).  
- **Сповіщення в реальному часі**: e-mail та Telegram-бот для повідомлень про нові трансляції, підписки, коди підтвердження й критичні події.  
- **Безпека та управління**: двофакторна автентифікація (TOTP), управління активними сесіями, можливість відключення сесій віддалено.  
- **Масштабованість**: пагінація (infinite scroll), кешування через Redis, зберігання медіа в S3, готовність до розгортання в Docker та AWS.  

## Стек технологій

### 🚀 Backend

- [![NestJS](https://img.shields.io/badge/NestJS-e0234e?style=flat&logo=nestjs&logoColor=white)](https://nestjs.com/) **NestJS** — модульний фреймворк на Node.js із TypeScript, що забезпечує чітку архітектуру (модулі, контролери, сервіси).  
- [![GraphQL](https://img.shields.io/badge/GraphQL-e10098?style=flat&logo=graphql&logoColor=white)](https://graphql.org/) **GraphQL** — гнучкий API-шар через `@nestjs/graphql`, що дозволяє клієнту вибирати лише потрібні поля та підтримує real-time через Subscriptions.  
- [![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat&logo=prisma&logoColor=blue)](https://www.prisma.io/) **Prisma ORM** — ORM з генерацією типів TypeScript, що працює з міграціями та забезпечує безпечні транзакції до PostgreSQL.  
- [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat&logo=postgresql&logoColor=white)](https://www.postgresql.org/) **PostgreSQL** — реляційна база даних для зберігання користувачів, каналів, стрімів, транзакцій та іншої сутнісної інформації.  
- [![Redis](https://img.shields.io/badge/Redis-DC382D?style=flat&logo=redis&logoColor=white)](https://redis.io/) **Redis** — кешування сесій, чергування сповіщень та зберігання швидкодоступних даних.  
- [![AWS S3](https://img.shields.io/badge/AWS%20S3-569A31?style=flat&logo=amazon-aws&logoColor=white)](https://aws.amazon.com/s3/) **AWS S3** — зберігання медіа (аватарок, прев’ю стрімів) з генерацією оптимізованих зображень через Sharp.  
- [![LiveKit](https://img.shields.io/badge/LiveKit-FFFFFF?style=flat&logo=livekit)](https://livekit.io/) **LiveKit** — платформа для побудови аудіо/відео трансляцій у реальному часі.  
- [![Sharp](https://img.shields.io/badge/Sharp-000000?style=flat&logo=sharp&logoColor=white)](https://sharp.pixelplumbing.com/) **Sharp** — інструмент для обробки та генерації прев’ю зображень перед збереженням в S3.  
- [![Telegram](https://img.shields.io/badge/Telegram-0088CC?style=flat&logo=telegram&logoColor=white)](https://core.telegram.org/bots) **Telegraf** — бібліотека для реалізації Telegram-бота, який надсилає сповіщення про стріми, підписки та коди підтвердження.  
- [![Stripe](https://img.shields.io/badge/Stripe-635BFF?style=flat&logo=stripe&logoColor=white)](https://stripe.com/) **Stripe** — інтеграція платіжної системи для створення та обробки спонсорських/преміум-планів.  

### 🎨 Frontend

- [![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=next.js&logoColor=white)](https://nextjs.org/) **Next.js 15** — React-фреймворк із серверним рендерингом, маршрутизацією та інкрементальною генерацією сторінок.  
- [![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-06B6D4?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/) **TailwindCSS** — утилітарний CSS-фреймворк для швидкого створення адаптивних інтерфейсів.  
- [![GraphQL Code Generator](https://img.shields.io/badge/GraphQL_Code_Generator-E10098?style=flat&logo=graphql&logoColor=white)](https://www.graphql-code-generator.com/) **GraphQL Code Generator** — автоматична генерація типів та React-хуків для запитів і мутацій.  
- [![Apollo Client](https://img.shields.io/badge/Apollo_Client-311C87?style=flat&logo=apollo-graphql&logoColor=white)](https://www.apollographql.com/docs/react/) **Apollo Client** — клієнт для виконання GraphQL-запитів, кешування та управління станом даних.  
- [![Zustand](https://img.shields.io/badge/Zustand-000000?style=flat&logo=zustand)](https://github.com/pmndrs/zustand) **Zustand** — легковажний state management для зберігання глобальних налаштувань (тема, локаль, токен).  
- [![React Hook Form](https://img.shields.io/badge/React_Hook_Form-EC5990?style=flat&logo=react-hook-form&logoColor=white)](https://react-hook-form.com/) **React Hook Form** — високопродуктивна бібліотека для побудови та валідації форм.  
- [![next-intl](https://img.shields.io/badge/next--intl-000000?style=flat)](https://github.com/amannn/next-intl) **next-intl** — локалізація інтерфейсу з підтримкою кількох мов.  
- [![next-themes](https://img.shields.io/badge/next--themes-000000?style=flat)](https://github.com/pacocoursey/next-themes) **next-themes** — підтримка світлої та темної тем з автоматичним запам’ятовуванням вибору користувача.  
- [![sonner](https://img.shields.io/badge/sonner-000000?style=flat)](https://github.com/lucacasonato/sonner) **sonner** — кастомний Toast-провайдер для сповіщень користувача про події (успіх, помилки).  

