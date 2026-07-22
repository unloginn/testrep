# Линейная практика Git и GitHub для двух участников

Это сценарий занятия, где два человека по очереди выполняют действия в одном репозитории.

Цель: не просто выучить команды, а увидеть реальные ситуации совместной разработки: ветки, Pull Request, review, конфликт, rebase, stale branch, non-fast-forward push и revert.

## Роли

```text
A = ты
B = друг
```

## Перед стартом

У обоих должен быть доступ к одному GitHub-репозиторию.

У обоих должен быть настроен Git:

```bash
git config --global user.name "Your Name"
git config --global user.email "your-email@example.com"
```

Проверьте:

```bash
git config --global user.name
git config --global user.email
```

Рекомендуемые настройки репозитория на GitHub:

```text
Settings -> Branches -> Add branch protection rule
Branch name pattern: main
Require a pull request before merging: on
Require approvals: 1
```

Если вам пока мешает обязательный approval, можно временно отключить защиту, но лучше оставить ее включенной.

## Правила занятия

- В `main` напрямую не пушить.
- Каждая задача делается в отдельной ветке.
- Каждая задача оформляется через Issue.
- Каждая задача попадает в `main` только через Pull Request.
- Второй участник делает review.
- После merge ветку удаляем на GitHub.
- Перед началом новой задачи всегда обновляем `main`.

## Шаг 0. Оба клонируют репозиторий

A и B выполняют:

```bash
git clone https://github.com/OWNER/REPO.git
cd REPO
git status
```

Если репозиторий уже есть локально:

```bash
git checkout main
git pull origin main
```

## Шаг 1. Создаем Issues

На GitHub создайте Issues:

```text
#1 Update hero title
#2 Add footer
#3 Add tasks section text
#4 Change button style
#5 Add project notes to README
#6 Create intentional conflict in README
#7 Revert bad change
```

Назначьте задачи:

```text
A берет #1
B берет #2
Остальные оставьте на следующие шаги
```

## Шаг 2. A делает первую ветку и Pull Request

A выполняет:

```bash
git checkout main
git pull origin main
git checkout -b feature/update-hero-title
```

A меняет заголовок в `index.html`.

Например меняет:

```html
<h1>Мини-сайт для практики Git</h1>
```

на:

```html
<h1>Командная практика Git и GitHub</h1>
```

A коммитит и пушит:

```bash
git status
git add index.html
git commit -m "Update hero title"
git push -u origin feature/update-hero-title
```

A открывает Pull Request на GitHub.

Описание PR:

```text
Closes #1

What changed:
Updated the main page title.

How to test:
Open index.html in browser and check the hero title.
```

B делает review и нажимает `Approve`.

A делает merge в `main`.

После merge A удаляет ветку на GitHub.

## Шаг 3. B работает со старым main

Важно: B специально не делает `git pull` после merge от A.

B создает ветку от старого локального `main`:

```bash
git checkout main
git checkout -b feature/add-footer
```

B добавляет footer в `index.html` перед закрывающим тегом `</main>`:

```html
<footer class="footer">
  Сделано для практики Git
</footer>
```

B коммитит и пушит:

```bash
git status
git add index.html
git commit -m "Add footer"
git push -u origin feature/add-footer
```

B открывает Pull Request.

GitHub может показать, что ветка отстает от `main`, но конфликта может не быть.

Задача B: обновить ветку через rebase.

B выполняет:

```bash
git fetch origin
git rebase origin/main
```

Если конфликтов нет, B пушит обновленную историю:

```bash
git push --force-with-lease
```

A делает review и approve.

B делает merge в `main`.

## Шаг 4. Специально создаем конфликт

Теперь оба меняют одну и ту же строку в `README.md`.

A начинает первым:

```bash
git checkout main
git pull origin main
git checkout -b docs/update-readme-a
```

A меняет первую строку в `README.md`.

Например:

```md
# Git Practice Site
```

на:

```md
# Git Practice Site by Team A
```

A коммитит и пушит:

```bash
git add README.md
git commit -m "Update README title"
git push -u origin docs/update-readme-a
```

A открывает PR.

B делает review и approve.

A делает merge в `main`.

B теперь специально работает со старым локальным состоянием.

B выполняет:

```bash
git checkout main
git checkout -b docs/update-readme-b
```

B меняет ту же первую строку `README.md`, но по-другому:

```md
# Git Practice Site by Team B
```

B коммитит:

```bash
git add README.md
git commit -m "Change README title again"
```

Теперь B пытается обновиться через rebase:

```bash
git fetch origin
git rebase origin/main
```

Git должен показать конфликт.

В `README.md` будет что-то похожее:

```text
<<<<<<< HEAD
# Git Practice Site by Team A
=======
# Git Practice Site by Team B
>>>>>>> Change README title again
```

B руками исправляет на финальный вариант:

```md
# Git Practice Site by Team A and Team B
```

B продолжает rebase:

```bash
git add README.md
git rebase --continue
```

Если Git откроет редактор для сообщения коммита, сохраните и закройте его.

B пушит ветку:

```bash
git push -u origin docs/update-readme-b
```

Если ветка уже была запушена раньше и Git откажет, используйте:

```bash
git push --force-with-lease
```

B открывает PR.

A делает review и approve.

B делает merge в `main`.

## Шаг 5. Ситуация non-fast-forward на общей ветке

Это отдельное упражнение. Оно показывает ошибку, когда два человека работают в одной и той же ветке.

