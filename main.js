const headerBtn = document.querySelector('.header__btn')
const modalWindow = document.querySelector('.modal')
const modalClose = document.querySelector('.modal__close')
const modalTitle = document.getElementById('noteTitle')
const modalSubmit = document.getElementById('modal__submit')
const modalText = document.getElementById('noteName')
const modalDate = document.getElementById('noteDate')
const cardsContainer = document.querySelector('.cards')

headerBtn.addEventListener('click', openModal)
modalClose.addEventListener('click', closeModal)
//открывает модальное окно
function openModal() {
    modalWindow.classList.remove('hide')
    document.body.classList.add('modal-opened')
    modalSubmit.addEventListener('click', handleSubmit)
}
//закрывает модальное окно
function closeModal() {
    modalWindow.classList.add('hide')
    document.body.classList.remove('modal-opened')
    modalSubmit.removeEventListener('click', handleSubmit)
}
// проверка на кол символов
function validateInpunt(title, text) {
    let maxTitleLength = 200
    let maxTextLength = 2000

    if (title.length > maxTitleLength) {
        console.log('Заголовок слишком длинный. Максимальная длина: 200 символов.')
        return false
    }
    if (text.length > maxTextLength) {
        console.log('Текст слишком длинный. Максимальная длина: 2000 символов.')
        return false
    }
    return true
}
//функция создания card__item и добавляет в html dom
function createEl(title, text, date, time) {
    title = modalTitle.value
    text = modalText.value
    date = modalDate.value
    time = getCurrentTime()

    const newCard = document.createElement('div')
    newCard.classList.add('cards__item')

    newCard.innerHTML = `
    <h2 class="cards__title">${title}</h2>
    <p class="cards__text">${text}</p>
    <div class="card__current_date">
        <div class="card__date">${date}</div>
        <div class="card__time">${time}</div>
    </div>`

    cardsContainer.appendChild(newCard)
}

function handleSubmit(event) {
    event.preventDefault()
    const title = modalTitle.value
    const text = modalText.value
    const date = modalDate.value

    if (validateInpunt(title, text, date)) {
        createEl(title, text, date)
        saveDate(title, text, date)
        clearInputs()
        closeModal()
    }
}
//очистка инпутов
function clearInputs() {
    modalTitle.value = ''
    modalText.value = ''
    modalDate.value = ''
}

//функция получения реального времени
function getCurrentTime() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();

    const timeString = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

    return timeString;
}

function saveDate(title, text, date,) {
    const time = getCurrentTime()
    const newItems = {
        title: title,
        text: text,
        date: date,
        time: time
    }

    fetch('posts.json')
        .then(response => response.json())
        .then(date => {
            if (!date.cards) {
                date.cards = []
            }

            date.cards.push(newItems)

            return date
        })

    fetch('posts.json', {
        method: 'PUT',
        body: JSON.stringify(date),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (response.ok) {
                console.log('Данные успешко отправлены! на псевдо сервер ))')
            } else {
                console.error('Ошибка при отправки данных на псевдо сервер ))')
            }
        })
        .catch(error => {
            console.error('Ошибка', error)
        })
}

// function saveData(title, text, date, time) {
//     const newCard = {
//         title: title,
//         text: text,
//         date: date,
//         time: time
//     };

//     // Загружаем текущие данные из JSON-файла
//     fetch('posts.json')
//         .then(response => response.json())
//         .then(data => {
//             if (!data.cards) {
//                 data.cards = [];
//             }

//             // Добавляем новую карточку в массив
//             data.cards.push(newCard);

//             // Отправляем обновленные данные обратно на сервер
//             return fetch('posts.json', {
//                 method: 'PUT',
//                 body: JSON.stringify(data),
//                 headers: {
//                     'Content-Type': 'application/json'
//                 }
//             });
//         })
//         .then(response => {
//             if (response.ok) {
//                 console.log('Данные успешно отправлены на сервер.');
//             } else {
//                 console.error('Произошла ошибка при отправке данных на сервер.');
//             }
//         })
//         .catch(error => {
//             console.error('Произошла ошибка:', error);
//         });
// }
