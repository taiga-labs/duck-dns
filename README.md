# duck-dns-system

# Описание обновлённых контрактов DNS за жетоны DUCK.

## Уточнения/Предложения 

**1 - В стандартных контрактах протокола TON DNS у NFT айтемов, которые представляют собой доменные имена - не предусмотрены метаданные.**

EQC3dNlesgVD8YbAazcauIrXBPfiVhMMr5YYk2in0Mtsz0Bz

по данному адресу располагается DNS минтер доменных имён any.ton. но у его айтемов словарь, который должен отвечать за метаданные - занят под категории, которые используются у доменных имён для добавлениях следующего DNS ресолвера или любых других адресов.

то есть метаданные коллекции any.ton отображаются на уровне getgems и tonviewer, поэтому, чтобы DNS айтемы any.duck тоже были с метаданными(то есть с картинкой, где будет написано доменное имя) - нужно ещё сильнее менять контракт, добавляя отдельный словарь под метаданные, или же решать на уровне платформы, которая эти метаданные отображает - как и сделали с any.ton

**2 - Так как аукционы проходят за жетоны DUCK - логика платежей меняется в корне**, так как переслать TON - это одна транзакция, а переслать JETTON, да так, чтобы тот, кому пересылают, получил сообщение об этом - это уже три транзакции.

все сообщения на контакт DNS item касательно аукциона приходят через интерфейс jetton transfer, как дополнительный payload. поэтому всё взаимодействием с контрактами должно происходить через UI платформы, на которой будут торговаться эти доменные имена.

потому что пользователь не может просто так через TonKeeper переслать жетоны DUCK на контракт, так как TonKeeper не сформирует дополнительный payload в jetton transfer и контакрт DNS item просто не узнает, что ему пришли жетоны

Более того, нужно добавит ключ безопасности, который будет добавляться в каждый жетон payload, уходящих на контакрт DNS item и говорящий о том, что действие было произведено со стороны вашей платформы. это защита от вызова контакрта по оп-коду, произведённого не через вашу платформу, а сыро через код, например 

## Описание скриптов

1 - в папке jetton_interface_scripts и лежат скрипты для проведения аукциона, такие как: 
- начать аукцион, то есть задеалоить доменное имя
- перебить ставку 
- возобновить аукцион, если владелец уже год не пополнял контракт 

2 - в папке scripts лежат базовые скрипты для взаимодействия с контрактами, которые не требуют сереалищации сообщений в payload jetton transfer’a. такие как геттеры, изменения словаря категорий и скрипты для деплоя DNS коллекции и DNS resolver

PS: 
1 - перед деплоем нужно поменять дату начала аукциона на нужную в файле contracts/imports/jetton_utils.fc в переменной auction_start_time
2 - и в контаркте nft_item поставить нужные вам интервалы: auction_start_duration, auction_end_duration, auction_prolongation


## Project structure

-   `contracts` - source code of all the smart contracts of the project and their dependencies.
-   `wrappers` - wrapper classes (implementing `Contract` from ton-core) for the contracts, including any [de]serialization primitives and compilation functions.
-   `tests` - tests for the contracts.
-   `scripts` - scripts used by the project, mainly the deployment scripts.

## How to use

### Build

`npx blueprint build` or `yarn blueprint build`

### Test

`npx blueprint test` or `yarn blueprint test`

### Deploy or run another script

`npx blueprint run` or `yarn blueprint run`

### Add a new contract

`npx blueprint create ContractName` or `yarn blueprint create ContractName`
