(function () {
    var DELIMITER = ',';
    var NEWLINE = '\n';
    var qRegex = /^"|"$/g;
    var i = document.getElementById('file');
    var table = document.getElementById('table');
    var addButton = document.getElementById('addButton');
    // addButton.addEventListener('click', addDataToCSV);

    if (!i) {
        return;
    }

    i.addEventListener('change', function () {
        if (!!i.files && i.files.length > 0) {
            parseCSV(i.files[0]);
        }
    });

    function parseCSV(file) {
        if (!file || !FileReader) {
            return;
        }

        var reader = new FileReader();

        reader.onload = function (e) {
            toTable(e.target.result);
        };

        reader.readAsText(file);
    }

    function toTable(text) {
        if (!text || !table) {
            return;
        }

        // clear table
        while (!!table.lastElementChild) {
            table.removeChild(table.lastElementChild);
        }

        var rows = text.split(NEWLINE);
        var headers = rows.shift().trim().split(DELIMITER);
        var htr = document.createElement('tr');

        headers.forEach(function (h) {
            var th = document.createElement('th');
            var ht = h.trim();

            if (!ht) {
                return;
            }

            th.textContent = ht.replace(qRegex, '');
            htr.appendChild(th);
        });

        table.appendChild(htr);

        var rtr;

        rows.forEach(function (r) {
            r = r.trim();

            if (!r) {
                return;
            }

            var cols = r.split(DELIMITER);

            if (cols.length === 0) {
                return;
            }

            rtr = document.createElement('tr');

            cols.forEach(function (c) {
                var td = document.createElement('td');
                var tc = c.trim();

                td.textContent = tc.replace(qRegex, '');
                rtr.appendChild(td);
            });

            table.appendChild(rtr);
        });
        addButton.addEventListener('click', addDataToCSV);
        function addDataToCSV() {
            var userInput = document.getElementById('userInput').value.trim();
            if (!userInput) {
              return;
            }
            
            // Split user input by comma (delimiter)
            var newData = userInput.split(DELIMITER);
            
            // Create a new table row (tr) element
            var newRow = document.createElement('tr');
            
            // Add each data point from user input to a table cell (td) element
            newData.forEach(function (data) {
              var cell = document.createElement('td');
              cell.textContent = data.trim().replace(qRegex, '');
              newRow.appendChild(cell);
            });
            
            // Append the new row to the table
            table.appendChild(newRow);
            
            // Clear the user input field
            document.getElementById('userInput').value = "";
          }
    }
})();