//this autofocuses on the google search input so you can keep using your keyboard instead of mouse clicking on search

let searchBox = document.querySelector('[maxlength="2048"]')
if (searchBox != null) {
    searchBox.value += " "
    searchBox.focus()
    searchBox.value.trim()
}


