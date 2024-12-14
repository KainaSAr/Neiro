const chatDiv = document.getElementById('chat');
const userInput = document.getElementById('userInput');
const sendButton = document.getElementById('sendButton');
const typingIndicator = document.getElementById('typingIndicator');

sendButton.addEventListener('click', async () => {
    const userMessage = userInput.value;
    if (!userMessage) return; // Не отправлять пустые сообщения

    chatDiv.innerHTML += `<p><strong>Вы:</strong> ${userMessage}</p>`;
    userInput.value = '';

    const requestBody = {
        model: 'TheBloke/Llama-2-7B-Chat-GGUF', // Замените на ваш идентификатор модели
        messages: [
            { role: 'system', content: 'Always answer in rhymes.' },
            { role: 'user', content: userMessage }
        ],
        temperature: 0.7
    };

    console.log('Отправляемый запрос:', JSON.stringify(requestBody)); // Отладочная информация

    // Показать индикатор "печатает..."
    typingIndicator.style.display = 'block';

    try {
        const response = await fetch('http://26.199.6.146:1234/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer lm-studio'
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error('Сетевая ошибка: ' + response.statusText + ' - ' + errorText);
        }

        const data = await response.json();
        if (!data.choices || data.choices.length === 0) {
            throw new Error('Нет доступных ответов от нейросети.');
        }
        const botMessage = data.choices[0].message.content;
        chatDiv.innerHTML += `<p><strong>Нейросеть:</strong> ${botMessage}</p>`;
        chatDiv.scrollTop = chatDiv.scrollHeight; // Прокрутка вниз
    } catch (error) {
        console.error('Ошибка:', error);
        chatDiv.innerHTML += `<p><strong>Нейросеть:</strong> Произошла ошибка. Попробуйте позже.</p>`;
    } finally {
        // Скрыть индикатор "печатает..."
        typingIndicator.style.display = 'none';
    }
});

// Добавление возможности отправки сообщения по нажатию Enter
userInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        sendButton.click();
    }
});
