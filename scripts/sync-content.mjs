import { readFile, writeFile, mkdir, copyFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = fileURLToPath(new URL('../', import.meta.url))
if (process.argv.includes('--refresh')) {
  await copyFile(path.join(root, '../backend/docs/API.md'), path.join(root, 'content/api.md'))
  await copyFile(path.join(root, '../.github/profile/README.md'), path.join(root, 'content/installation.md'))
  await copyFile(path.join(root, '../backend/deploy/.env.example'), path.join(root, 'public/assets/env.example'))
}
const api = await readFile(path.join(root, 'content/api.md'), 'utf8')
const installation = await readFile(path.join(root, 'content/installation.md'), 'utf8')
const groups = ['users', 'devices', 'nodes', 'plans', 'access', 'traffic', 'settings']
const boundaries = [0, 6, 14, 23, 29, 40, 41, 43]
const groupNames = {
  en: ['Users', 'Devices', 'Nodes', 'Subscription plans', 'Issued access', 'Traffic', 'Device settings'],
  ru: ['Пользователи', 'Устройства', 'Ноды', 'Планы подписок', 'Выданный доступ', 'Трафик', 'Настройки устройств'],
}
async function save(name, text) {
  await mkdir(path.dirname(path.join(root, name)), { recursive: true })
  await writeFile(path.join(root, name), text.trimEnd() + '\n')
}
for (const language of ['en', 'ru']) {
  const ru = language === 'ru'
  const prefix = ru ? 'ru/' : ''
  const section = ru ? api.split('<a id="russian"></a>')[1] : api.split('<a id="russian"></a>')[0]
  const matches = [...section.matchAll(/<a id="(?:en|ru)-endpoint-(\d+)"><\/a>\s*\n#### ([^\n]+)\n\n##### `([^`]+)`/g)]
  if (matches.length !== 43) throw new Error(`Expected 43 API endpoints for ${language}; got ${matches.length}`)
  const entries = matches.map((match, index) => {
    const raw = section.slice(match.index, matches[index + 1]?.index ?? section.length)
    const [method, ...parts] = match[3].split(' ')
    const body = raw.slice(raw.indexOf('\n\n', raw.indexOf('##### `')) + 2)
    return { title: match[2], method, route: parts.join(' '), body }
  })
  for (let i = 0; i < groups.length; i++) {
    const selected = entries.slice(boundaries[i], boundaries[i + 1])
    const intro = ru ? 'Параметры, примеры запросов и ответов для интеграции по API-ключу.' : 'Parameters, request examples and response shapes for service API integrations.'
    const text = `---\ntitle: ${groupNames[language][i]}\ndescription: ${intro}\noutline: [2, 2]\n---\n\n# ${groupNames[language][i]}\n\n${intro}\n\n` + selected.map(entry => `## ${entry.title}\n\n<Endpoint method="${entry.method}" path="${entry.route}" />\n\n${entry.body}`).join('\n')
    await save(`${prefix}api/${groups[i]}.md`, text)
  }
  let guide = installation.split(ru ? '## Русский' : '## English')[1]
  if (!ru) guide = guide.split('## Русский')[0]
  const steps = [...guide.matchAll(/^### (\d+)\. (.+)$/gm)]
  const chunks = Object.fromEntries(steps.map((match, i) => [Number(match[1]), guide.slice(match.index, steps[i + 1]?.index ?? guide.length).replace(/^### /, '## ')]))
  chunks[1] = await readFile(path.join(root, `content/docker-${language}.md`), 'utf8')
  const environmentTitle = ru ? 'Переменные окружения' : 'Environment variables'
  const envIntro = ru ? 'Конфигурация хранится в файле `.env` на сервере. При изменении параметров пересоздайте контейнеры командой `docker compose up -d`.' : 'Server configuration lives in `.env`. After changing it, recreate the containers with `docker compose up -d`.'
  await save(`${prefix}guide/environment.md`, `---\ntitle: ${environmentTitle}\n---\n\n# ${environmentTitle}\n\n${envIntro}\n\n` + chunks[3].replace(/^## .+\n/, '') + `\n\n## ${ru ? 'Шаблон конфигурации' : 'Configuration template'}\n\n<a href="/assets/env.example" download=".env">${ru ? 'Скачать .env.example' : 'Download .env.example'}</a>\n`)
  const installTitle = ru ? 'Установка' : 'Installation'
  const envLink = ru ? '## 3. Настройте окружение\n\nЗаполните `.env` и сгенерируйте ключи по [инструкции настройки](/ru/guide/environment).\n\n' : '## 3. Configure the environment\n\nFill in `.env` and generate the keys using the [configuration guide](/guide/environment).\n\n'
  await save(`${prefix}guide/installation.md`, `---\ntitle: ${installTitle}\n---\n\n# ${installTitle}\n\n` + (ru ? 'Разверните backend, базу данных и веб-панель на своём сервере.\n\n::: info Перед началом\nНужны сервер Ubuntu или Debian, домен, направленный на сервер, и открытые TCP-порты 80 и 443.\n:::\n\n' : 'Deploy the backend, database and web panel on your own server.\n\n::: info Before you begin\nYou need an Ubuntu or Debian server, a domain pointing to it, and inbound TCP ports 80 and 443.\n:::\n\n') + [chunks[1], chunks[2], envLink, chunks[4], chunks[5], chunks[6], chunks[7]].join('\n\n'))
  await save(`${prefix}guide/certificates.md`, `---\ntitle: ${ru ? 'HTTPS и сертификаты' : 'HTTPS & certificates'}\n---\n\n# ${ru ? 'HTTPS и сертификаты' : 'HTTPS & certificates'}\n\n` + [chunks[5], chunks[9]].join('\n\n').replace(ru ? 'из шага 5' : 'from step 5', ru ? 'из раздела выше' : 'from the section above'))
  await save(`${prefix}guide/troubleshooting.md`, `---\ntitle: ${ru ? 'Решение проблем' : 'Troubleshooting'}\n---\n\n# ${ru ? 'Решение проблем' : 'Troubleshooting'}\n\n` + chunks[10] + '\n\n' + (ru ? '## Состояние контейнеров\n\n```sh\nsudo docker compose ps\n```\n\n## Логи backend\n\n```sh\nsudo docker compose logs --tail=100 backend\n```\n\n## Ошибка установки ноды\n\nПосмотрите этап установки и сообщение ошибки в карточке ноды. На VPS журнал установки находится в `/var/log/dementia-install.log`.\n\n```sh\nsudo tail -n 100 /var/log/dementia-install.log\n```\n' : '## Container status\n\n```sh\nsudo docker compose ps\n```\n\n## Backend logs\n\n```sh\nsudo docker compose logs --tail=100 backend\n```\n\n## Node installation errors\n\nCheck the installation stage and error in the node card. On the VPS, the installation log is `/var/log/dementia-install.log`.\n\n```sh\nsudo tail -n 100 /var/log/dementia-install.log\n```\n'))
}
console.log('Generated bilingual installation guides and 43 API endpoints across 14 reference pages.')
