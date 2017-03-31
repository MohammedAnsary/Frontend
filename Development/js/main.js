$(document).ready(function() {
    $('[data-search]').click(function() {
        $('[data-sfield]').show().select();

        $('.data-search').hide();
    })
    $('[data-sfield]').focusout(function() {
        $('[data-sfield]').hide();
        $('.data-search').show()
    })
    $('.banner-slider1').ansary({
        enableDots: true,
        slidesToShow: 1,
        SlidesToScroll: 1,
        prevArrow: '<div class = "slider-arrow1 slider-arrow1__prev "><span class="fa fa-chevron-left"></span></div>',
        nextArrow: '<div class = "slider-arrow1 slider-arrow1__next "><span class="fa fa-chevron-right"></span></div>',

    })
    $('.banner-slider2').ansary({
        enableDots: false,
        slidesToShow: 1,
        SlidesToScroll: 1,
        prevArrow: '<div class = "slider-arrow slider-arrow__prev "><span class="fa fa-chevron-left"></span></div>',
        nextArrow: '<div class = "slider-arrow slider-arrow__next "><span class="fa fa-chevron-right"></span></div>',

    })

    $('.card-slider').ansary({
        enableDots: true,
        enableArrows: false,
        enableAutoPlay: true,
        visibleSlides: 3,
        slidesToScroll: 3,

    })

    function flippingCardSize() {
        if (('.card_flipping-reversed').length > 0)
            $('.card_flipping-reversed').width($('.card_flipping').width());
    }
    flippingCardSize();

    $(window).on('resize', function() {
        flippingCardSize();
        console.log("window is resized");
    });
});