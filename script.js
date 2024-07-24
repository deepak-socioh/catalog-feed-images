
let allcolumns = ['g:id', 'g:item_group_id', 'g:title', 'g:description', 'g:product_type', 'g:link', 'quantity_to_sell_on_facebook', 'g:inventory', 'g:image_link', 'g:condition', 'g:availability', 'g:brand', 'g:mpn', 'g:shipping_weight', 'g:size', 'g:google_product_category', 'g:sale_price', 'g:price', 'g:color'];
//create a div with checkboxes for each elements in allcolumns
var checkboxContainerDiv = document.createElement('div');
checkboxContainerDiv.classList.add('checkbox-group');
allcolumns.forEach(function (col) {
    var checkbox = document.createElement('input');
    let checkboxDiv = document.createElement('div');
    checkbox.type = 'checkbox';
    checkbox.id = col;
    checkbox.value = col;
    //make checkbox selected by default
    checkbox.checked = true;
    checkboxDiv.classList.add('single-checkbox');
    checkboxDiv.appendChild(checkbox);
    var label = document.createElement('label');
    label.htmlFor = col;
    label.appendChild(document.createTextNode(col));
    checkboxDiv.appendChild(label);
    checkboxContainerDiv.appendChild(checkboxDiv);
});

// add checkboxDiv to the div with class csv-options-message
document.querySelector('.csv-options-message').appendChild(checkboxContainerDiv);
// checkboxContainerDiv.style.display = 'none'; 

var groupingAvailable = false;


//hide the spinner
document.getElementById('spinner').style.display = 'none';
// hide filtersDiv
document.getElementById('filtersDiv').style.display = 'none';
window.selectedAction = 'actionOption1';
//add an event listener to radio buttons
document.querySelectorAll('input[type=radio]').forEach(function (radio) {
    radio.addEventListener('change', function () {
        window.selectedAction = this.id;
        if (this.id == 'actionOption2') {
            document.querySelector('.csv-options-message').style.display = 'block';
            // document.querySelector('.csv-options-message').innerHTML = 'Please note that the CSV will contain the following fields: ' + allcolumns.join(', ');
        } else {
            document.querySelector('.csv-options-message').style.display = 'none';
        }
    });
});

// Add an event listener to the form
document.getElementById('urlForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the default form submission
    document.querySelector('.count').textContent = "";
    // hide filtersDiv 
    document.getElementById('filtersDiv').style.display = 'none';
    //empty search input
    document.getElementById('searchInput').value = "";
    //set value of custom-select to 0
    document.querySelector('.custom-select').value = 0;
    var urlInput = document.getElementById('urlInput');
    var urlValue = urlInput.value.trim();

    // Simple URL validation
    var urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?(\?.*)?(#.*)?\.xml$/;
    groupingAvailable = false;
    if (!urlValue) {
        urlInput.classList.add('is-invalid');
        urlInput.nextElementSibling.textContent = 'URL field cannot be empty.';
    }
    // else if (!urlPattern.test(urlValue)) {
    //     urlInput.classList.add('is-invalid');
    //     urlInput.nextElementSibling.textContent = 'Please enter a valid xml URL';
    // } 
    else {
        urlInput.classList.remove('is-invalid');
        urlInput.classList.add('is-valid');
        //empty the content of div with id images
        document.getElementById('images').innerHTML = "";
        urlInput.nextElementSibling.textContent = "";
        loadXMLDoc(urlValue)
        // alert('URL is valid: ' + urlValue);
        // Further processing can be done here
    }
});

