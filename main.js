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

function openModal() {
    modalWindow.classList.remove('hide')
    document.body.classList.add('modal-opened')
    modalSubmit.addEventListener('click', handleSubmit)
}

function closeModal() {
    modalWindow.classList.add('hide')
    document.body.classList.remove('modal-opened')
    modalSubmit.removeEventListener('click', handleSubmit)
}

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

function handleSubmit() {
    const title = modalTitle.value
    const text = modalText.value
    const date = modalDate.value

    if (validateInpunt(title, text, date)) {
        createEl(title, text, date)
        clearInputs()
        closeModal()
    }
}

function clearInputs() {
    modalTitle.value = ''
    modalText.value = ''
    modalDate.value = ''
}


function getCurrentTime() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();

    const timeString = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

    return timeString;
}