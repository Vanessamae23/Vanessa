$("#circles").click(function() {
    $("#circles").css("display", "none")

    $("#circles").before('<iframe class="video" width="512" height="315" src="https://www.youtube.com/embed/VGNSVfytyT8" allowfullscreen></iframe>')
})

$("#speed").click(function() {
    $("#speed").css("display", "none")

    $("#speed").before('<iframe class="video" width="512" height="315" src="https://www.youtube.com/embed/LeImkWUPH_E" allowfullscreen></iframe>')
})