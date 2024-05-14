$('#add-to-quote').click(function() {
    var product = $('#product').text();
    var materials = [];

    // Collect all selected options
    $('.material-wrapper').each(function() {
        var material = $(this).find('.material-heading').text();
        var selected = $(this).find('input[type="radio"]:checked').val();
        if (selected) {
            materials.push(material + ' - ' + selected);
        }
    });

    // Collect all selected options from checkboxes
    $('.option-wrapper').each(function() {
        var option = $(this).find('label').text();
        var selected = $(this).find('input[type="checkbox"]:checked').length > 0 ? 'Yes' : 'No';
        if (selected === 'Yes') {
            materials.push(option);
        }
    });

    // Join all selected options into a single string
    var materialString = materials.join(' + ');

    // Append a single quote-item to the .quote-stack
    $('.quote-stack').append('<div class="quote-item"><div class="quote-details"><div class="quote-product">' + product + '</div><div class="quote-materials">' + materialString + '</div></div><div class="input-number"><button class="button-increment minus">-</button><input class="input-field input-number" type="number" value="1"><button class="button-increment plus">+</button></div><div class="quote-remove w-embed"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"></path></svg></div></div>');
});
$('.quote-remove').click(function() {
    $(this).closest('.quote-item').remove();
}