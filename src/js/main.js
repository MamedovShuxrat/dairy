const axios = require('axios')

document.addEventListener('DOMContentLoaded', function () {

    const headerBtn = document.querySelector('.header__btn')
    const modalWindow = document.querySelector('.modal')
    const modalClose = document.querySelector('.modal__close')
    const modalTitle = document.getElementById('noteTitle')
    const modalSubmit = document.getElementById('modal__submit')
    const modalText = document.getElementById('noteName')
    const modalDate = document.getElementById('noteDate')
    const cardsContainer = document.querySelector('.cards')
    const showMoreBtn = document.querySelector('.btn__more')
    const sliderPageNumbers = document.querySelectorAll('.slider__page-number')
    const sliderLeftBtn = document.querySelector('.btn__left')
    const sliderRightBtn = document.querySelector('.btn__right')
    const sortByOldestBtn = document.querySelector('.filter__btn-down')
    const sortByNewestBtn = document.querySelector(' .filter__btn-up')


    let responseData
    let currentPage = 0


    async function makeRequest() {
        try {
            const response = await axios.get('https://23a2f1ddef45dc47.mokky.dev/cards')
            console.log(response.data)
            responseData = response.data
            generateCards(responseData.slice(0, 6))
        } catch (error) {
            console.error('Ошибка при выполнении запроса:', error)
        }
    }
    makeRequest()

    function generateCards(data) {
        data.forEach((item) => {
            const newCard = document.createElement('div')
            newCard.classList.add('cards__item')

            newCard.innerHTML = `
                <h2 class="cards__title">${item.title}</h2>
                <p class="cards__text">${item.text}</p>
                <p class="card__current_date">
                    <span class="card__date">${item.currentDate.date}</span>
                    <span class="card__time">${item.currentDate.time}</span>
                </p>
            `

            cardsContainer.appendChild(newCard)
        })
    }

    function showMore() {
        const cardsCount = document.querySelectorAll('.cards__item').length

        const nextCards = responseData.slice(cardsCount, cardsCount + 6)
        generateCards(nextCards)
    }

    showMoreBtn.addEventListener('click', showMore)

    headerBtn.addEventListener('click', openModal)
    modalClose.addEventListener('click', closeModal)

    sliderLeftBtn.addEventListener('click', slideLeft)
    sliderRightBtn.addEventListener('click', slideRight)

    sortByNewestBtn.addEventListener('click', sortByNewest)
    sortByOldestBtn.addEventListener('click', sortByOldest)

    function sortByNewest() {
        responseData.sort((a, b) => {
            const dateA = new Date(a.currentDate.date.split('-').reverse().join('-') + ' ' + a.currentDate.time)
            const dateB = new Date(b.currentDate.date.split('-').reverse().join('-') + ' ' + b.currentDate.time)
            return dateA - dateB
        })
        updatePagination()
    }

    function sortByOldest() {
        responseData.sort((a, b) => {
            const dateA = new Date(a.currentDate.date.split('-').reverse().join('-') + ' ' + a.currentDate.time)
            const dateB = new Date(b.currentDate.date.split('-').reverse().join('-') + ' ' + b.currentDate.time)
            return dateB - dateA
        })
        updatePagination()
    }

    function slideLeft() {
        if (currentPage > 0) {
            currentPage--
            updatePagination()
        }
    }

    function slideRight() {
        const totalPages = Math.ceil(responseData.length / 6) - 1  // Рассчитываем общее количество страниц
        if (currentPage < totalPages) {
            currentPage++
            updatePagination()
        }
    }

    sliderPageNumbers.forEach((pageNumber, index) => {
        pageNumber.addEventListener('click', function () {
            currentPage = index
            updatePagination()
        })
    })

    function updatePagination() {
        const startIndex = currentPage * 6
        const endIndex = startIndex + 6
        const cardsToDisplay = responseData.slice(startIndex, endIndex)
        cardsContainer.innerHTML = ''

        generateCards(cardsToDisplay)

        sliderPageNumbers.forEach((pageNumber, index) => {
            if (index === currentPage) {
                pageNumber.classList.add('active')
            } else {
                pageNumber.classList.remove('active')
            }
        })
    }


    function createEl() {
        const title = modalTitle.value
        const text = modalText.value
        const date = modalDate.value
        const time = getCurrentTime()

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

    function validateInpunt(title, text, date) {
        let maxTitleLength = 200
        let maxTextLength = 2000
        if (date === '') {
            alert('Поле "Дата" обязательно к заполнению')
            return false
        }
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

    function handleSubmit(event) {
        event.preventDefault()
        const title = modalTitle.value
        const text = modalText.value
        const date = modalDate.value

        if (validateInpunt(title, text, date)) {
            createEl(title, text, date)
            saveData(title, text, date)
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
        const now = new Date()
        const hours = now.getHours()
        const minutes = now.getMinutes()

        const timeString = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`

        return timeString
    }

    async function saveData(title, text, date) {
        try {
            const time = getCurrentTime()
            const newItems = {
                title: title,
                text: text,
                currentDate: {
                    date: date,
                    time: time
                }
            }

            // Отправляем POST-запрос на сервер
            const response = await axios.post('https://23a2f1ddef45dc47.mokky.dev/cards', newItems)
            console.log('Данные успешно отправлены на сервер:', response.data)
        } catch (error) {
            console.error('Ошибка при отправке данных на сервер:', error)
        }
    }

}) 