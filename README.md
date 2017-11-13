# enb-headless-chrome-testing

`enb-headless-chrome-testing` - плагин (*технология*) для сборщика [ENB](https://ru.bem.info/toolbox/enb/), который выполняет тесты в Headless Chrome.

## Установка

```
npm i enb-headless-chrome-testing
```

## Использование

Технология принимает на вход html-файл с тестами и передает его программе [mocha-headless-chrome](https://www.npmjs.com/package/mocha-headless-chrome). Результат в формате JSON записываеся в файл.
Если код предварительно был инструментировн, в результирующий файл будет также записана информация о покрытии кода тестами.

### Опции

- `String` **[target]** — Результирующий таргет. По умолчанию `?.test-result.json`.
- `String` **[html]** — Таргет страницы с тестами, которая будет передана в Headless Chrome. По умолчанию `?.html`. Указанный таргет будет собран автоматически перед запуском тестов.
- `Boolean` **[headless]** — Признак, нужно ли показывать окно Chrome. По умолчанию `true`. Если передать `false`, то окно будет показано. Полезен при отладке тестов.

### Пример

```js
const chromeTesting = require('enb-headless-chrome-testing');

nodeConfig.addTech([
    chromeTesting, 
    {
        target: '?.test-result.json',
        html: '?.html',
        headless: true
    }
]);

nodeConfig.addTargets(['?.test-result.json']);
```
