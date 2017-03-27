$(document).ready(function(){
	$.fn.extend({
		ansary: function(options) {

			const defaultNextArrow = '<a href="javascript:void(0)" class="right">&#8250;</a>';
			const defaultPrevArrow = '<a href="javascript:void(0)" class="left">&#8249;</a>';
			const sliderIndex = $('<ul class="slider-index"></ul>');
			const sliderTransition = '0.5s ease-in-out';

			let config = {
				enableDots: options.enableDots? true : false,
				enableSeparator: options.enableSeparator? true : false,
				enableArrows: options.enableArrows != null? options.enableArrows : true,
				enableAutoPlay: options.enableAutoPlay? true : false,
				autoPlaySpeed: options.autoPlaySpeed? options.autoPlaySpeed : 1000,
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

			let delayedCorrection = function(distance) {

				setTimeout(function(){
					$('.slider-track').css('transition', 'none');
					$('.slider-track').css('transform', `translateX(-${distance}%)`);
					setTimeout(function() {
						$('.slider-track').css('transition', sliderTransition);
						busy = false;
					}, 100);
				}, 500);
			}

			let slide = function(distance, cb) {
				busy = true;
				$('.slider-track').css('transform', `translateX(-${startPosition + distance}%)`);
				if(reachedRightEnd) {
					idx = 0;
					delayedCorrection(startPosition, cb);
					reachedRightEnd = false;
				}
				else if (reachedLeftEnd) {
					idx = len - config.visibleSlides;
					delayedCorrection(startPosition + (idx * slideWidth), cb);
					console.log(idx);
					reachedLeftEnd = false;
				}

				else
					setTimeout(function(){
						busy = false;
					}, 500);

				$(`.slider-index-item`).removeClass('active');
				$(`[data-index=${idx}]`).addClass('active');
			}

			this.addClass('slider');
			children.addClass('slide');
			this.wrapInner('<div class="slider-track"></div>');
			this.wrapInner('<div class="slider-window"></div>');

			if(len <= config.visibleSlides) return;

			this.append(config.nextArrow);
			this.append(config.prevArrow);

			if(config.enableDots) {
				this.append(sliderIndex);
				for(var i = 0; i < dotNum; i++) {
					sliderIndex.append(`<li class="slider-index-item" data-index="${i}"></li>`);
				}
				$(`[data-index=${0}]`).addClass('active');
			}

			$('.slide').css('flex-basis', `${slideWidth}%`);
			$('.slide').each(function() {
				$(this).attr('data-slide-index', dataIdx++);
			})

			for (var i = 0; i < config.visibleSlides; i++) {
				let cloneBefore = $(`[data-slide-index = ${len - 1 - i}]`).clone();
				let cloneAfter = $(`[data-slide-index = ${i}]`).clone();
				cloneBefore.attr('data-slide-index', -1 - i);
				cloneAfter.attr('data-slide-index', len + i);
				$('.slide:first').before(cloneBefore);
				$('.slide:last').after(cloneAfter);
			}

			$('.slider-track').css('transform', `translateX(-${startPosition}%)`);

			config.nextArrow.click(function() {
				let distance;
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
				distance = idx * slideWidth;
				slide(distance);


			});

			config.prevArrow.click(function() {
				let distance;
				if(busy) return;
				if(config.slidesToScroll == 1)
					idx--;
				else {
					idx -= config.slidesToScroll;
					console.log(idx);
					if(idx < 0 && idx > -config.visibleSlides)
						idx = 0;
				}
				if(idx == -config.visibleSlides)
					reachedLeftEnd = true;
				distance = idx * slideWidth;
				slide(distance);
			});
		}
	});

	$('.container').ansary({
		enableDots: true,
		visibleSlides: 2,
		slidesToScroll: 2
	});
});