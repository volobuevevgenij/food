"use strict";

window.addEventListener('DOMContentLoaded', ()  => { 

//---------------TABS---------------------------

    const tabs = document.querySelectorAll('.tabheader__item'),// 1. выбираем пункты меню на которые будем нажимать
        tabsContent = document.querySelectorAll('.tabcontent'),// 2 . выбираем контент верстки
        tabsParent = document.querySelector('.tabheader__items');// 3 . выбираем родительский элемент для пунктов меню
    
    
    function hideTabContent() {// 4. скрываем контент табов
        tabsContent.forEach((item) => { 
            item.classList.add('hide');
            item.classList.remove('show', 'fade');
        });
        tabs.forEach(item => { //5. удаляем класс активности
            item.classList.remove('tabheader__item_active');
        });
    }
    function showTabContent(i = 0) {//6. показываем табы, контент фото
        tabsContent[i].classList.add('show', 'fade');
        tabsContent[i].classList.remove('hide');
        tabs[i].classList.add('tabheader__item_active');//7. присваеваем пункту меню касс активный
    }

    hideTabContent();
    showTabContent();

    tabsParent.addEventListener('click',(event) => {
        const target = event.target;
        if (target && target.classList.contains('tabheader__item')) {// 8.проверяем точно ли нажали на меню
            tabs.forEach((item, i) => {//9. перебираем меню  
                if (target == item) {// 10. проверяем на совпадение меню и пункта который нажали
                    hideTabContent();
                    showTabContent(i); 
                }
            });          
        }
    });


//------------------------- TIMER---------------------------------------------
    
    const deadline = '2022-01-01';// 1. устанавливаем время дедлайна
     
    function getTimeRemaining(endtime) {
        const t = Date.parse(endtime) - Date.parse(new Date()), //1.превращаем в число и вычисляем разницу
            days = Math.floor(t / (1000 * 60 * 60 * 24)), // 2. вычисляем колличество дней      
            hours = Math.floor((t / (1000 * 60 * 60) % 24)), //3. вычисляем часы, вычисляя хвостик которого не хватает до поных суток
            minutes = Math.floor((t / (1000 * 60) % 60)),
            seconds = Math.floor((t / 1000) % 60);
        
        return {
            'total': t,//4.общее колличество секунд
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds' : seconds,
        };
    }
    function getZero(num) {
        if (num >= 0 && num < 10) {
            return `0${num}`;
        } else {
            return num;
        }
    }

    function setClock(selector, endtime) {// 5.получаем все элементы со страницы
        const timer = document.querySelector(selector),
            days = document.querySelector('#days'),
            hours = document.querySelector('#hours'),
            minutes = document.querySelector('#minutes'),
            seconds = document.querySelector('#seconds'),
            timeInterval = setInterval(updateClock, 1000); // 8. ставим интервал
        
        updateClock();

        function updateClock() {//6. обновление времени каждую секунду
            const t = getTimeRemaining(endtime);// 7. возвращаем обьект со всеми данными

            days.innerHTML = getZero(t.days);
            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);

            if (t.total <= 0) {//9. если разница таймера равна 0 то стоп
                clearInterval(timeInterval);
            }
        }
    }
    setClock('.timer', deadline);
    


// -------------------------------------MODAL----------------------------------------

    const modalTrigger = document.querySelectorAll('[data-modal]'),
        modal = document.querySelector('.modal');

     function openModal(){
        modal.classList.add('show');
        modal.classList.remove('hide');
        document.body.style.overflow ='hidden';
        //clearInterval(modalTimerId);
    }

    modalTrigger.forEach(btn => {   
        btn.addEventListener('click', openModal);
    });
    
    function closeModal(){
        modal.classList.add('hide');
        modal.classList.remove('show');
        document.body.style.overflow = '';
    } 

    modal.addEventListener('click', (e) => {
        if(e.target === modal || e.target.getAttribute('data-close')===''){
            closeModal();
        }
    });

    document.addEventListener('keydown', (e)=> {
        if(e.code === 'Escape' && modal.classList.contains('show')){
            closeModal();
        }
    });

    //const modalTimerId = setTimeout(openModal, 3000);
    
    function showModalByScroll(){
        if(window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight){
            openModal();
            window.removeEventListener('scroll', showModalByScroll);
        }
    
    }
    window.addEventListener('scroll', showModalByScroll);
  

    //------------------------------------------ классыдля карточек

    class MenuCard{
        constructor(src, alt, title, descr, price, parentSelector, ...classes){
            this.src = src;
            this.alt = alt;
            this.title =title;
            this.descr = descr;
            this.price = price;
            this.classes = classes;
            this.parent = document.querySelector(parentSelector);
            this.transfer = 27;
            this.chengeToUAH();
        }

        chengeToUAH(){
            this.price = this.price * this.transfer;
        }

        render(){
            const element = document.createElement('div');
            if(this.classes.length === 0){
                this.element = 'menu__item';
                element.classList.add(this.element);
            }else{
                this.classes.forEach(className => element.classList.add(className));
            }
            
            element.innerHTML = `
            <img src= ${this.src} alt= ${this.alt}>
            <h3 class="menu__item-subtitle">${this.title}</h3>
            <div class="menu__item-descr">${this.descr}</div>
            <div class="menu__item-divider"></div>
            <div class="menu__item-price">
                <div class="menu__item-cost">Цена:</div>
                <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
            </div>
            `;
            this.parent.append(element);
        }

    }

    new MenuCard("img/tabs/vegy.jpg",
                     "vegy",
                      "Меню 'Фитнес'",
                      "Меню 'Фитнес' - это новый подход к приготовлению блюд: больше свежиховощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальнойценой и высоким качеством!",
                       229,
                       ".menu .container"
                       ).render();
    new MenuCard("img/tabs/elite.jpg",
                       "elite",
                       'Меню “Премиум”',
                        'и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без походав ресторан!',
                        550,
                        ".menu .container",
                        "menu__item"
                        ).render();
                     
    new MenuCard("img/tabs/post.jpg",
                        "epost",
                        'Меню “Постное”',
                        'Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.',
                        430,
                        ".menu .container",
                        "menu__item",
                        "big"
                        ).render();


 // ============================================FORMS=======================================================
 
    const forms = document.querySelectorAll('form');

    const messange = { // заготовка ответов при отсылании данных с инпут на сервер
        loading: 'img/form/spinner.svg',
        success:'Спасибо мы скоро с вами свяжимся',
        failure: 'Что-то пошло не так...'
    };

    forms.forEach(item => {
        postData(item);
    });
    function postData(form){
        form.addEventListener('submit',(e) => { // событие срабатывающее при вводе в инпут и нажатии на ентер
            e.preventDefault();//удаляем стандартное поведение браузера

            const statusMessange = document.createElement('img'); //создаем поле дя ответа
            statusMessange.src= messange.loading;
            statusMessange.style.cssText=`
                display: block;
                margin: 0 auto;
            `;
            form.insertAdjacentElement('afterend', statusMessange);
            
            const formData = new FormData(form); // новый обьект который передает на сервар то , что уходит с инпута
            
            const object = {};// JSON только.  создаем обьект и превращаем  FormData  в обычный обьект
            formData.forEach(function(value, key) {
                object[key] = value;
            }); 

            fetch('server.php',{
                method:"POST",
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(object)
            })
            .then(data => data.text()) // переводим ответ в текст
            .then(data => {
                console.log(data);
                showThanksModal(messange.success);
                statusMessange.remove();
            }).catch(() => {
                showThanksModal(messange.failure);
            }).finally(() => {
                form.reset(); //очищаем инпут
            });

        });    
    }
    function showThanksModal(messange){
        const prevModalDialog = document.querySelector('.modal__dialog');

        prevModalDialog.classList.add('hide');
        openModal();

        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
            <div class="modal__content">
                <div class="modal__close" data-close>x</div>
                <div class="modal__title">${messange}</div>
            </div>
        `;
        document.querySelector('.modal').append(thanksModal);
        setTimeout(() => {
            thanksModal.remove();
            prevModalDialog.classList.add('show');
            prevModalDialog.classList.remove('hide');
            closeModal();
        }, 4000);
    }
    
    fetch('db.json')
        .then(data => data.json())
        .then(res => console.log(res));

        
    
});