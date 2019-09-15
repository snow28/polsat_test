$(document).ready(function() {

    let config;
    if (window.innerWidth <= 800) {
        config = {
            rootMargin: '350px 0px',
            threshold: 0.01
        };
    } else {
        config = {
            rootMargin: '650px 0px',
            threshold: 0.01
        };
    }

    let images = {};
    let observer;
    const requestUrl = "http://localhost:3000/getData";
    let allowPreload = true;

    function preloadImage(target){
        if (allowPreload) {
            const src = $(target).data('src');
            $(target).attr('src' , src);
        }
    }

    function onIntersection(entries) {
        // Loop through the entries
        entries.forEach(entry => {
            if (entry.intersectionRatio > 0) { // check if visible
                // Stop watching and load the image
                observer.unobserve(entry.target);
                preloadImage(entry.target);
            }
        });
    }

    function blockPreload() {
        allowPreload = false;
        setTimeout(function(){
            allowPreload = true;
            images.forEach(image => {
                observer.observe(image);
            });
        },50);
    }

    window.addEventListener('scroll', function(evt) {
        blockPreload();
    });


    $.ajax({
        type: 'POST',
        url: requestUrl,
        success: function(result){
            let data = result.body;
            data = JSON.parse(data).result.results;
            data.forEach(item => {
               let imageUrl;
               let width;
               let height;
               let index;
                if ( window.innerWidth <= 800 ) {
                    index = 6;
                } else {
                    index = 3;
                }
                width = item.thumbnails[index].size.width;
                height = item.thumbnails[index].size.height;
                imageUrl = item.thumbnails[index].src;
                $('.js-images-wrapper').append("<img class='js-lazy-image' data-src='" + imageUrl + "' width='" + width + "' height='" + height + "'>");
            });

            $('.js-loader').addClass('hide');
            $('.js-images-wrapper').removeClass('hide');

            images = document.querySelectorAll('.js-lazy-image');
            observer = new IntersectionObserver(onIntersection, config);
            images.forEach(image => {
                observer.observe(image);
            });
        }
    });




    window.addEventListener('resize', function(){
        if (window.innerWidth <= 800 && config.rootMargin === "650px 0px") {
            window.location.reload();
        } else if (window.innerWidth > 800 && config.rootMargin === "350px 0px") {
            window.location.reload();
        }
    });



































});
