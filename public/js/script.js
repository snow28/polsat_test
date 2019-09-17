$(document).ready(function() {

    const mobileBreakpoint = 800;

    // CONFIGURATION FOR OBSERVER FUNCTIONS TO CHANGE RADIUS IN WHICH WE WILL PRELOAD IMAGES
    let config;
    if (window.innerWidth <= mobileBreakpoint) {
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

    let images = {}; // here we will store images from server
    let observer;
    const requestUrl = "http://localhost:3000/getData"; // url where we will request images
    let allowPreload = true;  // we will use thi variable

    function preloadImage(target){ // this function will force loading the image by adding value to src attr
        if (allowPreload) {
            const src = $(target).data('src');
            $(target).attr('src' , src);
        }
    }

    function onIntersection(entries) { // this function will be called when image will be inside the range we specified in config
        // Loop through the entries
        entries.forEach(entry => {
            if (entry.intersectionRatio > 0) { // check if visible
                // Stop watching and load the image
                observer.unobserve(entry.target);
                preloadImage(entry.target);
            }
        });
    }

    function blockPreload() {  // this function called when user scroll and will block loading the images which
        // user see during the scrolling
        // --------
        // --------

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
               let index;
               // index will identify which size of image to take, also we will reload screen on the breakpoint we will set here
                if ( window.innerWidth <= mobileBreakpoint ) {
                    index = 6;
                } else {
                    index = 3;
                }
                const width = item.thumbnails[index].size.width;
                const height = item.thumbnails[index].size.height;
                const imageUrl = item.thumbnails[index].src;
                // pushing image element
                $('.js-images-wrapper').append("<img class='js-lazy-image' data-src='" + imageUrl + "' width='" + width + "' height='" + height + "'>");
            });

            setTimeout(function(){
                // hide loader and show images
                $('.js-loader').addClass('hide');
                $('.js-images-wrapper').removeClass('hide');
            },700);

            images = document.querySelectorAll('.js-lazy-image'); // select all needed images to add observer then
            observer = new IntersectionObserver(onIntersection, config);
            // assign observer to each image which will we called when image will be inside range of view we specified
            // in config
            // ---------
            images.forEach(image => { // addong observer to each image
                observer.observe(image);
            });
        }
    });



    // here when event resize say that user resize the screen we check if we have proper config for images sizes
    window.addEventListener('resize', function(){
        if (window.innerWidth <= mobileBreakpoint && config.rootMargin === "650px 0px") {
            window.location.reload();
        } else if (window.innerWidth > mobileBreakpoint && config.rootMargin === "350px 0px") {
            window.location.reload();
        }
    });



































});
