export { per_page };

import './css/styles.css';
import {
  form,
  gallery,
  input,
  submit,
  photoCard,
  btnContainer,
  loadMore,
} from './js/elements';
import { pixaBayAPI } from './js/api';
import { createMarkup } from './js/markup';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';

const SimpleLightboxModal = new SimpleLightbox('.gallery a');

let page = 1;
let per_page = 40;
let query = '';
let totalHits = 0;

loadMore.hidden = true;

form.addEventListener('submit', onSubmit);
loadMore.addEventListener('click', onLoad);

function onSubmit(e) {
  e.preventDefault();
  query = e.currentTarget.elements[0].value.trim().toLowerCase();
  page = 1;
  loadMore.hidden = true;
  pixaBayAPI(query, page)
    .then(data => {
      if (data.hits.length === 0) {
        gallery.innerHTML = '';
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        gallery.innerHTML = createMarkup(data);
        totalHits = data.totalHits;
        if (totalHits >= per_page) {
          loadMore.hidden = false;
        }
        Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
        SimpleLightboxModal.refresh();
      }
    })
    .catch(err => console.log(err));
}

function onLoad() {
  page += 1;
  pixaBayAPI(query, page)
    .then(data => {
      gallery.insertAdjacentHTML('beforeend', createMarkup(data));
      SimpleLightboxModal.refresh();
      if (page >= Math.ceil(totalHits / per_page)) {
        loadMore.hidden = true;
        Notiflix.Notify.failure(
          "We're sorry, but you've reached the end of search results."
        );
      }
    })
    .catch(err => console.log(err));
}