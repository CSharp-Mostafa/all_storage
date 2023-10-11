/// <reference path="jquery-3.1.1.min.js" />

// Database Create/Open
var db = openDatabase('contacts', '1.0', 'MyContactsApp', 2 * 1024 * 1024)


// Initialize Database
db.transaction(function (trans) {
    trans.executeSql('CREATE TABLE IF NOT EXISTS contacts(id integer primary key autoincrement,firstname, lastname, phonenumber)');
});

// Add Contact Info
function addContact() {
    var inputFirstName = document.getElementById("firstName").value;
    var inputLastName = document.getElementById("lastName").value;
    var inputPhoneNumber = document.getElementById("phoneNumber").value;
    if (inputFirstName !== "" && inputLastName !== "" && inputPhoneNumber !== "") {
        db.transaction(function (trans) {
            trans.executeSql('INSERT INTO contacts(firstname, lastname, phonenumber) VALUES(?,?,?)', [inputFirstName, inputLastName, inputPhoneNumber], function (trans, results) {
                // Create Row and Cells
                var contactRow = document.createElement("tr");
                var id = document.createElement("td");
                var firstName = document.createElement("td");
                var lastName = document.createElement("td");
                var phoneNumber = document.createElement("td");
                var updateButton = document.createElement("td");
                var removeButton = document.createElement("td");

                // Set the value
                id.textContent = results.insertId;
                firstName.textContent = inputFirstName;
                lastName.textContent = inputLastName;
                phoneNumber.textContent = inputPhoneNumber;
                updateButton.innerHTML = '<button onclick="updateContact(' + results.insertId + ')"' + '>Update</button>';
                removeButton.innerHTML = '<button onclick="removeContact(' + results.insertId + ')"' + '>Delete</button>';

                // Add td to Row
                contactRow.setAttribute("id", "c" + results.insertId);
                contactRow.appendChild(id);
                contactRow.appendChild(firstName);
                contactRow.appendChild(lastName);
                contactRow.appendChild(phoneNumber);
                contactRow.appendChild(updateButton);
                contactRow.appendChild(removeButton);

                // Add Row to Table
                document.getElementById("contacts").appendChild(contactRow);
            })
        })
    }
    else {
        alert("Please provide the all values......")
    }
}


// Update Contact Info
function updateContact(id) {
    var inputFirstName = document.getElementById("firstName").value;
    var inputLastName = document.getElementById("lastName").value;
    var inputPhoneNumber = document.getElementById("phoneNumber").value;

    db.transaction(function (trans) {
        trans.executeSql('SELECT * FROM contacts WHERE id=?', [id], function (trans, results) {
            var contact = results.rows.item(0);
            document.getElementById('id').value = contact.id;
            document.getElementById('firstName').value = contact.firstName;
            document.getElementById('lastName').value = contact.lastName;
            document.getElementById('phoneNumber').value = contact.phoneNumber;
        });
    });

}


// Save Update Contact Info
function save() {
    var inputFirstName = document.getElementById("firstName").value;
    var inputLastName = document.getElementById("lastName").value;
    var inputPhoneNumber = document.getElementById("phoneNumber").value;
    if (inputFirstName !== "" && inputLastName !== "" && inputPhoneNumber !== "") {
        db.transaction(function (trans) {
            var id = document.getElementById('id').value;
            var fName = document.getElementById('firstName').value;
            var lName = document.getElementById('lastName').value;
            var pNum = document.getElementById('phoneNumber').value;

            trans.executeSql('UPDATE contacts SET firstname=?, lastname=?, phonenumber=? WHERE id=?', [fName, lName, pNum, id]);
        })
        alert("Record Updated Successfully.....")
    }
    else {
        alert("Please provide the all values......")
    }
}


// Delete Contact Info
function removeContact(id) {
    confirm('Are You Sure You Want To Delete???')
    db.transaction(function (trans) {
        trans.executeSql('DELETE FROM contacts WHERE id=?', [id], function () {
            var contactTable = document.getElementById("contacts");
            var contactToDelete = document.getElementById("c" + id);
            contactTable.removeChild(contactToDelete);
        });
    });
};


// Contact List
function listContact() {
    db.transaction(function (trans) {
        trans.executeSql('SELECT * FROM contacts', [], function (trans, results) {
            var len = results.rows.length;
            var i;
            for (i = 0; i < len; i++) {
                // Create Row & Cells
                var contactRow = document.createElement("tr");
                var id = document.createElement("td");
                var firstName = document.createElement("td");
                var lastName = document.createElement("td");
                var phoneNumber = document.createElement("td");
                var updateButton = document.createElement("td");
                var removeButton = document.createElement("td");

                // Set values
                id.textContent = results.rows.item(i).id;
                firstName.textContent = results.rows.item(i).firstName;
                lastName.textContent = results.rows.item(i).lastName;
                phoneNumber.textContent = results.rows.item(i).phoneNumber;
                updateButton.innerHTML = '<button onClick="updateContact(' + results.rows.item(i).id + ')"' + '>Update</button>';
                removeButton.innerHTML = '<button onClick="removeContact(' + results.rows.item(i).id + ')"' + '>Delete</button>';

                // Add Cell To Row
                contactRow.setAttribute("id", "c" + results.rows.item(i).id);
                contactRow.appendChild(id);
                contactRow.appendChild(firstName);
                contactRow.appendChild(lastName);
                contactRow.appendChild(phoneNumber);
                contactRow.appendChild(updateButton);
                contactRow.appendChild(removeButton);

                // Add Row to Table
                document.getElementById("contacts").appendChild(contactRow);
            }
        })
    })
};

//  Load atj Start-Up
window.addEventListener("load", listContact, true);

