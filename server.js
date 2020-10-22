const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 8080;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.get("/", function (req, res) { //main page route
    res.sendFile(path.join(__dirname, "./public/index.html"));
});
app.get("/notes", function (req, res) { // notes page route
    res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("/api/notes", (req, res) => { // read the db.json and display the content
    const parsedNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    res.json(parsedNotes);
});


app.post("/api/notes", (req, res) => {
    var newNote = req.body;
    if (newNote.title=="" || newNote.text==""){ // if either title or body is missing, warn user and not proceed
        alert("Please fill in both title and body.");
        return
    } else {
        // new id = first char and last char of title + 2 digit number + first char and last char of main text
        newNote.id = newNote.title.charAt(0) + newNote.title.charAt(newNote.title.length-1) + Math.floor(Math.random() * 100) + newNote.text.charAt(0) + newNote.text.charAt(newNote.text.length-1);

        let noteArray = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
        noteArray.push(newNote); // add new note to array
        fs.writeFileSync("./db/db.json", JSON.stringify(noteArray), "utf8");  // write array back into db.json
        res.json(noteArray);
    }
});

app.delete("/api/notes/:id", (req, res) => {
    const { id } = req.params;

    let noteArray = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));

    for (let i = 0; i < noteArray.length; i++) {
        if (noteArray[i].id === id) { // search for a mathing id
            noteArray.splice(i, 1); // delete the mathing note
            break;
        }
    }
    fs.writeFileSync("./db/db.json", JSON.stringify(noteArray), "utf8");
    res.json(noteArray);
});

app.listen(PORT, () => console.log("App listening on PORT: " + PORT)); // listener for server