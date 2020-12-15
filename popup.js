
document.addEventListener("DOMContentLoaded", function () {

    let template = '';
    chrome.runtime.sendMessage("hello!", function (response) {
        for (line in response) {
            template += `
        <tr>
        <td>${response[line].operator}</td>
        <td>${response[line].query}</td>
        <td>${response[line].param}</td>
        <td>${response[line].info}</td>
        </tr>
        
        `
        }


        document.getElementById("tdata").innerHTML = template
    });

});

