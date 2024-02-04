const express = require('express')
var bodyParser = require('body-parser')
const cors = require('cors');
const app = express()
const port = 8000

app.use(cors())

app.get('/', (req, res) => {
    res.json({
        text: "HELLO SERVER!"
    })
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

app.post('/', bodyParser.json(), (req, res) => {
    console.log(req.body)
    res.json(transformInputToPeople(req.body.input))
})

// ========= TYPES ==========


class Telephone {
    type = "telephone";
    constructor(telephoneLine) {
        this.mobile = telephoneLine.length > 1 ? telephoneLine[1] : ""
        this.landline = telephoneLine.length > 2 ? telephoneLine[2] : ""
    }
}

class Address {
    type = "address";
    constructor(addressLine) {
        this.street = addressLine.length > 1 ? addressLine[1] : ""
        this.city = addressLine.length > 2 ? addressLine[2] : ""
        this.zipcode = addressLine.length > 3 ? addressLine[3] : ""
    }
}

class Person {
    type = "person"

    constructor(personLine) {
        this.firstname = personLine.length > 1 ? personLine[1] : ""
        this.surname = personLine.length > 2 ? personLine[2] : ""
        this.includedInfoList = []
    }

    addTelephone(telephone) {
        if (this.includedInfoList.some(e => e.type === telephone.type)) {
            console.log("[Person.addTelephone] TELEPHONE ALREADY EXIST FOR THIS PERSON")
            return
        }
        this.includedInfoList.push(telephone)
    }

    addAddress(address) {
        if (this.includedInfoList.some(e => e.type === address.type)) {
            console.log("[Person.addAddress] ADDRESS ALREADY EXIST FOR THIS PERSON")
            return
        }
        this.includedInfoList.push(address)
    }

    addFamilyMember(familyMember) {
        this.includedInfoList.push(familyMember)
    }
}

class FamilyMember {
    type = "family"
    constructor(familyLine) {
        this.includedInfoList = []
        this.name = familyLine.length > 1 ? familyLine[1] : ""
        this.born = familyLine.length > 2 ? familyLine[2] : ""
    }

    addTelephone(telephone) {
        if (this.includedInfoList.some(e => e.type === telephone.type)) {
            console.log("[FamilyMember.addTelephone] TELEPHONE ALREADY EXIST FOR THIS PERSON")
            return
        }
        this.includedInfoList.push(telephone)
    }

    addAddress(address) {
        if (this.includedInfoList.some(e => e.type === address.type)) {
            console.log("[FamilyMember.addAddress] ADDRESS ALREADY EXIST FOR THIS PERSON")
            return
        }
        this.includedInfoList.push(address)
    }
}


// ========= MY SHIT ==============
function transformInputToPeople(input) {
    let lines = getLines(input)
    let arrayOfPeople = getPeopleArray(lines)
    return JSON.stringify(arrayOfPeople)
}

function getLines(input) {
    return input.split("\n")
}

function getPeopleArray(lines) {
    let person = undefined
    let familyMember = undefined
    let arrayOfPeople = []

    for (let i = 0, n = lines.length; i < n; i++) {
        let line = lines[i]
        let allWordsInLine = line.split('|')
        switch (line.charAt(0)) {
            case 'P':
                if (familyMember) {
                    person.addFamilyMember(familyMember)
                    familyMember = undefined
                }
                if (person) {
                    arrayOfPeople.push(person)
                }
                person = new Person(allWordsInLine)
                continue
            case 'T':
                if (!person) continue
                if (familyMember) {
                    familyMember.addTelephone(new Telephone(allWordsInLine))
                    continue
                }
                person.addTelephone(new Telephone(allWordsInLine))
                continue
            case 'A':
                if (!person) continue
                if (familyMember) {
                    familyMember.addAddress(new Address(allWordsInLine))
                    continue
                }
                person.addAddress(new Address(allWordsInLine))
                continue
            case 'F':
                if (!person) continue
                if (familyMember) {
                    person.addFamilyMember(familyMember)
                }
                familyMember = new FamilyMember(allWordsInLine)
                continue
            default:
                console.log("[newAdd] UNDEFINED CHARACTER")
                break;
        };
    }
    if (familyMember) { person.addElement(familyMember) }
    if (person) { arrayOfPeople.push(person) }
    return arrayOfPeople;
}

