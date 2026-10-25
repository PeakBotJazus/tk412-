Бот для замен ТК 412 (Cloudflare Worker + Telegram)

1. Telegram: найдите @BotFather -> /newbot -> придумайте имя -> скопируйте токен.
2. Cloudflare: Workers & Pages -> Create -> Worker -> имя tk412 -> Deploy -> Edit code ->
   вставьте весь текст worker.js вместо старого -> Deploy.
3. Хранилище: Storage & Databases -> KV -> Create namespace «tk412».
   Затем в воркере: Settings -> Bindings -> Add -> KV namespace -> Variable name: SUBS -> выберите tk412.
4. Переменные (Settings -> Variables and Secrets):
   BOT_TOKEN = токен из шага 1 (тип Secret)
   SECRET    = любая длинная строка из букв и цифр, например k29fj3hd83jd
   ALLOWED   = необязательно: Telegram id тех, кому можно присылать замены, через запятую
               (если оставить пустым — принимает от всех; бот сам сообщит id, когда ALLOWED задан)
5. Подключите бота к воркеру: откройте в браузере (подставьте свои значения)
   https://api.telegram.org/bot<ТОКЕН>/setWebhook?url=https://<адрес-воркера>.workers.dev/tg/<SECRET>
   Должно появиться {"ok":true,...}
6. В index.html найдите строку var API="" и впишите адрес воркера:
   var API="https://<адрес-воркера>.workers.dev"
   Загрузите index.html в GitHub вместо старого.

Как пользоваться: в Viber выделите сообщение с заменами -> Поделиться -> Telegram -> ваш бот.
Бот ответит, что понял для ТК412. Приложение подтянет замены при открытии.
