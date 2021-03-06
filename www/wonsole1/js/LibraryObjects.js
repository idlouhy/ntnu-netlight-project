/**Library object containing a list of all books in the system.*/
function Library() {
    var self    = this;
    this.list   = [];
    this.selectAll = false;
    
    var highlightedBook = null;
    
    /*Should be set to the number of books to be removed before calling the private removeBookAtIndex function.*/
    var removeCount = 0;
    
    this.isHighlighted = isHighlighted;
    /**Check if a book is highlighted*/
    function isHighlighted(book) {
        return (highlightedBook == book);
    }
    
    this.highlight = highlight;
    /**Highlight a book, or null*/
    function highlight(book) {
        highlightedBook = book;
        LIB.generateHTML();
        var loc;
        loc = document.getElementById("BOOKID");
        loc.value = book==null?"":book.id;
        loc = document.getElementById("BOOKTITLE");
        loc.value = book==null?"":book.title;
        loc = document.getElementById("BOOKAUTHOR");
        loc.value = book==null?"":book.author;
        loc = document.getElementById("EDITBOOK");
        loc.disabled = book==null?"disabled":"";

    }
    
    this.removeSelected = removeSelected ;
    /**remove all books that are selected in the visible list, will update the web UI.*/
    function removeSelected () {
        $.blockUI();
        if(removeCount !== 0)
            alert("removeCount must be 0 here!");
        for(var c = 0; c<self.list.length; c++) {
            if(self.list[c].select) {
                removeCount ++;
            }
        }
        for(c=0; c<self.list.length; c++) {
            if(self.list[c].select) {
                removeBookAtIndex(c);
                c--;
            }
        }
        self.selectAll = false;
    }
    this.listBooks = listBooks;
    /*List all books in console*/
    function listBooks() {
        for(var i = 0; i<self.list.length; i++)
            println(self.list[i]);
        return "OK";
    }
    
    this.removeBookByID = removeBookByID;
    /*remove a book with the given ID*/
    function removeBookByID(_id) {
        for(var i = 0; i<self.list.length; i++) {
            if(self.list[i].id == _id) {
                $.blockUI();
                removeCount = 1;
                var removedBook = self.list[i];
                removeBookAtIndex(i);
                return "Removed: " + removedBook ;
            }
        }
        return "No such book";
    }

    this.selectAllToggleConsole = selectAllToggleConsole;
    /**Calls selectAllToggle from the console*/
    function selectAllToggleConsole() {
        go("LIB.selectAllToggle()");
    }

    this.selectAllToggle = selectAllToggle;
    /**Toggle select all books currently in the visible list. Will update the web UI.*/
    function selectAllToggle() {
        self.selectAll = !self.selectAll;
        for(var c = 0; c<self.list.length; c++) {
            self.list[c].select = self.selectAll;
        }
        self.generateHTML();
    }
    
    this.getIndexByID = getIndexByID;
    /**Returns a single Book instance with the given ID, or null if there is none.*/
    function getIndexByID(id) {
        for(var c = 0; c<self.list.length; c++) {
            if(self.list[c].id == id)
                return c;
        }
        return -1;
    }

    this.getBookByID = getBookByID;
    /**Returns a single Book instance with the given ID, or null if there is none.*/
    function getBookByID(id) {
        for(var c = 0; c<self.list.length; c++) {
            if(self.list[c].id == id)
                return self.list[c];
        }
        return null;
    }
    
    this.query = query;
    function query() {
        var result = [];
        
        for(var c = 0; c<self.list.length; c++) {
            var success = true;
            for(var d = 0; d<arguments.length && success; d+=2) {
                if(typeof arguments[d+1] == "string") {
                    if(self.list[c][arguments[d]].search(arguments[d+1]) == -1)
                        success = false;
                }
                else {
                    if(self.list[c][arguments[d]] != arguments[d+1])
                        success = false;
                }
            }
            if(success)
                result.push(self.list[c]);
        }
        return result;
    }
    
    this.generateHTML = generateHTML;
    /**Generate list elements for all books in the system, at the "BOOKTABLE" element in the HTML document.*/
    function generateHTML() {
        var row, cell, tab, tbo, loc;
        
        tab=document.createElement("table");
        tab.setAttribute("id","bookTable");
        tab.setAttribute("border","1px solid black");

        tbo=document.createElement('tbody');
        
        row = document.createElement('tr');
        cell = document.createElement('td');
        cell.innerHTML = "<input type='checkbox' id='SELECTALL' onclick = 'LIB.selectAllToggleConsole();'" + (self.selectAll ? "checked" : "") + ">";
        row.appendChild(cell);
        cell = document.createElement('td');
        cell.innerHTML = "ID";
        row.appendChild(cell);
        cell = document.createElement('td');
        cell.innerHTML = "Title";
        row.appendChild(cell);
        cell = document.createElement('td');
        cell.innerHTML = "Author";
        row.appendChild(cell);
        row.setAttribute("class","headRow");
        tbo.appendChild(row);
        
        for(c=0; c<self.list.length; c++) {
            row = self.list[c].generateHTML();
            var str;
            if(self.list[c]==highlightedBook)
                str = "highlightedRow";
            else if((c%2)==0)
                str = "evenRow";
            else
                str = "oddRow";
            row.setAttribute("class",str);
            tbo.appendChild(row);
        }
        if(self.list.length === 0) {
            row = document.createElement('tr');
            cell = document.createElement('td');
            cell.innerHTML = "No books to list yet";
            cell.setAttribute("colspan","4");
            row.appendChild(cell);
            row.setAttribute("class","evenRow");
            tbo.appendChild(row);
            
        }
        tab.appendChild(tbo);
        tab.setAttribute("class","libraryTable");
        loc = document.getElementById('BOOKTABLE');
        loc.innerHTML = "";
        loc.appendChild(tab);
    }
    
    /*Private function to remove a book. Does not lock the UI by itself.
     *removeCount should be set to the total number of books to be removed in this batch, before this is called.
     *When this has been called removeCount times and the books have been removed, the UI is unblocked and the UI is updated.*/
    var removeBookAtIndex = function(index) {
        /*Remove book from local storage immediately. If this is ever changed, remove button loop must also be changed!*/
        var removedBook = self.list[index];
        if(removedBook == highlightedBook)
            highlight(null);

	//function to get the class name from object
	function getObjectClass(obj) {
		if (obj && obj.constructor && obj.constructor.toString) {
			var arr = obj.constructor.toString().match(/function\s*(\w+)/);
			if (arr && arr.length == 2) {
				return arr[1];
			}
		}
		return undefined;
	}
	//go through variables and find out the references
	for (var i in window) {
		if (getObjectClass(window[i]) == "Book") {
			if (window[i] === removedBook) {
				//i object removed due to references
				println("Referencing object "+i+" removed.")
				delete window[i];
			}
		}
	}

        self.list.splice(index,1);
        $.ajax({
            type: "DELETE",
            url: "http://netlight.dlouho.net:9004/api/books/"+removedBook.id,
            success: function(response) {
               removeCount--;
               /*Check if all books that should be removed have been removed now.*/
               if(removeCount === 0) {
                   self.generateHTML();
                   $.unblockUI();
               }
            },
            dataType: "text"
        });
    };

    this.retrieveObjects = retrieveObjects;
    /*This function retrieves all objects from the server and updates the web UI. Will lock the UI until objects have been received.*/
    function retrieveObjects() {
        $.blockUI();
        for (var i = 0; i < self.list.length; i++) {
            self.list[i].deleted = true;
        }
        $.getJSON("http://netlight.dlouho.net:9004/api/books" ,function (data) {
            for (var i = 0; i < data.length; i++) {
                var book = searchForId(data[i]._id);
                if (book == null) {
                    new Book(data[i].title, data[i].author, data[i]._id);
                }
                else {
                    book.title = data[i].title;
                    book.author = data[i].author;
                }
            }
            for (var i = 0; i < self.list.length; i++) {
                if (self.list[i].deleted)
                    self.list.splice(i, 1);
            }
            generateHTML();
            $.unblockUI();
        });
    }

    this.autoCompleteVals = autoCompleteVals;
    function autoCompleteVals() {
        return { "listBooks()":"Prints a list of all books",
                "query()":"Return an array of books where the variables match their respective values. Regex is supported"};
    }

    this.searchForId = searchForId;
    /**Searches for a specific id in the list of books */
    function searchForId(id) {
        for (var i = 0; i < self.list.length; i++) {
            if (id == self.list[i].id) {
                self.list[i].deleted = false;
                return self.list[i];
            }
        }
        return null;
    }

}
var LIB = new Library();
function initLibrary() {
    LIB.highlight(null);
    LIB.retrieveObjects();
    }

