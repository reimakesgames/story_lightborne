const SECTION = document.getElementById('section');

var story
var current_chapter = 0


function findChapter(chapter) {
	for (var i = 0; i < story.story.length; i++) {
		if (story.story[i].chapter == chapter) {
			return story.story[i]
		}
	}
	// if its not found, return an error chapter, notably 1234
	return story.errorcodes[0]
}

function renderNavi() {
	var nav_back = document.createElement('div');
	nav_back.className = 'chapterback';
	nav_back.id = 'nav_back';
	nav_back.innerText = '◄';
	if (current_chapter == 0) {
		nav_back.style.visibility = 'hidden'
	}
	SECTION.appendChild(nav_back);

	var nav_next = document.createElement('div');
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
			SECTION.innerHTML = ''
			renderNavi()
			renderChapter()
			window.location.hash = current_chapter
			// setTimeout(() => {
			// 	renderNavi()
			// }, 2000);
		}
	})
	nav_next.addEventListener('click', function() {
		console.log('next')
		if (current_chapter < story.story.length - 1) {

			current_chapter++
			SECTION.innerHTML = ''
			renderNavi()
			renderChapter()
			window.location.hash = current_chapter
			// setTimeout(() => {
			// 	renderNavi()
			// }, 2000);
		}
	})
}

function renderChapter() {
	var ch_num = document.createElement('div');
	ch_num.className = 'chapter';
	ch_num.id = 'ch_num';
	ch_num.innerText = findChapter(current_chapter).chapter;
	SECTION.appendChild(ch_num);

	setTimeout(function() {
		var ch_ttl = document.createElement('div');
		ch_ttl.className = 'chaptertitle';
		ch_ttl.id = 'ch_ttl';
		ch_ttl.innerText = findChapter(current_chapter).title;
		SECTION.appendChild(ch_ttl);

		setTimeout(() => {
			var ch_content = document.createElement('div');
			ch_content.className = 'chaptercontent';
			ch_content.id = 'ch_content';
			ch_content.innerText = findChapter(current_chapter).content;
			SECTION.appendChild(ch_content);
		}, 1000);
	}, 200);
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

		renderNavi()
		renderChapter()
		// setTimeout(() => {
		// 	renderNavi()
		// }, 2000);
	}
);