В реальной работе так лучше не делать, но это полезно для понимания.

A создает общую ветку:

```bash
git checkout main
git pull origin main
git checkout -b feature/shared-button-style
```

A меняет `styles.css`, например цвет кнопки:

```css
--accent: #2563eb;
```

A коммитит и пушит:

```bash
git add styles.css
git commit -m "Change button accent color"
git push -u origin feature/shared-button-style
```

B забирает эту ветку:

```bash
git fetch origin
git checkout -b feature/shared-button-style origin/feature/shared-button-style
```

A делает еще один коммит в этой же ветке и пушит:

```bash
git checkout feature/shared-button-style
```

A меняет `styles.css`, например hover-цвет:

```css
--accent-dark: #1d4ed8;
```

A выполняет:

```bash
git add styles.css
git commit -m "Update button hover color"
git push
```

B не делает `git pull`.

B тоже меняет `styles.css`, например radius у кнопок:

```css
border-radius: 16px;
```

B коммитит:

```bash
git add styles.css
git commit -m "Adjust button radius"
```

B пробует обычный push:

```bash
git push
```

Ожидаемая ошибка:

```text
! [rejected] feature/shared-button-style -> feature/shared-button-style (fetch first)
error: failed to push some refs
hint: Updates were rejected because the remote contains work that you do not have locally.
```

B чинит через rebase:

```bash
git pull --rebase origin feature/shared-button-style
```

Если конфликтов нет:

```bash
git push
```

Если есть конфликт, B исправляет файл, затем:

```bash
git add styles.css
git rebase --continue
git push
```

После этого A или B открывает PR из `feature/shared-button-style` в `main`.

Второй участник делает review.

После approval делаем merge.

## Шаг 6. Request changes

B берет Issue `#3`.

B создает ветку:

```bash
git checkout main
git pull origin main
git checkout -b feature/update-task-section
```

B меняет текст секции задач в `index.html`.

B специально добавляет неидеальный текст или лишнюю строку.

B коммитит и пушит:

```bash
git add index.html
git commit -m "Update task section text"
git push -u origin feature/update-task-section
```

B открывает PR.

A делает review и выбирает `Request changes`.

A оставляет комментарий:

```text
Текст слишком общий. Давай сделаем его конкретнее для Git-практики.
```

B исправляет код в той же ветке:

```bash
git add index.html
git commit -m "Address review feedback"
git push
```

A снова проверяет и нажимает `Approve`.

B делает merge.

## Шаг 7. Stash при срочном переключении

A начинает новую задачу:

```bash
git checkout main
git pull origin main
git checkout -b feature/temporary-work
```

A делает изменения в `script.js`, но не коммитит.

Теперь срочно нужно поправить README.

A выполняет:

```bash
git status
git stash
git checkout main
git pull origin main
git checkout -b docs/urgent-readme-fix
```

A исправляет README:

```bash
git add README.md
git commit -m "Fix README typo"
git push -u origin docs/urgent-readme-fix
```

Открывает PR, B делает review, A мержит.

A возвращается к старой работе:

```bash
git checkout feature/temporary-work
git stash pop
```

Что нужно понять:

```text
stash прячет незакоммиченные изменения
stash полезен, когда нужно быстро переключиться на другую задачу
```

## Шаг 8. Revert плохого изменения

A или B делает маленький PR с ошибкой.

Например меняет заголовок на плохой текст:

```html
<h1>TEST TEST TEST</h1>
```

PR проходит review и случайно попадает в `main`.

Теперь нужно отменить изменение правильно.

Вариант через GitHub:

```text
Merged PR -> Revert -> Create pull request -> Merge
```

Вариант через терминал:

```bash
git checkout main
git pull origin main
git log --oneline
git revert <commit_hash>
git push
```

Что нужно понять:

```text
revert не удаляет историю
revert создает новый коммит, который отменяет старый
reset --hard на общей main-ветке обычно не используют
```

## Шаг 9. Tag и Release

Когда все упражнения пройдены, создайте тег версии.

A выполняет:

```bash
git checkout main
git pull origin main
git tag v0.1.0
git push origin v0.1.0
```

На GitHub создайте Release:

```text
Releases -> Draft a new release -> Choose tag v0.1.0
```

Описание релиза:

```text
Added:
- Hero title update
- Footer
- README updates
- Button style changes

Practiced:
- branches
- pull requests
- review
- rebase
- conflicts
- revert
```

## Что должно сломаться во время практики

Это нормально и специально задумано.

```text
1. PR будет отставать от main
2. Rebase создаст конфликт
3. Push в общую ветку будет rejected / non-fast-forward
4. Review потребует изменений
5. Плохой merge придется откатывать через revert
```

## Главные команды занятия

```bash
git status
git checkout main
git pull origin main
git checkout -b branch-name
git add .
git commit -m "Message"
git push -u origin branch-name
git fetch origin
git rebase origin/main
git pull --rebase origin branch-name
git rebase --continue
git push --force-with-lease
git stash
git stash pop
git log --oneline --graph
git revert <commit_hash>
git tag v0.1.0
```

## Финальная проверка понимания

После прохождения каждый участник должен уметь объяснить:

```text
почему нельзя постоянно пушить в main
чем branch отличается от Pull Request
зачем нужен review
почему ветка может отстать от main
когда нужен rebase
почему после rebase иногда нужен --force-with-lease
как выглядит конфликт
как исправить конфликт
чем revert безопаснее reset на общей ветке
зачем нужны tags и releases
```
