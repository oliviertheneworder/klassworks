// Hide product dimensions if required elements are not visible

// Check if all elements are not visible
var ids = ['#depth', '#width', '#height', '#seat-depth', '#seat-width', '#seat-height']; // Replace with your actual IDs
// Function to check if all elements are not visible
function checkAndHide() {
    var allHidden = ids.every(function (id) {
        return $(id).css('display') === 'none';
    });
    if (allHidden) {
        $('#product-dimensions-text').css('display', 'none');
    }
}
// Call the function to perform the check and hide if necessary
checkAndHide();

// Accolades text manipulation

var accoladesTextParts = [];

// Check each attribute and push the corresponding text to the array in the order of Certifications, Guarantees, Awards
if ($('[data-certification]').length > 0) {
    accoladesTextParts.push("Certifications");
}
if ($('[data-guarantees]').length > 0) {
    accoladesTextParts.push("Guarantees");
}
if ($('[data-awards]').length > 0) {
    accoladesTextParts.push("Awards");
}
// Determine how to join the text parts based on how many there are
var accoladesText = "";
if (accoladesTextParts.length === 3) {
    // Join the first two with a comma, and the last one with an "&"
    accoladesText = accoladesTextParts.slice(0, 2).join(", ") + " & " + accoladesTextParts[2];
} else if (accoladesTextParts.length === 2) {
    // Join with "&" if there are exactly two
    accoladesText = accoladesTextParts.join(" & ");
} else if (accoladesTextParts.length === 1) {
    // Just use the single item if there's only one
    accoladesText = accoladesTextParts[0];
}
// Update the #accolades text if there are any relevant elements
if (accoladesText) {
    $('#accolades').text(accoladesText);
}
// if there are no accolades, hide the accolades section
if (accoladesTextParts.length === 0) {
    $('#accolades-block').hide();
}

// Hide Gallery if no images are present
// if ($('.product-gallery').find('.empty-state').length > 0) {
//     $(this).hide();
// }

$('template').remove(); // remove all template elements
$('#quote-basket').css('display', 'none'); // hide the quote basket initially