/**Book object containing information about a single book and add it to the list of Books.
  *If id is null, the object will be sent to the server, and the id will be returned. This will block the UI and then update it.
  *id should be null when using this from the console or web UI.*/
function Book(title, author, id) {
    var self    = this;
    this.title   = title;
    this.author = author;
    this.id = id;
    this.deleted = false;
    
    this.select = false;
    this.checkbox = null;
    
    this.highlight = highlight;
    /**Highlight the Book and open it for editing in the UI.*/
    function highlight() {
        LIB.highlight(self);
    }
    this.highlight();
    
    this.saveUpdate = saveUpdate;
    /*Update the book on the server, blocking/unblocking and updating the UI in the process.*/
    function saveUpdate() {
        $.blockUI();
        $.ajax({
            type: "PUT",
            url: "http://netlight.dlouho.net:9004/api/books/"+self.id,
            data: self.toJSON(),
            success: function(response) {
               self.generateHTML();
               $.unblockUI();
            },
            dataType: "json"
        });
        
    }

    this.changeAuthorConsole = changeAuthorConsole;
    /**Calls changeAuthor() from the console*/
    function changeAuthorConsole(newAuthor) {
        if (newAuthor != self.author) {
            var index = LIB.list.indexOf(self);
            go("LIB.list[" + index + "].changeAuthor(\"" + newAuthor + "\")");
        }
    }

    this.changeAuthor = changeAuthor;
    /**Change the author of the book. Will update the web UI.*/
    function changeAuthor(newAuthor) {
        self.author = newAuthor;
        self.saveUpdate();
    }
    
    this.toJSON = toJSON;
    /*Generate a JSON object from this Book.*/
    function toJSON() {
        return { _id:self.id, title: self.title, author: self.author};
    }

    this.changeTitleConsole = changeTitleConsole;
    /**Calls changeTitle() from the console*/
    function changeTitleConsole(newTitle) {
        if (newTitle != self.title) {
            var index = LIB.list.indexOf(self);
            go("LIB.list[" + index + "].changeTitle(\"" + newTitle + "\")");
        }
    }

    this.changeTitle = changeTitle;
    /**Change the name of the book. Will update the web UI.*/
    function changeTitle(newTitle) {
            self.title = newTitle;
            self.saveUpdate();
    }

    this.toggleSelectConsole = toggleSelectConsole;
    /**Use the toggleSelect() from the console*/
    function toggleSelectConsole() {
        var index = LIB.list.indexOf(self);
        go("LIB.list[" + index + "].toggleSelect()");
    }

    this.toggleSelect = toggleSelect;
    /**Toggle whether this book is selected. Will make sure the value of the checkbox is correct, if it exists.*/
    function toggleSelect() {
        self.select = !self.select;
        if (self.checkbox !== null && self.checkbox.checked != self.select) {
            self.checkbox.checked = self.select;
        }
    }
    
    this.remove = remove;
    /*Remove this book from the system. Will update database and UI.*/
    function remove() {
        LIB.removeBookByID(self.id);
    }


    this.generateHTML = generateHTML;
    /**Generate HTML element(s) for this book.
      *@return The string for the HTML element. Should return a table row. Row style will be overridden.*/
    function generateHTML() {
        var row, cell, input;
        row = document.createElement("tr");
        
        cell = document.createElement("td");
        input = document.createElement("input");
        self.checkbox = input;
        input .type = "checkbox";
        input.id = "SELECT_"+self.id;
        input.checked = self.select;
        input.onchange = self.toggleSelectConsole;
        cell.appendChild(input );
        row.appendChild(cell);
        
        cell = document.createElement("td");
        var link = document.createElement("a");
        link.setAttribute("href","JavaScript:void(0);");
        link.innerHTML = self.id;
        cell.onclick = function() {_in.value = "LIB.list["+LIB.getIndexByID(self.id)+"]"; self.highlight(); return false;};
        cell.appendChild(link);
        row.appendChild(cell);
        
        cell = document.createElement("td");
        input = document.createElement("input");
        input.type = "text";
        input.id = "TITLE_"+self.id;
        input.value = self.title;
        input.onchange = function(){self.changeTitleConsole(this.value);};
        cell.appendChild(input );
        row.appendChild(cell);
        
        cell = document.createElement("td");
        input = document.createElement("input");
        input.type = "text";
        input.id = "AUTHOR_"+self.id;
        input.value = self.author;
        input.onchange = function(){self.changeAuthorConsole(this.value);};
        cell.appendChild(input );
        row.appendChild(cell);

        return row;
    }
    
    /*Add the book to the list*/
    LIB.list.push(this);
    
    /*Send the book to the server and retrieve id if none was supplied.*/
    if(id==null) {
        $.blockUI();
        $.ajax({
            type: "POST",
            url: "http://netlight.dlouho.net:9004/api/books",
            data: self.toJSON(),
            success: function(response){
                //Add book to local storage
                self.id = response._id;
                LIB.generateHTML();
                $.unblockUI();
            },
            dataType: "json"
        });
    }

    this.autoCompleteVals = autoCompleteVals;
    function autoCompleteVals() {
        return { "changeAuthor()":"changeAuthor the author",
                "changeTitle()":"change the title",
                "remove()":"remove the book from the library" };
    }
}
Book.prototype.toString = function(){
    return "[object Book <"+this.id+", "+this.title+", "+this.author+">]";
};
