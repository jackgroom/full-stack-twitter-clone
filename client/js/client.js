const form = document.querySelector('form');
const loadingElement = document.querySelector('.loading');
const mewsElement = document.querySelector('.mews');

const API_URL =
  window.location.hostname === 'localhost' ? 'http://localhost:5000/mews' : '';

loadingElement.style.display = '';

listAllMews();

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(form);

  const name = formData.get('name');
  const content = formData.get('content');

  const mew = {
    name,
    content,
  };

  form.style.display = 'none';
  loadingElement.style.display = '';

  fetch(API_URL, {
    method: 'POST',
    body: JSON.stringify(mew),
    headers: {
      'content-type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((createdMew) => {
      console.log(createdMew);
      form.reset();
      setTimeout(() => {
        form.style.display = '';
        loadingElement.style.display = 'none';
      }, 30000);

      listAllMews();
    });
});

function listAllMews() {
  mewsElement.innerHTML = '';
  fetch(API_URL)
    .then((response) => response.json())
    .then((mews) => {
      mews.reverse();
      mews.forEach((mew) => {
        const div = document.createElement('div');
        const header = document.createElement('h3');
        const contents = document.createElement('p');
        const date = document.createElement('small');

        header.textContent = mew.name;
        contents.textContent = mew.content;
        date.textContent = new Date(mew.created);

        div.appendChild(header);
        div.appendChild(contents);
        div.appendChild(date);

        mewsElement.appendChild(div);
      });
      loadingElement.style.display = 'none';
    });
}
