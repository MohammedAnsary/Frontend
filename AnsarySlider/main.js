$(document).ready(function(){
	$.fn.extend({
		ansary: function(options) {

			const defaultNextArrow = '<a href="javascript:0" class="right">&#8250;</a>';
			const defaultPrevArrow = '<a href="javascript:0" class="left">&#8249;</a>';
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
			let shiftDistance = config.slidesToScroll * slideWidth;
			let idx = 0;
			let rightBusy = false;
			let leftBusy = false;

			this.addClass('slider');
			children.addClass('slide');
			this.wrapInner('<div class="slider-track"></div>');
			this.wrapInner('<div class="slider-window"></div>');

			if(len <= config.visibleSlides) return;

			this.append(config.nextArrow);
			this.append(config.prevArrow);



			if(config.enableDots) {
				this.append(sliderIndex);
				for(var i = 0; i < len; i++) {
					sliderIndex.append(`<li class="slider-index-item" data-index="${i}"></li>`);
				}
				$(`[data-index=${0}]`).addClass('active');
			}

			$('.slide').css('flex-basis', `${slideWidth}%`)
			$('.slide:first').before($('.slide:last'));
			$('.slider-track').css('transform', `translateX(-${shiftDistance}%)`);

			config.nextArrow.click(function() {
				if(rightBusy) return;
				idx = (idx + 1) % len;
				rightBusy = true;
				$('.slider-track').css('transform', `translateX(-${2 * shiftDistance}%)`);
				setTimeout(function(){
					$('.slide:last').after($('.slide:first'));
					$('.slider-track').css('transition', 'none');
					$('.slider-track').css('transform', `translateX(-${shiftDistance}%)`);
					setTimeout(function() {
						$('.slider-track').css('transition', sliderTransition);
						rightBusy = false;
					}, 100);
				}, 500);
				$(`.slider-index-item`).removeClass('active');
				$(`[data-index=${idx}]`).addClass('active');
			});

			config.prevArrow.click(function() {
				if(leftBusy) return;
				leftBusy = true;
				idx--;
				if(idx < 0)
					idx += len;
				$('.slider-track').css('transform', 'translateX(0%)');
				setTimeout(function(){
					$('.slide:first').before($('.slide:last'));
					$('.slider-track').css('transition', 'none');
					$('.slider-track').css('transform', `translateX(-${shiftDistance}%)`);
					setTimeout(function() {
						$('.slider-track').css('transition', sliderTransition);
						leftBusy = false;
					}, 100);
				}, 500);
				$(`.slider-index-item`).removeClass('active');
				$(`[data-index=${idx}]`).addClass('active');
			});
		}
	});

	$('.container').ansary({
		enableDots: true,
		visibleSlides: 2
	});
});
