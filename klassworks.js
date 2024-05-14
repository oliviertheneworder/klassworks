// if #add-to-quote is clicked
$('#add-to-quote').click(function() {
    var product = $('#product').text();
    // for each .material-wrapper get the .material-heading text and the selected radio button's value.
    // if .quote-stack is visible, append a new .quote-item containing a div.quote-details with .quote-product from the product variable and .quote-materials with the text and value from the radio buttons.
    $('.material-wrapper').each(function() {
        var material = $(this).find('.material-heading').text();
        var selected = $(this).find('input[type="radio"]:checked').val();
        $('.quote-stack').append('<div class="quote-item"><div class="quote-details"><div class="quote-product">' + product + '</div><div class="quote-materials">' + material + ' - ' + selected + '</div></div><div class="input-number"><button class="button-increment minus">-</button><input class="input-field input-number" type="number" placeholder="1"><button class="button-increment plus">+</button></div><div class="quote-remove w-embed"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"></path></svg></div></div>');
    });
});
