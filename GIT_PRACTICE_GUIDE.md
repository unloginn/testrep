# Практика по Git и GitHub

Цель: пройти полный цикл совместной разработки: Issue -> branch -> commit -> push -> Pull Request -> review -> merge -> conflict -> release.

## Мини-проект

Можно использовать этот простой HTML/CSS/JS сайт.

Главное, чтобы задачи были небольшими и понятными:

- изменить заголовок;
- добавить новую секцию;
- поправить стили;
- добавить кнопку;
- изменить README;
- специально создать конфликт в одном файле.

## Основные правила

- Не пушить напрямую в `main`.
- Каждая задача делается в отдельной ветке.
- Каждая задача начинается с GitHub Issue.
- Каждый merge проходит через Pull Request.
- Второй человек делает review.
- После merge ветка удаляется.
- Коммиты должны быть понятными.

Примеры названий веток:

```bash
feature/add-readme
feature/add-task-filter
fix/button-bug
docs/setup-guide
```

Примеры коммитов:

```bash
git commit -m "Add project README"
git commit -m "Add task filtering"
git commit -m "Fix empty task validation"
```

## Этап 1. Подготовка репозитория

1. Создайте приватный репозиторий на GitHub.
2. Добавьте обоих участников.
3. Включите защиту ветки `main`.
4. Запретите прямой push в `main`.
5. Включите требование Pull Request перед merge.
6. Включите минимум `1 approval`.

Пример настроек:

```text
Settings -> Branches -> Branch protection rules
Branch name pattern: main
Require a pull request before merging: on
Require approvals: 1
```

## Этап 2. Issues

Создайте 5-7 Issues:

```text
#1 Add README with project description
#2 Add basic app structure
#3 Add feature: create item
#4 Add feature: delete item
#5 Add input validation
#6 Add documentation for local setup
#7 Fix typo in README
```

Для каждого Issue добавьте:

- title;
- description;
- acceptance criteria;
- assignee;
- label.

Пример Issue:

```text
Title: Add input validation

Description:
Пользователь не должен иметь возможность добавить пустую задачу.

Acceptance criteria:
- Empty input is ignored
- User sees a short error message
- Existing behavior is not broken
```

## Этап 3. Первый workflow

Один человек берет Issue `#1`.

```bash
git checkout main
git pull origin main
git checkout -b docs/add-readme
```

После изменений:

```bash
git status
git add .
git commit -m "Add project README"
git push -u origin docs/add-readme
```

На GitHub откройте Pull Request.

Описание PR:

```text
Closes #1

What changed:
Added initial README with project description and setup instructions.

How to test:
Open README.md and check that instructions are clear.
```

Второй человек делает review:

```text
Approve
Comment
Request changes
Suggest change
```

После approval можно делать merge.

## Этап 4. Параллельные ветки

Оба человека одновременно берут разные Issues.

Первый:

```bash
git checkout main
git pull origin main
git checkout -b feature/add-create-item
```

Второй:

```bash
git checkout main
git pull origin main
git checkout -b feature/add-delete-item
```

Оба делают изменения, коммиты, push и Pull Request.

Цель: понять, что параллельная работа нормально работает, если изменения не конфликтуют.

## Этап 5. Обязательный конфликт

Специально сделайте конфликт.

Оба участника меняют одну и ту же строку в `README.md`.

Первый делает PR и мержит.

Второй после этого обновляет свою ветку:

```bash
git checkout feature/my-conflict-branch
git fetch origin
git merge origin/main
```

Git покажет конфликт.

В файле будет примерно так:

```text
<<<<<<< HEAD
ваша версия
=======
версия из main
>>>>>>> origin/main
```

Нужно исправить файл руками, затем выполнить:

```bash
git add .
git commit -m "Resolve README conflict"
git push
```

После этого PR обновится.

## Этап 6. Review как в реальной работе

Для каждого PR второй человек проверяет:

- решает ли PR нужный Issue;
- понятен ли код;
- нет ли лишних файлов;
- актуальна ли ветка;
- запускается ли проект;
- понятно ли описание PR.

Минимум один раз нужно сделать `Request changes`.

Автор PR исправляет замечания:

```bash
git add .
git commit -m "Address PR feedback"
git push
```

## Этап 7. Merge vs Rebase

На одной ветке попробуйте обновиться через merge:

```bash
git fetch origin
git merge origin/main
```

На другой ветке попробуйте rebase:

```bash
git fetch origin
git rebase origin/main
```

После rebase пушить нужно так:

```bash
git push --force-with-lease
```

Важно: используйте `--force-with-lease`, а не обычный `--force`.

Что нужно понять:

```text
merge сохраняет историю как есть
rebase делает историю линейнее
force-with-lease безопаснее обычного force
```

## Этап 8. Stash

Если начали задачу, но нужно срочно переключиться:

```bash
git status
git stash
git checkout main
git pull origin main
git checkout -b fix/urgent-typo
```

Потом вернуться:

```bash
git checkout old-branch
git stash pop
```

Что нужно понять:

```text
stash временно прячет незакоммиченные изменения
stash полезен, когда нужно быстро переключиться
```

## Этап 9. Revert вместо удаления истории

Сделайте PR с небольшой ошибкой и замержите его.

Потом отмените изменения правильно:

```bash
git checkout main
git pull origin main
git revert <commit_hash>
git push
```

Или через GitHub:

```text
PR -> Revert
```

Что нужно понять:

```text
revert создает новый коммит, который отменяет старый
reset/rebase на общей main-ветке обычно не используют
```

## Этап 10. Tags и Release

Когда несколько PR смержены, создайте первую версию.

```bash
git checkout main
git pull origin main
git tag v0.1.0
git push origin v0.1.0
```

На GitHub:

```text
Releases -> Draft a new release -> Choose tag v0.1.0
```

Описание release:

```text
Added:
- README
- Basic app structure
- Create item feature
- Delete item feature

Fixed:
- Empty input validation
```

## Команды, которые нужно потренировать

```bash
git clone
git status
git add
git commit
git push
git pull
git fetch
git branch
git checkout -b
git merge
git rebase
git stash
git log --oneline --graph
git diff
git revert
git tag
```

## Финальное задание

Сделайте маленький спринт:

```text
Milestone: v0.2.0
Issues: 5 задач
Каждый берет минимум 2 задачи
Каждая задача через отдельную ветку
Каждая задача через PR
Каждый PR должен получить review
Один PR должен содержать конфликт
Один PR должен получить Request changes
В конце создать Release v0.2.0
```

## Итоговая цель

После этой практики вы должны уверенно понимать:

```text
зачем нужны ветки
как не ломать main
как работать через Pull Request
как делать code review
как связывать PR с Issue
как решать конфликты
как отменять плохие изменения
как выпускать версии проекта
```
