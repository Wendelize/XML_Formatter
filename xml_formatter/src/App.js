import { useState } from "react"

const emptyTag = ""
const PEOPLE_TAG = "people"
const PERSON_TAG = "person"
const TELEPHONE_TAG = "telephone"
const ADDRESS_TAG = "address"
const FAMILY_TAG = "family"

function App() {
    const [input, setInput] = useState("P | förnamn | efternamn \nT | mobilnummer | fastnätsnummer \nT | mobilnummer | fastnätsnummer \nA | gata | stad | postnummer \nF | namn | födelseår \nP | förnamn | efternamn \nA | gata | stad | postnummer ")
    const [output, setOutput] = useState("OUTPUT")

    return (
        <div>
            <textarea
                value={input}
                onChange={(e) => {
                    setInput(e.target.value)
                }}
                multiple
                style={{ height: "400px", width: "400px" }}//={{ height: `${Math.sin(input.length / 30) * 200 + 500}px`, width: "800px", transform: `rotate(${input.length*10}deg)`, transition: "all 0.3s ease-out" }}
            />
            <button
                onClick={() => formatButton(input, setOutput)}
                style={{ height: "60px", width:"100px"}}
            >
                Format
            </button>
            <textarea
                value={output}
                multiple
                style={{ height: "400px", width: "400px" }}
            />
        </div>
    )
}

function formatButton(input, setOutput) {
    fetch("http://localhost:8000/")
        .then(res => res.json())
        .then(data => console.log(data))

    fetch("http://localhost:8000/",
        {
            method: "POST",
            body: JSON.stringify({ input:input }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        })
        .then(res => res.json())
        .then(result => setOutput(formatJsonToXml(JSON.parse(result))))
}

function formatJsonToXml(json) {
    let result = StartTag(PEOPLE_TAG)
    console.log("LENGTH JSON : ", json.length)
    console.log(json)
    result+=recursiveOutputType(json, result)

    result += EndTag(PEOPLE_TAG)
    return result;
}

function recursiveOutputType(objectArray) {
    let result = "";
    console.log(result)
    objectArray.forEach(obj => {
        result += StartTag(obj.type)
        Object.entries(obj).forEach(([key, value]) => {
            if (key !== "type" && typeof key === "string") {
                if (key === "includedInfoList" && value.length > 0) {
                    result+=recursiveOutputType(obj[key], result);
                    console.log("RECURSIVE")
                }
                result += OutputTag(key, value)
            }
        })
        result += EndTag(obj.type)
    })
    return result;
}

// 1.FOR EVERY OBJ WE HAVE A NEW PERSON
// 

function formatPersonToXml(element) {
    console.log(element.type)
    let result = ""

    switch (element.type) {
        case "Person":
            result += StartTag(PERSON_TAG)
            result += EndTag(PERSON_TAG)
            break
        case "Telephone":
            result += StartTag(TELEPHONE_TAG)
            result += EndTag(TELEPHONE_TAG)
            break
        case "Address":
            result += StartTag(ADDRESS_TAG)
            result += EndTag(ADDRESS_TAG)
            break
        case "Family":
            result += StartTag(FAMILY_TAG)
            result += EndTag(FAMILY_TAG)
            break
        default:
            console.log("[formatInfoToXML] UNDEFINED ELEMENT")
            break
    }
    return result
}

function StartTag(tag) {
    return `<${tag}>`
}

function EndTag(tag) {
    return `</${tag}>`
}

function OutputTag(key,value) {
    return `<${key}>${value}</${key}>`
}
function Indentation() {
    return "    "
}

export default App
