// Admin Number: HOOIWEIJIE_24040351

// Class: LibraryBook
class LibraryBook {
    constructor(title, author, ISBN) {
        this.title = title;
        this.author = author;
        this.ISBN = ISBN;
        this.isAvailable = true;
        this.borrowerName = null;
    }

    borrowBook(borrowerName) {
        if (!this.isAvailable) {
            console.log("-------------------------------");
            console.log(`Book '${this.title}' is currently unavailable.`);
            console.log("-------------------------------");
        } else {
            this.isAvailable = false;
            this.borrowerName = borrowerName;
            console.log("-------------------------------");
            console.log(`Book '${this.title}' has been borrowed by ${this.borrowerName}.`);
            console.log("-------------------------------");
        }
    }

    returnBook() {
        if (this.isAvailable) {
            console.log("-------------------------------");
            console.log(`Book '${this.title}' is already available.`);
            console.log("-------------------------------");
        } else {
            this.isAvailable = true;
            this.borrowerName = null;
            console.log(`Book '${this.title}' has been returned.`);
            console.log("-------------------------------");
        }
    }

    getDetails() {
        console.log(`Title: ${this.title}`);
        console.log(`Author: ${this.author}`);
        console.log(`ISBN: ${this.ISBN}`);
        console.log(`Available: ${this.isAvailable}`);
        if (!this.isAvailable) {
            console.log(`Borrowed by: ${this.borrowerName}`);
        }
    }
}

const book1 = new LibraryBook("The Great Gatsby", "F. Scott Fitzgerald", "9780743273565");
const book2 = new LibraryBook("1984", "George Orwell", "9780451524935");

// Book 1 test
book1.getDetails();
book1.borrowBook("Alice");
book1.getDetails();
book1.borrowBook("Bob");  
book1.returnBook();
book1.getDetails();

// Book 2 test
book2.getDetails();
book2.borrowBook("Eve");
book2.getDetails();
book2.borrowBook("Dan"); 
book2.returnBook();
book2.getDetails();
