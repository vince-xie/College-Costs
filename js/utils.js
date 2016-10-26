function openMenu(){
    $(".menu").animate({'left': '0px'}, 300);
    $(".main").animate({'left': '350px'}, 300);
}

function closeMenu(){
    $(".menu").animate({'left': '-350px'}, 300);
    $(".main").animate({'left': '0px'}, 300);
}