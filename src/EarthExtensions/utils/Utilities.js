var Utilities = {
    get_random_color: function() {
        var letters = '0123456789ABCDEF'.split('');
        var color = '0x';
        for (var i = 0; i < 6; i++ ) {
            color += letters[Math.round(Math.random() * 15)];
        }
        return color;
    }
}; 


