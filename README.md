#  Flux Framework

```shell
npm i
npm start
```
Структура проекта (только файлы непосредственно по заданию)

```bash
    js/
      flux/
        dispatcher.js
        eventEmitter.js
        store.js
        view.js
      reducer.js
      fluxReducer.js
      fluxView.js
      fluxCommon.js
```

**Dispatcher** - диспетчер отправляет действие по хранилищам

**EventEmitter** - генерирует и слушает события

**Store** - измененяет состояние и вызывает событие изменения
  defaultStore,
  reducer,
  dispatcher,
  emitter

**View** - создает структуру вьюх
____________

В **reducer.js** обабатывается только действиес типом navigationEvent

В **fluxView.js** логика переключения табов и подготовка вьюх

В **fluxCommon.js** объединение всего
