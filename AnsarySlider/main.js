$(document).ready(function(){
	var ansarySliderId = 0;
	$.fn.extend({
		ansary: function(options) {
			const defaultNextArrow = '<a href="javascript:void(0)" class="right">&#8250;</a>';
			const defaultPrevArrow = '<a href="javascript:void(0)" class="left">&#8249;</a>';
			const sliderIndex = $('<ul class="slider-index"></ul>');
			const sliderTransition = '0.5s ease-in-out';
			const id = ansarySliderId++;
			const clone = $(this).clone();

			let config = {
				enableDots: options.enableDots? true : false,
				enableSeparator: options.enableSeparator? true : false,
				enableArrows: options.enableArrows != null? options.enableArrows : true,
				enableAutoPlay: options.enableAutoPlay? true : false,
				autoPlaySpeed: options.autoPlaySpeed? options.autoPlaySpeed : 3000,
				visibleSlides: options.visibleSlides? options.visibleSlides : 1,
				slidesToScroll: options.slidesToScroll? options.slidesToScroll : 1,
				prevArrow: options.prevArrow? $(options.prevArrow) : $(defaultPrevArrow),
				nextArrow: options.nextArrow? $(options.nextArrow) : $(defaultNextArrow),
				responsive: options.responsive != undefined?  options.responsive : true,
			}

			let children = this.children();
			let slideWidth = 100/config.visibleSlides;
			let len = children.length;
			let dotNum = Math.ceil(len/config.slidesToScroll);
			let shiftDistance = config.slidesToScroll * slideWidth;
			let startPosition = slideWidth * config.visibleSlides;
			let idx = 0;
			let dataIdx = 0;
			let busy = false;
			let reachedRightEnd = false;
			let reachedLeftEnd = false;
			let paused = true;

			let delayedCorrection = function(distance) {

				setTimeout(function(){
					$(`[data-slider-id=${id}] .slider-track`).css('transition', 'none');
					$(`[data-slider-id=${id}] .slider-track`).css('transform', `translateX(-${distance}%)`);
					setTimeout(function() {
						$(`[data-slider-id=${id}] .slider-track`).css('transition', sliderTransition);
						busy = false;
					}, 100);
				}, 500);
			}

			let slide = function() {
				let distance = idx * slideWidth;
				busy = true;
				$(`[data-slider-id=${id}] .slider-track`).css('transform', `translateX(-${startPosition + distance}%)`);
				if(reachedRightEnd) {
					idx = 0;
					delayedCorrection(startPosition);
					reachedRightEnd = false;
				}
				else if (reachedLeftEnd) {
					idx = len - config.visibleSlides;
					delayedCorrection(startPosition + (idx * slideWidth));
					reachedLeftEnd = false;
				} else
					setTimeout(function(){
						busy = false;
					}, 500);

				$(`[data-slider-id=${id}] .slider-index-item`).removeClass('active');
				$(`[data-slider-id=${id}] [data-index=${Math.ceil(idx/config.slidesToScroll)}]`).addClass('active');
			}

			let goNext = function() {
				if(busy) return;
				if(config.slidesToScroll == 1)
					idx++;
				else {
					let lastIndex;
					idx += config.slidesToScroll;
					lastIndex = idx + config.slidesToScroll - 1;
					if(lastIndex >= len && lastIndex < len + config.slidesToScroll - 1) {
						idx = len - config.visibleSlides;
					}

				}
				if(idx == len)
					reachedRightEnd = true;
				slide();
			}

			let goPrev = function() {
				if(busy) return;
				if(config.slidesToScroll == 1)
					idx--;
				else {
					idx -= config.slidesToScroll;
					if(idx < 0 && idx > -config.visibleSlides)
						idx = 0;
				}
				if(idx == -config.visibleSlides)
					reachedLeftEnd = true;
				slide();
			}

			let autoPlay = function() {
				setTimeout(function() {
					if(!paused) {
						goNext();
					}
					autoPlay();
				}, config.autoPlaySpeed);
			}

			let hovered = function() {
				paused = true;
			}

			let notHovered = function() {
				paused = false;
			}

			this.addClass('slider');
			this.attr('data-slider-id', id);
			children.addClass('slide');
			this.wrapInner('<div class="slider-track"></div>');
			this.wrapInner('<div class="slider-window"></div>');

			if(len <= config.visibleSlides) return;

			if(config.enableArrows) {
				this.append(config.nextArrow);
				this.append(config.prevArrow);
			}


			if(config.enableDots) {
				this.append(sliderIndex);
				for(let i = 0; i < dotNum; i++) {
					sliderIndex.append(`<li class="slider-index-item" data-index="${i}"></li>`);
				}
				$(`[data-index=${0}]`).addClass('active');
			}

			$(`[data-slider-id=${id}] .slide`).css('flex-basis', `${slideWidth}%`);
			$(`[data-slider-id=${id}] .slide`).each(function() {
				$(this).attr('data-slide-index', dataIdx++);
			})

			for (let i = 0; i < config.visibleSlides; i++) {
				let cloneBefore = $(`[data-slider-id=${id}] [data-slide-index = ${len - 1 - i}]`).clone();
				let cloneAfter = $(`[data-slider-id=${id}] [data-slide-index = ${i}]`).clone();
				cloneBefore.attr('data-slide-index', -1 - i);
				cloneAfter.attr('data-slide-index', len + i);
				$(`[data-slider-id=${id}] .slide:first`).before(cloneBefore);
				$(`[data-slider-id=${id}] .slide:last`).after(cloneAfter);
			}

			$(`[data-slider-id=${id}] .slider-track`).css('transform', `translateX(-${startPosition}%)`);

			config.nextArrow.click(function() {
				goNext();
			});

			config.prevArrow.click(function() {
				goPrev();
			});

			$('[data-index]').click(function() {
				idx = $(this).attr('data-index') * config.slidesToScroll;
				if(idx + config.slidesToScroll - 1 >= len) {
					idx = len - config.slidesToScroll;
				}
				slide();
			});

			if(config.enableAutoPlay) {
				paused = false;
				$(`[data-slider-id=${id}].slider`).hover(hovered, notHovered);
				autoPlay();
			}
		}
	});
});
