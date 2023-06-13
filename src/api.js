import Notiflix from 'notiflix';
import { page } from './index';
import { perPage } from './index';
const axios = require('axios').default;
export async function fetchImg(typeValue) {
    const response = await axios.get('https://pixabay.com/api/', {
        params: {
            key: '36865629-a181ba7c52348470e5fc378ab',
            q: `${typeValue}`,
            page: `${page}`,
            per_page: `${perPage}`,
            image_type: 'photo',
            orientation: 'horizontal',
            safesearch: 'true',
        }
    });
    if (response.data.hits.length === 0) {
        Notiflix.Notify.failure('Sorry, there are no images matching your search query.Please try again.');
        return;
    };
    if (page === 1) {
        Notiflix.Notify.info(`Hooray! We found ${response.data.totalHits} images.`);
    }
    return response;
};