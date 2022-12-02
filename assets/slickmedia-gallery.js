if (!customElements.get('media-gallery')) {
  customElements.define('media-gallery', class MediaGallery extends HTMLElement {
    constructor() {
      super();

      var slickVerticalDirfection = this.querySelector('[id^="slickslider"]').dataset.slickDirfection == 'false' ? false : true;
      this.elements = {
        big: $(this).find('[id^="slider"]'),
        thumb: $(this).find('[id^="thumbs"]'),
        slider: $(this).find('[id^="slickslider"]'),
        big_content: $(this).find('[id^="slider"]').html(),
        thumb_content: $(this).find('[id^="thumbs"]').html(),
        mediafilter: this.dataset.mediafilter == 'true' ? true : false,
        mediaCurrentColor: this.dataset.mediacurrentcolor,
        slider_big_settings: {
            infinite: false,
            arrows: false,
            fade: true,
            asNavFor: $(this).find('[id^="thumbs"]'),
        },
        slider_thumb_settings: {
            vertical: slickVerticalDirfection,
            verticalSwiping: slickVerticalDirfection,
            infinite: false,
            arrows: true,
            slidesToShow: 3,
            slidesToScroll: 1,
            asNavFor: $(this).find('[id^="slider"]'),
            focusOnSelect: true,
            responsive: [
                {
                    breakpoint: 992,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 1,

                    }
                },
                {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 1,
                        vertical: false,
                        verticalSwiping: false
                    }
                },
            ]
        },
      }
      this.slickInit();
    }
    slickInit(event) {
        if(this.elements.slider){
            this.elements.big.slick(this.elements.slider_big_settings);
            this.elements.thumb.slick(this.elements.slider_thumb_settings);
        }
        if(this.elements.mediafilter){
            console.log('.'+this.elements.mediaCurrentColor);
            this.elements.big.slick('slickFilter', '.'+this.elements.mediaCurrentColor);
            this.elements.thumb.slick('slickFilter', '.'+this.elements.mediaCurrentColor);
        }        
    }
    onSlideChanged(event) {
        console.log('log:',event.detail.currentElement.dataset.mediaId);
        const thumbnail = this.elements.thumb.querySelector(`[data-target="${ event.detail.currentElement.dataset.mediaId }"]`);
        this.setActiveThumbnail(thumbnail);
    }
    setActiveMedia(mediaId, prepend) {
        if($('#Slide-Thumbs-'+mediaId).length > 0){
            var slideNo = $('#Slide-Thumbs-'+mediaId).attr('data-slick-index');
            if($(this.elements.thumb).hasClass('slick-initialized')) {
                $(this.elements.thumb).slick('slickGoTo', slideNo);
            } else {
                $(this.elements.big).slick('slickGoTo', slideNo);
            }
        }
    }
    findFilterMedia(mediaGallery,currentVariant) {
        var objectEl = document.querySelectorAll(`variant-radios[data-section="${this.dataset.section}"]  fieldset legend`);
        var returnItem = 0;
        objectEl.forEach((item, index) => {
          // index++;
          var itemText = item.innerText.toLowerCase();
          if(itemText == 'color' || itemText == 'colour'){
            returnItem = index;
          }
        });
        var getTheColor = currentVariant.options[returnItem];
        // console.log('getTheColor',getTheColor);
        if(this.elements.mediafilter){this.filterSlickMedia(getTheColor)}       
    }
    filterSlickMedia(colorVal){
        if($(this.elements.big).hasClass('slick-initialized') && $(this.elements.thumb).hasClass('slick-initialized') && currentColor !== ''){
            var currentColor = colorVal.toLowerCase();
            // currentColor = '';
            console.log('currentColor',currentColor);
            if (currentColor == "reset") {
                $(this.elements.big).slick('unslick').empty().append(this.elements.big_content).slick(this.elements.slider_big_settings);
                $(this.elements.thumb).slick('unslick').empty().append(this.elements.thumb_content).slick(this.elements.slider_thumb_settings);
                console.log('this');
            }else{
                if($(this.elements.big_content).filter('[data-meidacolor="'+currentColor+'"]').length > 0){
                    var _big_new = $(this.elements.big_content).filter('[data-meidacolor="' + currentColor + '"]');
                    var _thumb_new = $(this.elements.thumb_content).filter('[data-meidacolor="' + currentColor + '"]');
                    // $(this.elements.big).slick('unslick').empty().append(_big_new).slick(this.elements.slider_big_settings);
                    // $(this.elements.thumb).slick('unslick').empty().append(_thumb_new).slick(this.elements.slider_thumb_settings);
                    this.elements.big.slick('slickUnfilter');
                    this.elements.thumb.slick('slickUnfilter');
                    this.elements.big.slick('slickFilter','.'+currentColor);
                    this.elements.thumb.slick('slickFilter','.'+currentColor);
    
                }
            }
        }
    }
  });
}