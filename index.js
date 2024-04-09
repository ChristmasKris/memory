'use strict';

const index = {
	page: document.querySelector('.page'),
	board: document.querySelector('.board'),
	settings: {
		imageWidth: 400,
		imageHeight: 225,
		imageFlippedTime: 800,
		level: 3,// 1, 2, 3, 4
		mediaImageAmount: 16
	},
	images: [],
	guessed: -1,
	newGuess: -1,
	clickedImages: [],
	guessedAmount: 0,
	
	init() {
		index.createImages();
	},
	
	createImages() {
		let horizontal = Math.floor((window.innerWidth - 10) / (index.settings.imageWidth + 10));
		let vertical = Math.floor((window.innerHeight - 10) / (index.settings.imageHeight + 10));
		
		switch (index.settings.level) {
			case 1:
				horizontal = 3;
				vertical = 2;
				break;
			case 2:
				horizontal = 4;
				vertical = 3;
				break;
			case 3:
				horizontal = 5;
				vertical = 4;
				break;
			case 4:
				horizontal = 6;
				vertical = 5;
				break;
		}
		
		let randomNumber, image;
		let counter = 0;
		
		index.board.style.width = (horizontal * (index.settings.imageWidth + 10)) + 'px';
		index.board.style.height = (vertical * (index.settings.imageHeight + 10)) + 'px';
		
		for (let i = 0; i < ((horizontal * vertical) / 2); i++) {
			do {
				randomNumber = random.int(0, index.settings.mediaImageAmount);
			} while (index.images.includes(randomNumber));
			
			index.images.push(randomNumber);
		}
		
		index.images = index.images.concat(index.images);
		index.images = index.images.sort(() => Math.random() - 0.5);
		
		for (let y = 0; y < vertical; y++) {
			for (let x = 0; x < horizontal; x++) {
				image = strToEl(`
					<div class="image" title="Flip image" number="` + index.images[counter] + `">
						<div class="imageInner">
							<div class="imageFront">
								<div class="imageFrontInner">
									<div class="imageText">
										<span>MEMORY MEMORY MEMORY MEMORY MEMORY</span>
										<span>MEMORY MEMORY MEMORY MEMORY MEMORY</span>
										<span>MEMORY MEMORY MEMORY MEMORY MEMORY</span>
										<span>MEMORY MEMORY MEMORY MEMORY MEMORY</span>
										<span>MEMORY MEMORY MEMORY MEMORY MEMORY</span>
										<span>MEMORY MEMORY MEMORY MEMORY MEMORY</span>
										<span>MEMORY MEMORY MEMORY MEMORY MEMORY</span>
										<span>MEMORY MEMORY MEMORY MEMORY MEMORY</span>
										<span>MEMORY MEMORY MEMORY MEMORY MEMORY</span>
										<span>MEMORY MEMORY MEMORY MEMORY MEMORY</span>
										<span>MEMORY MEMORY MEMORY MEMORY MEMORY</span>
									</div>
								</div>
							</div>
							<div class="imageBack">
								<div class="imageBackInner" style="background-image:url('./media/images/` + index.images[counter] + `.jpg')"></div>
								<img src="./media/images/` + index.images[counter] + `.jpg"/>
							</div>
						</div>
					</div>
				`);
				
				listener.add(image.querySelector('.imageBack img'), 'load', (e)=>{
					let dominantColor = getDominantColor(e.currentTarget);
					e.currentTarget.parentElement.style.backgroundColor = dominantColor;
					e.currentTarget.parentElement.style.borderColor = dominantColor;
					e.currentTarget.parentElement.removeChild(e.currentTarget);
				});
				
				if (y == (vertical - 1)) {
					image.style.marginBottom = '0';
				}
				
				if (x == (horizontal - 1)) {
					image.style.marginRight = '0';
				}
				
				listener.add(image, 'click', (e)=>{
					if (e.currentTarget.hasAttribute('guessed') || index.clickedImages.includes(e.currentTarget) || (index.clickedImages.length == 2)) {
						return;
					}
					
					let cardFlipAudio = new Audio('./cardFlip.mp3');
					cardFlipAudio.playbackRate = 0.9;
					cardFlipAudio.play();
					index.clickedImages.push(e.currentTarget);
					index.newGuess = parseInt(e.currentTarget.getAttribute('number'));
					e.currentTarget.querySelector('.imageInner').style.transform = 'rotateY(-180deg)';
					
					if (index.guessed == -1) {
						index.guessed = index.newGuess;
						index.newGuess = -1;
					} else if (index.guessed == index.newGuess) {
						for (let image of document.querySelectorAll('.image[number="' + index.newGuess + '"]')) {
							image.setAttribute('guessed', 'true');
						}
						
						index.guessed = -1;
						index.newGuess = -1;
						index.clickedImages = [];
						index.guessedAmount++;
						
						if (index.guessedAmount == (index.images.length / 2)) {
							setTimeout(()=>{
								location.reload();
							}, index.settings.imageFlippedTime);
						}
					} else {
						setTimeout(()=>{
							for (let image of document.querySelectorAll('.image[number="' + index.newGuess + '"]')) {
								image.querySelector('.imageInner').style.transform = '';
							}
							
							for (let image of document.querySelectorAll('.image[number="' + index.guessed + '"]')) {
								image.querySelector('.imageInner').style.transform = '';
							}
							
							index.guessed = -1;
							index.newGuess = -1;
							index.clickedImages = [];
						}, index.settings.imageFlippedTime);
					}
				});
				
				index.board.appendChild(image);
				counter++;
				
				if ((x == (horizontal - 1)) && (y == (vertical - 1))) {
					setTimeout(()=>{
						let timeout = 100;
						
						for (let image of document.querySelectorAll('.image')) {
							setTimeout((oldImage)=>{
								oldImage.style.opacity = '1';
							}, timeout, image);
							timeout += 50;
						}
					}, 100);
				}
			}
		}
	}
};

index.init();