[English](#english) · [Русский](#русский)

# dementia documentation

## English

The bilingual documentation website for dementia: installation, configuration, node management and the external API reference.

[Open documentation](https://dementia-panel.github.io/) · [API reference](https://dementia-panel.github.io/api/)

### Local development

```sh
npm ci
```

```sh
npm run dev
```

### Build

```sh
npm run build
```

The output is `.vitepress/dist`. GitHub Actions builds and publishes the website to GitHub Pages on pushes to `main`. You can also run **Deploy documentation** manually.

The website is self-contained. Markdown snapshots are stored in `content/`. Run `npm run sync -- --refresh` to refresh snapshots from the neighboring backend and central README checkouts, then review the generated pages before committing.

## Русский

Двуязычный сайт документации dementia: установка, настройка, управление нодами и справочник внешнего API.

[Открыть документацию](https://dementia-panel.github.io/ru/) · [Справочник API](https://dementia-panel.github.io/ru/api/)

Для локального запуска выполните `npm ci` и `npm run dev`. Команда `npm run build` сохраняет сборку в `.vitepress/dist`.

GitHub Actions собирает и публикует сайт в GitHub Pages после отправки изменений в `main`. Также доступен ручной запуск **Deploy documentation**.

Сайт самодостаточный. Снимки Markdown находятся в `content/`. Команда `npm run sync -- --refresh` обновляет снимки из соседних репозиториев backend и основного README. Перед коммитом проверьте сгенерированные страницы.
