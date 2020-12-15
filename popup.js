
document.addEventListener("DOMContentLoaded", function () {

    let template = '';
    chrome.runtime.sendMessage("hello!", function ({patternObject,defaultOperator,errors}) {

        // alert(JSON.stringify(errors))

        template += `
        <tr>
        <td>${defaultOperator}r</td>
        <td>null</td>
        <td style="max-width: 20px;">null</td>
        <td>*special* resets all parameters</td>
        </tr>
        
        `
        for (line in patternObject) {
            template += `
        <tr>
        <td>${defaultOperator}${patternObject[line].operator}</td>
        <td>${patternObject[line].query}</td>
        <td style="max-width: 20px;">${patternObject[line].param}</td>
        <td>${patternObject[line].info}</td>
        </tr>
        
        `
        }


        document.getElementById("tdata").innerHTML = template
    });

});

