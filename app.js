const SECTION = document.getElementById('section');

let story
let current_chapter = 0
let pages_turned = 0

let motion_reduced = window.matchMedia("(prefers-reduced-motion: reduce)") ? true : false
let prefers_dark = window.matchMedia("(prefers-color-scheme: dark)") ? true : false

function findChapter(chapter) {
	for (let i = 0; i < story.story.length; i++) {
		if (story.story[i].chapter == chapter) {
			return story.story[i]
		}
	}
	// if its not found, return an error chapter, notably 1234
	return story.errorcodes[0]
}

function renderChapter() {
	const my_page = pages_turned

	let ch_num = document.createElement('div');
	ch_num.className = 'chapter';
	ch_num.id = 'ch_num';
	ch_num.innerText = findChapter(current_chapter).chapter;
	SECTION.appendChild(ch_num);

	setTimeout(function() {
		if (my_page != pages_turned) return

		let ch_ttl = document.createElement('div');
		ch_ttl.className = 'chaptertitle';
		ch_ttl.id = 'ch_ttl';
		ch_ttl.innerText = findChapter(current_chapter).title;
		SECTION.appendChild(ch_ttl);

		setTimeout(() => {
			if (my_page != pages_turned) return

			let ch_content = document.createElement('div');
			ch_content.className = 'chaptercontent';
			ch_content.id = 'ch_content';
			ch_content.innerText = findChapter(current_chapter).content;
			SECTION.appendChild(ch_content);
		}, 400);
	}, 200);
}

function renderNavi() {
	let nav_back = document.createElement('div');
	nav_back.className = 'chapterback';
	nav_back.id = 'nav_back';
	nav_back.innerText = '◄';
	if (current_chapter == 0) {
		nav_back.style.visibility = 'hidden'
	}
	SECTION.appendChild(nav_back);

	let nav_next = document.createElement('div');
	nav_next.className = 'chapternext';
	nav_next.id = 'nav_next';
	nav_next.innerText = '►';
	if (current_chapter == story.story.length - 1) {
		nav_next.style.visibility = 'hidden'
	}
	SECTION.appendChild(nav_next);

	nav_back.addEventListener('click', function() {
		console.log('back')
		if (current_chapter > 0) {
			current_chapter--
			pages_turned++
			SECTION.innerHTML = ''
			renderAll()
		}
	})
	nav_next.addEventListener('click', function() {
		console.log('next')
		if (current_chapter < story.story.length - 1) {
			current_chapter++
			pages_turned++
			renderAll()
		}
	})
}

function renderChapterSelectorFooter() {
	let chapter_selector_footer = document.createElement('div');
	chapter_selector_footer.className = 'chapterselectorfooter';
	chapter_selector_footer.id = 'chapter_selector_footer';
	SECTION.appendChild(chapter_selector_footer);

	// get 4 chapters before and after the current chapter
	let chapters = []
	for (let i = current_chapter - 4; i < current_chapter + 5; i++) {
		if (i >= 0 && i < story.story.length) {
			chapters.push(i)
		}
	}

	let nav_back = document.createElement('div');
	nav_back.className = 'chapterback';
	nav_back.id = 'nav_back';
	nav_back.innerText = '◄';
	if (current_chapter == 0) {
		nav_back.style.visibility = 'hidden'
	}
	chapter_selector_footer.appendChild(nav_back);

	nav_back.addEventListener('click', function() {
		console.log('back')
		if (current_chapter > 0) {
			current_chapter--
			pages_turned++
			SECTION.innerHTML = ''
			renderAll()
		}
	})

	for (let i = 0; i < chapters.length; i++) {
		let chapter_selector = document.createElement('div');
		chapter_selector.className = 'box';
		chapter_selector.id = `chapter_selector_${chapters[i]}`;
		chapter_selector.innerText = chapters[i];
		if (chapters[i] == current_chapter) {
			chapter_selector.className = 'selectedbox'
		}
		chapter_selector_footer.appendChild(chapter_selector);

		chapter_selector.addEventListener('click', function() {
			console.log('chapter selector')
			current_chapter = parseInt(this.innerText)
			pages_turned++
			renderAll()
		})
	}

	let nav_next = document.createElement('div');
	nav_next.className = 'chapternext';
	nav_next.id = 'nav_next';
	nav_next.innerText = '►';
	if (current_chapter == story.story.length - 1) {
		nav_next.style.visibility = 'hidden'
	}
	chapter_selector_footer.appendChild(nav_next);

	nav_next.addEventListener('click', function() {
		console.log('next')
		if (current_chapter < story.story.length - 1) {
			current_chapter++
			pages_turned++
			renderAll()
		}
	})
}

function renderFooterOptions() {
	const footer = document.getElementById('footer')
	const settings = document.getElementById('settings')
	const chapter_select = document.getElementById('ch_sel')
	const dark_mode = document.getElementById('dark')

	dark_mode.classList = prefers_dark ? 'footeroptionsselected' : 'footeroptions'
	dark_mode.addEventListener('click', function() {
		prefers_dark = !prefers_dark
		dark_mode.classList = prefers_dark ? 'footeroptionsselected' : 'footeroptions'
		// change the :root css variables
		document.documentElement.style.setProperty('--bg-color', prefers_dark ? '#1f1f27' : '#ffefef')
		document.documentElement.style.setProperty('--text-color', prefers_dark ? '#ffefef' : '#1f1f27')
	})
}

function renderAll() {
	const my_page = pages_turned

	window.location.hash = current_chapter
	SECTION.innerHTML = ''
	renderNavi()
	renderFooterOptions()
	renderChapter()
	setTimeout(() => {
		if (my_page != pages_turned) return
		renderChapterSelectorFooter()
	}, 1000);
}

fetch('./story.json')
	.then((response) => response.json())
	.then((data) => {
		story = data
		if (window.location.hash) {
			current_chapter = parseInt(window.location.hash.substring(1))
			// see if the hash is a valid chapter, if not, replace to 1234 as a warning
			if (findChapter(current_chapter) == null) {
				current_chapter = 1234
			}
		}

		renderAll()
	}
);

window.addEventListener('hashchange', function() {
	if (window.location.hash) {
		current_chapter = parseInt(window.location.hash.substring(1))
		// see if the hash is a valid chapter, if not, replace to 1234 as a warning
		if (findChapter(current_chapter) == null) {
			current_chapter = 1234
		}
		pages_turned++
		renderAll()
	}
})