function loadImages(xml) {
    let i;
    let xmlDoc = xml.responseXML;
    var duplicates = [];
    var all = [];
    let x = xmlDoc.getElementsByTagName("item");
    console.log("--total items", x);
    if (x.length == 0) {
        alert('No data found. Please check the url.');
        return;
    }
    // add the value of x in count div
    document.querySelector('.count').textContent = `Total items: ${x.length}`;
    // // Start to fetch the data by using TagName 
    var highest = 0;
    var container = document.getElementById("images");
    for (i = 0; i < x.length; i++) {
        var item = x[i];
        var img = item.getElementsByTagName("g:image_link");
        var id = item.getElementsByTagName("g:id")[0].innerHTML;
        var titlecontainer = item.getElementsByTagName("g:title");
        if (titlecontainer && titlecontainer[0] && titlecontainer[0].innerHTML) {
            var title = titlecontainer[0].innerHTML;
        } else {
            var title = "";
        }
        var item_group_id = item.getElementsByTagName("g:item_group_id");
        if (item_group_id && item_group_id[0] && item_group_id[0].innerHTML) {
            var item_group_id = item_group_id[0].innerHTML;
            groupingAvailable = true;
        } else {
            var item_group_id = "";
        }
        if (img && img[0] && img[0].innerHTML) {
            var src = img[0].innerHTML;
            let divContainer = document.createElement('div');
            let text = document.createElement('div');
            text.textContent = "Exid " + " - " + id;
            text.classList.add("text");
            divContainer.appendChild(text);

            let imgelem = document.createElement('img');
            imgelem.src = src;
            divContainer.classList.add("item-single");

            divContainer.appendChild(imgelem);
            let text2 = document.createElement('div');
            text2.textContent = title;
            text2.classList.add("title");
            divContainer.appendChild(text2);

            let text3 = document.createElement('div');
            text3.textContent = "Groupid " + " - " +item_group_id;
            text3.classList.add("groupId");
            //hide text3
            text3.style.display = 'none';
            divContainer.appendChild(text3);
            //set id of divContainer to id of the product
            divContainer.id = id;
            container.appendChild(divContainer);
        }
    }
    // show filtersDiv
    document.getElementById('filtersDiv').style.display = 'flex';

    console.log("--groupingAvailable", groupingAvailable);
    //hide custom-sellect if grouping is not available
    if (!groupingAvailable) {
        document.querySelector('.btn-group').style.display = 'none';
    } else {
        document.querySelector('.btn-group').style.display = 'inline-flex';
    }

}

function loadXMLDoc(urlValue) {
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {

        if (this.readyState == 4) {
            // show the button with id sub-button
            document.getElementById('sub-button').style.display = 'inline-block';

            //hide the spinner
            document.getElementById('spinner').style.display = 'none';

            //enable radios, checkboxes and url input
            document.querySelectorAll('input[type=radio]').forEach(function (radio) {
                radio.disabled = false;
            });
            document.querySelectorAll('.single-checkbox input').forEach(function (checkbox) {
                checkbox.disabled = false;
            });
            document.getElementById('urlInput').disabled = false;

            if (this.status == 200) {
                if (window.selectedAction == 'actionOption1') {
                    loadImages(this);
                } else {
                    downloadCSV(this);
                }
            } else {
                alert('No data found. Please check the url.');
            }

        }

    };

    //hide the button with id sub-button
    document.getElementById('sub-button').style.display = 'none';

    //show the spinner
    document.getElementById('spinner').style.display = 'inline-block';

    //disable all checkboxes
    document.querySelectorAll('.single-checkbox input').forEach(function (checkbox) {
        checkbox.disabled = true;
    });

    //disable all radio buttons
    document.querySelectorAll('input[type=radio]').forEach(function (radio) {
        radio.disabled = true;
    });

    //disable the url input
    document.getElementById('urlInput').disabled = true;

    xmlhttp.open("GET", urlValue, true);
    xmlhttp.send();
}

function fileName() {
    //return name as todays full date
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();
    var hh = today.getHours();
    var min = today.getMinutes();
    var sec = today.getSeconds();
    var ms = today.getMilliseconds();
    if (dd < 10) {
        dd = '0' + dd
    }
    if (mm < 10) {
        mm = '0' + mm
    }
    if (hh < 10) {
        hh = '0' + hh
    }
    if (min < 10) {
        min = '0' + min
    }
    if (sec < 10) {
        sec = '0' + sec
    }
    return yyyy + '-' + mm + '-' + dd + ':' + hh + ':' + min;

}

function downloadCSV(xml) {
    let i;
    let xmlDoc = xml.responseXML;

    let x = xmlDoc.getElementsByTagName("item");
    console.log("--total items", x.length)
    var highest = 0;
    //add fields that you want to include in csv

    var finalCSVData = [];
    let selectedColumns = [];
    document.querySelectorAll('.single-checkbox input').forEach(function (checkbox) {
        if (checkbox.checked) {
            selectedColumns.push(checkbox.value);
        }
    });
    finalCSVData.push(selectedColumns);
    for (i = 0; i < x.length; i++) {
        var item = x[i];
        var itemData = [];
        selectedColumns.forEach(function (col) {
            var value = "--";
            if (item.getElementsByTagName(col) && item.getElementsByTagName(col)[0] && item.getElementsByTagName(col)[0].childNodes && item.getElementsByTagName(col)[0].childNodes[0] && item.getElementsByTagName(col)[0].childNodes[0].nodeValue) {
                value = item.getElementsByTagName(col)[0].childNodes[0].nodeValue;

            }
            itemData.push('"' + value + '"');
        });
        finalCSVData.push(itemData);
    }
    console.log("--finalCSVData", finalCSVData);
    let name = "meta_feed_" + fileName() + ".csv";
    console.log("--name", name);

    let csvContent = "data:text/csv;charset=utf-8,";
    console.log("csvContent", csvContent);
    finalCSVData.forEach(function (rowArray) {
        let row = rowArray.join(",");
        csvContent += row + "\r\n";
    });
    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);

    link.setAttribute("download", name);
    document.body.appendChild(link);

    link.click();
}

