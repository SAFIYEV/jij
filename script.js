// Инициализируем коннектор
const connector = new TonConnectSDK.TonConnect({
    manifestUrl: 'https://github.com/SAFIYEV/jij/blob/main/manifest.json', // Замени на URL своего манифеста!
    // Если у тебя есть свой тестовый манифест, укажи его URL здесь.
    // Для конкурса тебе понадобится манифест, размещенный онлайн.
});

const connectButton = document.getElementById('connect-button');
const connectionStatus = document.getElementById('connection-status');
const walletAddress = document.getElementById('wallet-address');
const balanceSection = document.getElementById('balance-section');
const poolsSection = document.getElementById('pools-section');
const estimateSection = document.getElementById('estimate-section');


// Функция обновления интерфейса в зависимости от статуса подключения
function updateUI() {
    if (connector.connected) {
        // Кошелек подключен
        connectionStatus.innerText = 'Статус: Подключен';
        walletAddress.innerText = `Адрес: ${connector.wallet.account.address}`;
        connectButton.innerText = 'Отключить кошелек';
        connectButton.classList.add('connected'); // Добавим класс для стилей при подключении

        // Показываем секции баланса, пулов и оценки
        balanceSection.classList.remove('hidden');
        poolsSection.classList.remove('hidden');
        estimateSection.classList.remove('hidden');

        // Здесь потом будем вызывать функции для загрузки баланса, пулов и расчета
        loadBalances(connector.wallet.account.address); // Пока просто заглушка
        loadPoolsData(); // Пока просто заглушка
        // estimateIncome(); // Пока просто заглушка


    } else {
        // Кошелек отключен
        connectionStatus.innerText = 'Статус: Отключен';
        walletAddress.innerText = '';
        connectButton.innerText = 'Подключить кошелек';
        connectButton.classList.remove('connected'); // Убираем класс при отключении

        // Скрываем секции баланса, пулов и оценки
        balanceSection.classList.add('hidden');
        poolsSection.classList.add('hidden');
        estimateSection.classList.add('hidden');

         // Очищаем данные (опционально)
        document.getElementById('balances').innerHTML = '';
        document.getElementById('pools-list').innerHTML = '<p>Загрузка данных о пулах...</p>'; // Возвращаем начальный текст
        document.getElementById('income-estimate').innerHTML = '';
    }
}

// Обработчик нажатия кнопки
connectButton.addEventListener('click', () => {
    if (connector.connected) {
        // Если подключен, отключаем
        connector.disconnect();
    } else {
        // Если отключен, подключаем
        connector.connect();
    }
});

// Подписываемся на изменение статуса подключения
connector.onStatusChange(
    wallet => {
        if (wallet) {
            console.log('Кошелек подключен:', wallet);
        } else {
            console.log('Кошелек отключен.');
        }
        updateUI(); // Обновляем интерфейс при любом изменении статуса
    },
    // Обработка ошибок (опционально)
    e => {
        console.error('Ошибка подключения:', e);
        connectionStatus.innerText = `Ошибка: ${e.message}`;
        // Можешь добавить более детальную обработку ошибок здесь
    }
);

// Начальное обновление интерфейса при загрузке страницы
updateUI();


// --- Функции-заглушки (будем реализовывать их позже) ---

function loadBalances(address) {
    console.log(`Загрузка балансов для адреса: ${address}`);
    // Здесь будет код для получения балансов пользователя с блокчейна TON
    // и отображения их в #balances
    document.getElementById('balances').innerHTML = '<p>Загрузка балансов...</p>'; // Placeholder
     // Пример, как получить баланс TON (потребуется библиотека типа tonweb или напрямую через API)
     // Пока это просто комментарий-напоминание
    /*
    fetch(`https://toncenter.com/api/v2/getwalletbalance?address=${address}`)
        .then(response => response.json())
        .then(data => {
            if (data.ok) {
                const balanceNano = data.result.balance; // Баланс в наноТОНах
                const balanceTon = balanceNano / 1e9; // Конвертируем в ТОН
                document.getElementById('balances').innerHTML = `<p>Баланс TON: ${balanceTon.toFixed(2)}</p>`;
                // Тут нужно будет получить балансы других токенов (Jettons)
            } else {
                document.getElementById('balances').innerHTML = '<p>Не удалось загрузить баланс TON.</p>';
            }
        })
        .catch(error => {
            console.error('Ошибка при получении баланса:', error);
             document.getElementById('balances').innerHTML = '<p>Ошибка при загрузке баланса.</p>';
        });
    */
}

