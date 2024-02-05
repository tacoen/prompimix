
function fbutton(obj) {
	var url = obj.getAttribute('href');
	window.location.href = url;
}

const pic = [
	['pic/1.jpg','batik, playful pose, strong facial expression, pirate ship, beautiful morning sunlight, day glo, intense emotional atmosphere, canon ef 16-35mm f/2.8l iii usm lens','leonardo.ai'],
	['pic/2.jpg','3d render, a girl wearing animal-costume, serene pose in amusement park, style of akira toriyama','leonardo.ai'],
	['pic/3.jpg','photo, medium shot, a pretty girl wearing wide sleeveless animal-costume, serene pose in amusement park, side view, posing with one-arm raised, photo by ellen von unwerth, glimmering light effects','leonardo.ai'],
	['pic/4.jpg','photo, medium shot, male in red mobile-suit, serene pose in outer space, front view, action pose, foreboding emotional tone, photo photo by steve mccurry','leonardo.ai'],
	['pic/5.jpg','anime with insane details, a pretty girl wearing wide-sleeveless animal-costume, serene pose in amusement park, side view, posing with one-arm raised, photo by ellen von unwerth, glimmering light effects','leonardo.ai'],
	['pic/6.jpg','medium shot, afrofuturism, ross tran style, girl wearing batik, playful pose, strong facial expression, pirate ship, beautiful morning sunlight, day glo, intense emotional atmosphere, canon ef 16-35mm f/2.8l iii usm lens','leonardo.ai'],
	['pic/7.jpg','medium shot, girl with shy expression, running in alleyway, dreamspace atmosphere, shot with fujifilm xf 56mm f/1.2 r lens, melancholic emotional tone, photo by david lachapelle. from bellow, motion blur wind swepts','seaart.ai'],
	['pic/8.jpg','3d render, tokutsatsu, giant robot, action pose','seaart.ai'],
	['pic/9.jpg','propoganda-poster, gta5 art, style of fujiko f. fujio, 2 girl wear military outfit, strong facial expression','seaart.ai']
]


function randommate() {
	var img = document.createElement('img')

	var pick = Math.floor(Math.random() * (pic.length))

	console.log(pick);
	
	img.setAttribute('src', pic[pick][0]);
	var div =  document.createElement('div');
	div.innerHTML = pic[pick][1];
	div.classList.add('prompt');

	document.querySelector('.tease > div').append(img)
	document.querySelector('.tease > div').append(div)
}