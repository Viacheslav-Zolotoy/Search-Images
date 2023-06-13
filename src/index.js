import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import Notiflix from 'notiflix';
import OnlyScroll from 'only-scrollbar';
import { fetchImg } from "./api";
import { renderImgCard } from "./renderCard";
export const cardBlock = document.querySelector('.gallery');
const searchFormEl = document.querySelector('#search-form');
const typeInputEl = document.querySelector('input[name="searchQuery"]');
const scroll = new OnlyScroll(window);
export let page = 0;
export const perPage = 40;
const target = document.querySelector('.obseerver');
let typeValue = '';
export let observer = null;
function createImg(event) {
    event.preventDefault();
    cardBlock.innerHTML = '';
    page = 1;
    fetchData();
    if (observer) {
        observer.disconnect();
    }
};
function fetchData() {
    typeValue = typeInputEl.value;
    fetchImg(typeValue)
        .then((response) => {
            observerFunc(response);
            renderImgCard(response);
        })
        .catch(error => {
            console.log(error)
            Notiflix.Notify.failure('Oops! Something went wrong! Try reloading the page!');
        });
};
searchFormEl.addEventListener('submit', createImg);
function observerFunc() {
    const options = {
        root: null,
        rootMargin: '500px',
        threshold: 1,
    }
    const callback = function (entries) {
        entries.forEach(entry => {
            if (!cardBlock.firstElementChild) {
                return;
            } else if (entry.isIntersecting) {
                page += 1;
                fetchImg(typeValue)
                    .then(response => {
                        if ((perPage * page) > response.data.totalHits) {
                            observer.disconnect();
                            Notiflix.Notify.warning("We're sorry, but you've reached the end of search results.");
                            return;
                        }
                        renderImgCard(response);
                    })
                    .catch(error => {
                        Notiflix.Notify.failure('Oops! Something went wrong! Try reloading the page!');
                        console.log(error)
                    });
            }
        })
    };
    observer = new IntersectionObserver(callback, options);
    observer.observe(target)
};

// Button loading