$(document).ready(function () {

    // QUOTEING SYSTEM

    // Function to save the quote stack to localStorage
    function saveQuoteStack() {
        // Update all input values in the DOM before saving
        $('.input-number input.input-number').each(function () {
            var inputVal = $(this).val();
            $(this).attr('value', inputVal);
        });

        var quoteStackHtml = $('.quote-stack').html();
        localStorage.setItem('quoteStack', quoteStackHtml);

        // show .quote-count and update text equal to the number of items in the quote stack
        var quoteCount = $('.quote-stack .quote-item').length;
        $('.quote-count').text(quoteCount).css('display', 'flex');

        // if stack is empty, hide the quote basket
        if (quoteStackHtml === '') {
            $('#quote-basket').css('display', 'none');
            $('.quote-count').css('display', 'none');
        }
    }

    // Function to load the quote stack from localStorage
    function loadQuoteStack() {
        var savedQuoteStack = localStorage.getItem('quoteStack');
        if (savedQuoteStack) {
            $('.quote-stack').html(savedQuoteStack);
            attachEventHandlers();
            // console.log('Quote stack loaded:', savedQuoteStack);
            $('#quote-basket').css('display', 'flex');
            // show .quote-count and update text equal to the number of items in the quote stack
            var quoteCount = $('.quote-stack .quote-item').length;
            $('.quote-count').text(quoteCount).css('display', 'flex');

        } else {
            // if page url is / ; /professionals ; /about then hide the quote basket
            var url = window.location.pathname;
            if (url === '/' || url === '/home-2' || url === '/professionals' || url === '/about' || url === '/performance-seating' || url === '/delegation-seating' || url === '/multipurpose') {
                $('#nav-quote-button').css('display', 'none');
                $('.quote-count').css('display', 'none');
            }
        }
    }

    // Attach event handlers to increment, decrement, and remove buttons
    function attachEventHandlers() {
        $('.quote-remove').off('click').on('click', function () {
            $(this).closest('.quote-item').remove();
            saveQuoteStack();
            loadQuoteStack();
            // console.log('Item removed');
            // if stack is empty, hide nav-quote-button

        });

        $('.button-increment').off('click').on('click', function () {
            var input = $(this).siblings('input.input-number');
            var currentValue = parseInt(input.val());

            if ($(this).hasClass('plus')) {
                input.val(currentValue + 1);
                // console.log('Incremented:', currentValue + 1);
            } else if ($(this).hasClass('minus')) {
                if (currentValue > 1) {
                    input.val(currentValue - 1);
                    // console.log('Decremented:', currentValue - 1);
                }
            }

            // Save the quote stack to localStorage
            saveQuoteStack();
        });
    }

    // Load the quote stack when the page loads
    loadQuoteStack();

    // Event handler for the Add to Quote button
    $('#add-to-quote').click(function () {

        var product = $('#product').text();
        var materials = [];
        var options = [];

        // Validate that all visible material-wrapper elements have a selected radio button
        var allMaterialsSelected = true;
        $('.material-wrapper:visible').each(function () {
            if ($(this).find('input[type="radio"]:checked').length === 0) {
                allMaterialsSelected = false;
                $(this).addClass('material-error'); // Optionally, add a class to highlight the error
            } else {
                $(this).removeClass('material-error'); // Remove the error class if it was added before
            }
        });

        if (!allMaterialsSelected) {
            alert('Please select an option for all materials.');
            // prevent default action of linking to anchor tag
            preventDefault();
            return; // Prevent adding the quote item
        } else {
            $('#quote-basket').css('display', 'flex');
        }

        // Collect all selected options for materials
        $('.material-wrapper').each(function () {
            var material = $(this).find('.material-heading').text();
            var selected = $(this).find('input[type="radio"]:checked').val();
            if (selected) {
                materials.push(material + ' ' + selected);
            }
        });

        // Collect all selected options from checkboxes
        $('.options-wrapper .w-dyn-item').each(function () {
            var option = $(this).find('span.checkbox-label').text();
            var selected = $(this).find('input[type="checkbox"]:checked').length > 0 ? 'Yes' : 'No';
            if (selected === 'Yes') {
                options.push(option);
            }
        });

        // Join all selected options into a single string
        var materialString = materials.join(' – ');
        var optionString = options.join(' + ');

        // Prepend " + " if optionString has content
        if (optionString) {
            optionString = ' + ' + optionString;
        }

        // Check if quote-item content already exists in the quote stack
        var itemExists = false;
        var urlProduct = window.location.href; // get the current page url
        $('.quote-item').each(function () {
            var existingProduct = $(this).find('.quote-product').text();
            var existingMaterials = $(this).find('.quote-materials').text();
            if (existingProduct === product && existingMaterials === materialString + optionString) {
                itemExists = true;
                return false; // Break the loop
            }
        });

        if (itemExists) {
            alert('This quote item already exists in your quote basket.');
            return; // Prevent adding the duplicate quote item
        }

        // Append a single quote-item to the .quote-stack
        $('.quote-stack').append('<div class="quote-item"><div class="quote-details"><a href="' + urlProduct + '" class="quote-product">' + product + '</a><div class="quote-materials">' + materialString + optionString + '</div></div><div class="input-number"><button class="button-increment minus">-</button><input class="input-field input-number" type="number" value="1" min="1"><button class="button-increment plus">+</button></div><div class="quote-remove w-embed"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"></path></svg></div></div>');

        // Save the quote stack to localStorage
        saveQuoteStack();

        // Attach event handlers to the new quote item
        attachEventHandlers();
        // console.log('Item added:', product, materials, options);
    });

    // Handle form submission
    $('#quote-form').submit(function () {
        // Serialize the quote stack into JSON
        var quoteItems = [];
        $('.quote-item').each(function () {
            var product = $(this).find('.quote-product').text();
            var materials = $(this).find('.quote-materials').text();
            var quantity = $(this).find('input.input-number').val();
            quoteItems.push({
                product: product,
                materials: materials,
                quantity: quantity
            });
        });

        var quoteDataJson = JSON.stringify(quoteItems);
        $('#quote-data').val(quoteDataJson);
        // console.log('Form submitted with data:', quoteDataJson);

        // Reset form after submission
        setTimeout(function () {
            // clear the quote stack from localStorage after form submission
            localStorage.removeItem('quoteStack');
            $('.quote-stack').empty();
            // Reset form components
            $('.success-message').css('display', 'none');
            $('#quote-form').css('display', 'flex');
            $('#quote-basket').css('display', 'none');
            $('#quote-form').trigger('reset');
            grecaptcha.reset();
        }, 5000);

    });

    // for each .material-radio-button input, check if the value is 'white', 'custom', or 'polished aluminium' and change the svg fill color
    var lightValues = ['white', 'custom', 'polished aluminium', 'bonded leather white', 'genuine leather white'];

    $('.material-radio-button input').each(function () {
        var value = $(this).val().toLowerCase();
        if (lightValues.includes(value)) {
            $(this).closest('.material-radio-button').find('svg').attr('fill', 'rgba(0,0,0,0.75)');
        }
    });

    // Function to update gallery thumb
    // function updateGalleryThumb() {
    //     var firstImgSrc = $('.product-gallery img.gallery-img:first').attr('src');
    //     $('.product-gallery .gallery-thumb').attr('src', firstImgSrc);
    // }

    // Function to check if the product gallery has images and handle visibility
    // function handleProductGallery() {
    //     if ($('.product-gallery img.gallery-img').length > 0) {
    //         if ($('.product-gallery').is(':visible')) {
    //             updateGalleryThumb();
    //         }
    //     } else {
    //         $('.product-gallery').hide();
    //     }
    // }

    // handleProductGallery();

    // Hide .product-configure if .vactary-wrapper and .dimensions-img-wrapper are not visible
    if (!$('.vactary-wrapper').is(':visible') && !$('.dimensions-img-wrapper').is(':visible')) {
        $('.product-configure').hide();
    }

    // Hide features block if empty
    if ($("#features-block .w-dyn-empty").length) {
        $("#features-block").hide();

        // Move .product-gallery to .product-features and adjust styles
        // $(".product-gallery").appendTo(".product-features").css({
        //     "display": "block",
        //     "padding": "0"
        // });

        // $(".button.gallery, .gallery-trigger").css({
        //     "aspect-ratio": "auto",
        //     "width": "100%",
        //     "height": "100%"
        // });

    }

    // Hide features block if empty
    if ($("#options-block .w-dyn-empty").length) {
        $("#options-block").hide();

        // Move .product-gallery to .product-features and adjust styles
        // $(".product-gallery").appendTo(".product-features").css({
        //     "display": "block",
        //     "padding": "0"
        // });

        // $(".button.gallery, .gallery-trigger").css({
        //     "aspect-ratio": "auto",
        //     "width": "100%",
        //     "height": "100%"
        // });

    }

    // Hide downloads block if all links are invisible
    if ($("#downloads-list .downloads-link.w-condition-invisible").length === $("#downloads-list .downloads-link").length) {

        $("#downloads-block").hide();

        // Move .product-gallery to .product-features and adjust styles
        // $(".product-gallery").appendTo(".product-features").css({
        //     "display": "block",
        //     "padding": "0"
        // });

        // $(".button.gallery, .gallery-trigger").css({
        //     "aspect-ratio": "auto",
        //     "width": "100%",
        //     "height": "100%"
        // });

        // handleProductGallery();
    }

    // if .w-dyn-empty then hide it's parent
    $('.w-dyn-empty').each(function () {
        $(this).parent().hide();
    });

    // .gallery-grid-list has odd number of children and more than 4 childern, then hide the last child
    if ($('.gallery-grid-list').children().length % 2 !== 0 && $('.gallery-grid-list').children().length > 4) {
        $('.gallery-grid-list').children().last().hide();
    }

    // if .product-extras has no direct childern that are visible then hide .product-extras
    if ($('.product-extras').children(':visible').length === 0) {
        $('.product-extras').hide();
    }

    // if url contains /performance-seating, /visitor-conference-meeting, /multipurpose then change the anchor link of #nav-quote-button to #quote-request
    var url = window.location.pathname;
    if (url.includes('/performance-seating') || url.includes('/visitor-conference-meeting') || url.includes('/multipurpose')) {
        $('#nav-quote-button').attr('href', '#quote-request');
        console.log('URL contains:', url);
    }
    
}); // end of document ready
