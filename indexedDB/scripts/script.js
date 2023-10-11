﻿//<reference path="jquery-3.1.1.min.js" />

window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction;
window.IDBCursor = window.IDBCursor || window.webkitIDBCursor;

$(document).ready(function () {
    contactsNamespace.initialize();
});

(function () {
    this.contactsNamespace = this.contactsNamespace || {};
    var ns = this.contactsNamespace;
    var currentRecord;
    var db;

    ns.initialize = function () {
        $("#btnSave").on('click', ns.save);
        var request = indexedDB.open("myDB_R53", 1);

        request.onupgradeneeded = function (response) {
            var options = { keypath: "id", autoIncrement: true };
            response.currentTarget.result.createObjectStore("contacts", options);
        }
        request.onsuccess = function (response) {
            db = request.result;
            ns.display();
        }
    }

    ns.display = function () {
        $("#currentAction").html('Add Contact');
        currentRecord = { key: null, contact: {} };
        displayCurrentRecord();

        var trans = db.transaction('contacts', 'readonly');
        var request = trans.objectStore("contacts").openCursor();
        var results = [];

        request.onsuccess = function (response) {
            var cursor = response.target.result;
            if (!cursor) {
                bindToGrid(results);
                return;
            }
            results.push({ key: cursor.key, contact: cursor.value });
            cursor.continue();
        }
    }

    function bindToGrid(results) {
        var html = "";
        for (var i = 0; i < results.length; i++) {
            var key = results[i].key;
            var contact = results[i].contact;

            html += '<tr><td>' + contact.email + '</td>';
            html += '<td>' + contact.firstName + ' ' + contact.lastName + '</td>';
            html += '<td><a class="edit" href="javascript:void(0)" data-key=' + key + '>Edit</a></td></tr>';
        }
        html = html || '<tr><td colspan="3">No Records Available!!!</td></tr>'
        $("#contacts tbody").html(html);
        $('#contacts a.edit').on('click', ns.loadContact);
    }

    ns.loadContact = function () {
        var key = parseInt($(this).attr('data-key'));
        var trans = db.transaction('contacts', 'readonly');
        var store = trans.objectStore("contacts");
        var request = store.get(key);

        request.onsuccess = function (response) {
            $("#currentAction").html('Edit Contact');
            currentRecord = { key: key, contact: response.target.result }
            displayCurrentRecord();
        }
    }

    function displayCurrentRecord() {
        var contact = currentRecord.contact;
        $("#firstName").val(contact.firstName);
        $("#lastName").val(contact.lastName);
        $("#email").val(contact.email);
        $("#phoneNumber").val(contact.phoneNumber);
    }

    ns.save = function () {
        var contact = currentRecord.contact;
        contact.firstName = $("#firstName").val();
        contact.lastName = $("#lastName").val();
        contact.email = $("#email").val();
        contact.phoneNumber = $("#phoneNumber").val();

        var trans = db.transaction('contacts', 'readwrite');
        var contacts = trans.objectStore("contacts");
        var request = currentRecord.key != null
            ? contacts.put(contact, currentRecord.key)
            : contacts.add(contact);

        request.onsuccess = function (response) {
            ns.display();
        }
    }

})();