function loadPoolsData() {
    console.log('Загрузка данных о пулах...');
    // Здесь будет код для получения данных о доходности (APY)
    // с выбранных DeFi протоколов (с бэкенда или API)
    // и отображения их в #pools-list
     document.getElementById('pools-list').innerHTML = '<p>Получение данных о пулах...</p>'; // Placeholder

     // Пример данных для отображения (пока статичные)
     setTimeout(() => {
         const dummyPools = [
             { name: 'TON / USDT (Swap.coffee)', apy: '35%', relevantAsset: 'USDT' },
             { name: 'TON / wBTC (STON.fi)', apy: '28%', relevantAsset: 'wBTC' },
             // Добавь еще несколько примеров
         ];

         let poolsHtml = '<ul>';
         dummyPools.forEach(pool => {
             poolsHtml += `<li>
                             <strong>${pool.name}:</strong> ${pool.apy} APY
                             <br><small>(Подходит для актива: ${pool.relevantAsset})</small>
                           </li>`;
         });
         poolsHtml += '</ul>';
         document.getElementById('pools-list').innerHTML = poolsHtml;

          // После загрузки пулов можно попробовать оценить доход
         // estimateIncome(dummyPools); // Вызываем оценку с загруженными данными
     }, 2000); // Имитируем задержку загрузки
}

function estimateIncome(poolsData = []) {
     // Эта функция будет вызываться после загрузки балансов И данных о пулах
     console.log('Оценка примерного дохода...');

     const balances = getLoadedBalances(); // Нужна функция, которая вернет загруженные балансы
     const pools = poolsData; // Используем загруженные данные о пулах

     if (!balances || Object.keys(balances).length === 0 || pools.length === 0) {
         document.getElementById('income-estimate').innerHTML = '<p>Недостаточно данных для оценки (нет балансов или данных о пулах).</p>';
         return;
     }

     let estimateHtml = '<p>Оценка дохода по вашим активам:</p><ul>';
     let totalEstimateTon = 0; // Для суммарной оценки в TON

     // Пример: Проходим по пулам и смотрим, есть ли у пользователя подходящий актив
     pools.forEach(pool => {
         const relevantAsset = pool.relevantAsset; // Актив, который нужен для этого пула (например, 'USDT')
         const userBalance = balances[relevantAsset] || 0; // Баланс пользователя для этого актива

         if (userBalance > 0) {
             const apyPercentage = parseFloat(pool.apy.replace('%', '')); // Получаем число APY
             if (!isNaN(apyPercentage)) {
                 // Примерный расчет дохода за 15 дней
                 // Предполагаем, что 15 дней - это примерно 15/365 часть года
                 const estimatedIncomeAmount = userBalance * (apyPercentage / 100) * (15 / 365);

                 estimateHtml += `<li>~${estimatedIncomeAmount.toFixed(4)} ${relevantAsset} за 15 дней (${pool.name})</li>`;

                 // Если актив TON, добавляем к общей оценке
                 if (relevantAsset === 'TON') {
                     totalEstimateTon += estimatedIncomeAmount;
                 } else {
                      // Тут сложнее, нужно конвертировать доход в других активах в TON по текущему курсу
                      // Для простоты MVP можно ограничиться расчетом дохода только в TON или в том активе, который есть
                      // Или использовать фиксированный курс для примера
                 }

             }
         }
     });

      if (estimateHtml === '<p>Оценка дохода по вашим активам:</p><ul>') {
          estimateHtml += '<li>У вас нет подходящих активов для показанных пулов.</li>';
      }


     estimateHtml += '</ul>';

     // Добавим общую оценку в TON, если есть
     if (totalEstimateTon > 0) {
          estimateHtml += `<p><strong>Общая примерная оценка дохода в TON: ~${totalEstimateTon.toFixed(4)} TON за 15 дней.</strong></p>`;
     }


     document.getElementById('income-estimate').innerHTML = estimateHtml;
}

// --- Вспомогательная функция для получения загруженных балансов (нужно будет доработать!) ---
// Эта функция пока просто заглушка. Реально нужно будет сохранять балансы, полученные в loadBalances
function getLoadedBalances() {
    // Пока возвращаем статичные примеры балансов для тестирования расчета
    // В реальном коде нужно будет возвращать данные, полученные из loadBalances
    return {
        'TON': 10.5, // Пример: 10.5 TON
        'USDT': 500, // Пример: 500 USDT (для пулов с USDT)
        // Добавь другие активы, которые могут быть у пользователя
    };
}


// NOTE: Тебе понадобится разместить файл manifest.json онлайн
// и обновить manifestUrl в TonConnectSDK.TonConnect выше на свой URL.
// Простейший способ для теста - использовать GitHub Pages или Vercel/Netlify для хостинга.