console.log('IT’S ALIVE!');

function $$(selector, context = document) {
    return Array.from(context.querySelectorAll(selector));
}

// const navLinks = $$('nav a');
// let currentLink = navLinks.find(
//     (a) => a.host === location.host && a.pathname === location.pathname
// );
// currentLink?.classList.add('current');
// console.log(currentLink);

let pages = [
    {url: '', title: 'Home'},
    {url: 'projects/', title: 'Projects'},
    {url: 'contact/', title: 'Contact'},
    {url: 'resume/', title: 'Resume'},
    {url: 'https://github.com/Nayan-Bhatnagar', title: 'Github'}
];

let nav = document.createElement('nav');
document.body.prepend(nav);

for (let p of pages) {
    const BASE_PATH = (location.hostname === "localhost" || location.hostname === "127.0.0.1") ?
        "/" : "/portfolio/";
    let url = p.url;
    url = url.startsWith('http') ? url : BASE_PATH + url;
    let title = p.title;

    let a = document.createElement('a');
    a.href = url;
    a.textContent = title;
    nav.append(a);

    if (a.host === location.host && a.pathname === location.pathname) {
        a.classList.add('current');
    };
    if (a.host !== location.host) {
        a.target = '_blank';
    }
};

document.body.insertAdjacentHTML(
  'afterbegin',
  `
	<label class = "color-scheme">Theme:
		<select>
			<option value = "light dark">Automatic</option>
            <option value = "light">Light</option>
            <option value = "dark">Dark</option>
		</select>
	</label>`,
);

let select = document.querySelector('select');
select.addEventListener('input', function (event) {
    document.documentElement.style.setProperty('color-scheme', event.target.value);
    localStorage.colorScheme = event.target.value;
});

if ('colorScheme' in localStorage) {
    document.documentElement.style.setProperty('color-scheme', localStorage.colorScheme);
    select.value = localStorage.colorScheme;
};


    // <nav>
    //     <a href = "index.html">Home</a>
    //     <a href = "projects/index.html">Projects</a>
    //     <a href = "contact/index.html">Contact</a>
    //     <a href = "resume/index.html">Resume</a>
    //     <a href = "https://github.com/Nayan-Bhatnagar" target = "_blank">Github</a>
    // </nav>