"use strict";
// try without jshint and with
/* jshint esversion: 8 */

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

    const getResourse = async (url) => { // асинхронная функция отсылающая запрос на сервер
        let res = await fetch(url);  // aweit  ждет пока не прийдет ответ
        
        if(!res.ok){// если в запросе , что то не так
            throw new Error(`Could not fetch ${url}, status:${res.status}`);
        }

        return await res.json();
    }; 

    // getResourse('http://localhost:3000/menu')
    //     .then(data => {
    //         data.forEach(({img, altimg, title, descr, price}) => { // вытягиваем свойства обьекта(диструктуризирую обьект по отдельным частям)
    //             new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
    //         });
    //     });    
   
        axios.get('http://localhost:3000/menu')
            .then(data => {
                data.data.forEach(({img, altimg, title, descr, price}) => {
                    new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
                });
            });

 // ============================================FORMS=======================================================
 
    const forms = document.querySelectorAll('form');

    const messange = { // заготовка ответов при отсылании данных с инпут на сервер
        loading: 'img/form/spinner.svg',
        success:'Спасибо мы скоро с вами свяжимся',
        failure: 'Что-то пошло не так...'
    };

    forms.forEach(item => {
        bindPostData(item);
    });
    const postData = async (url, data) => { // асинхронная функция отсылающая запрос на сервер
        let res = await fetch(url, { // aweit  ждет пока не прийдет ответ
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: data
        });
        return await res.json();
    }; 

    function bindPostData(form){
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
            
            // const object = {};// JSON только.  создаем обьект и превращаем  FormData  в обычный обьект
            // formData.forEach(function(value, key) {
            //     object[key] = value;
            // }); 

            const json = JSON.stringify(Object.fromEntries(formData.entries()));

            postData('http://localhost:3000/requests', json)
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
    
    //==================================SLIDE ===========================
    const slides = document.querySelectorAll('.offer__slide'),
          slider = document.querySelector('.offer__slider'),
          prev = document.querySelector('.offer__slider-prev'),
          next = document.querySelector('.offer__slider-next'),
          total = document.querySelector('#total'),
          current = document.querySelector('#current'),
          slidesWrapper = document.querySelector('.offer__slider-wrapper'),
          slidesField = document.querySelector('.offer__slider-inner'),
          width = window.getComputedStyle(slidesWrapper).width;
    let slideIndex = 1;
    let offset = 0;

    if(slides.length < 10){// устанавливаем цифры над слайдом
        total.textContent = `0${slides.length}`;
        current.textContent = `0${slideIndex}`;
    }else{
        total.textContent = slides.length;
        current.textContent = slideIndex;
    }
    
    slidesField.style.width = 100 * slides.length+ '%'; //1 устанавливаем шириу контейнера для слайдов
    slidesField.style.display = 'flex'; // 3. устанавливаем  горизонтально слайды
    slidesField.style.transition = '0.5s all';

    slidesWrapper.style.overflow = 'hidden';// скрываем часть которая не должна быть видна в слайде

    slides.forEach(slide => {
        slide.style.width = width; // 2 устанавливаем одинаковую ширину для каждого сайда
    });

    slider.style.position = 'relative';

    const indicators = document.createElement('ol'),
          dots = [];
    indicators.classList.add('carousel-indicators');
    slider.append(indicators);

    for(let i = 0; i < slides.length; i++){
        const dot = document.createElement('li');
        dot.setAttribute('data-slide-to', i +1); // устанавливаем атрибут каждому слайду начиная с 1 
        dot.classList.add('dot');

        if(i == 0){
            dot.style.opacity = 1;//  создаем стиль индикатору
        }
        indicators.append(dot);
        dots.push(dot);
    }

    next .addEventListener('click', () => {
        if(offset == +width.slice(0, width.length-2)*(slides.length - 1)){// если слайде на последней фото
            offset = 0;
        }else{
            offset += +width.slice(0, width.length - 2);
        }
        
        slidesField.style.transform = `translateX(-${offset}px)`;//перемещение слайда
        if(slideIndex== slides.length){
            slideIndex = 1;
        }else{
            slideIndex ++;
        }

        slideLength();
        delOpacity();
    });

    prev.addEventListener('click', () => {
        if(offset == 0){
            offset = +width.slice(0, width.length -2)*(slides.length - 1);
        }else{
            offset -= +width.slice(0, width.length - 2);
        }
        slidesField.style.transform = `translateX(-${offset}px)`;

        if(slideIndex == 1 ){
            slideIndex = slides.length;
        }else{
            slideIndex--;
        }
        slideLength();
        delOpacity();
    });    

        
         console.log(dots);
        dots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                const slideTo = e.target.getAttribute('data-slide-to');
                
                slideIndex =slideTo;
                offset = +width.slice(0, width.length -2)*(slideTo - 1);
                
                slidesField.style.transform = `translateX(-${offset}px)`;

                slideLength();
                delOpacity();
            });
        });

        function slideLength(){
            if(slides.length < 10){
                current.textContent = `0${slideIndex}`;
            }else{
                current.textContent = slideIndex;
            }
        }

        function delOpacity(){
            dots.forEach(dot => dot.style.opacity = '.5');// убираем выделение
            dots[slideIndex - 1].style.opacity = 1;// ставим выделение синхронно слайду
        }
    
    // showSlides(slideIndex); // 5. ствим предел по фото (1/4)
    // if (slides.length < 10){
    //     total.textContent = `0${slides.length}`;
    // }else{
    //     total.textContact = slides.length;
    // }
    
    // function showSlides(n){ // 1. проверяем клики на предел фото
    //     if (n > slides.length){
    //         slideIndex = 1;
    //     }
    //     if (n < 1){
    //         slideIndex = slides.length;
    //     }
        
    //     slides.forEach(item => item.style.display = "none");// 2. скрываем все фото
    //     slides[slideIndex - 1].style.display = "block"; //3. открываем нужное фото
        
    //     if(slides.length < 10){ // 6. ставим 1ю цивру с 1/4
    //         current.textContent = `0${slideIndex}`;
    //     }else{
    //         current.textContent = slideIndex;
    //     }
    // }

    // function plusSlides(n){ // 4. отправляю значение при нажати на кнопки
    //     showSlides(slideIndex += n)
    // }

    // prev.addEventListener('click', () => {
    //     plusSlides(-1);
    // });
    // next.addEventListener('click', () => {
    //     plusSlides(1);
    // });
    
  
});