function filterItemsBySearchInput(){
    var searchInput = document.getElementById('searchInput');
    var searchValue = searchInput.value.trim();
    var allItems = document.querySelectorAll('.item-single');
    if (!searchValue) {
        allItems.forEach(function (item) {
            item.style.display = 'inline-block';
        });
        document.querySelector('.count').textContent = `Total items: ${allItems.length}`;
    } else {
        var count = 0;
        allItems.forEach(function (item) {
            var title = item.querySelector('.title').textContent;
            var id = item.querySelector('.text').textContent;
            if ((title.toLowerCase().includes(searchValue.toLowerCase())) || (id.toLowerCase().includes(searchValue.toLowerCase()))) {
                count++;
                item.style.display = 'inline-block';
            } else {
                item.style.display = 'none';
            }
        });
        if (count == 0) {
            document.querySelector('.count').textContent = `No items match the search criteria`;
        } else {
            document.querySelector('.count').textContent = `${count} out of ${allItems.length} items match the search criteria`;
        }
    }
}


function filterItems(){
    var allItems = document.querySelectorAll('.item-single');
    var selectValue = document.querySelector('.custom-select').value;
    var searchInput = document.getElementById('searchInput');
    var searchValue = searchInput.value.trim();
    console.log("--selectValue", selectValue);
    console.log("--searchValue", searchValue);
    var groupIdMap = {};
    var allGroupMap = {};
    if (selectValue == 0 && !searchValue) {
        allItems.forEach(function (item) {
            item.style.display = 'inline-block';
        });
        document.querySelector('.count').textContent = `Total items: ${allItems.length}`;
    } else {
        var count = 0;
        var allGrouped = 0;
        allItems.forEach(function (item) {
            var groupId = item.querySelector('.groupId').textContent;
            var title = item.querySelector('.title').textContent;
            var id = item.querySelector('.text').textContent;
            var allowed = true;
            if(!allGroupMap[groupId]){
                allGrouped++;
                allGroupMap[groupId] = true;
            }
            if(!groupIdMap[groupId]){
                groupIdMap[groupId] = 0;
            }
            if (searchValue && searchValue.length > 0 && 
                !(title.toLowerCase().includes(searchValue.toLowerCase())) && !(id.toLowerCase().includes(searchValue.toLowerCase()))) {
                allowed = false;
            } else if(selectValue > 0 && groupIdMap[groupId]){
                groupIdMap[groupId]++;
                allowed = false;
            }

            
            if (allowed) {
                count++;
                if(selectValue > 0){
                    
                    groupIdMap[groupId]++;;
                }
                item.style.display = 'inline-block';
            } else {
                
                item.style.display = 'none';
            }
        });
        if (count == 0) {
            document.querySelector('.count').textContent = `No items match the selected filters`;
        } else {
            if(!selectValue || selectValue == 0){
                document.querySelector('.count').textContent = `${count} out of ${allItems.length} items match the selected filters`;
            } else {
                if(searchValue && searchValue.length > 0 ){
                    document.querySelector('.count').textContent = `${count} out of ${allGrouped} products `;
                } else {
                    document.querySelector('.count').textContent = `${count} products ( Variations ${allItems.length} )`;
                }
            }
            
        }
        console.log("--groupIdMap", groupIdMap);
    }

}

//add an event listener to the search form 
document.getElementById('searchInput').addEventListener('keyup', function (event) {
    event.preventDefault(); // Prevent the default form submission
    filterItems();
});

// add an event listener on change of custom-select
document.querySelector('.custom-select').addEventListener('change', function (event) {
    event.preventDefault(); // Prevent the default form submission
    filterItems();
   
});


