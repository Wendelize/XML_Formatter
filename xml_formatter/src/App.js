import { useState } from "react"

const PEOPLE_TAG = "people"

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
    setOutput("")
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
    let result = StartTag(PEOPLE_TAG) + "\n"
    result += recursivePrettifyOutput(json, 1)
    result += EndTag(PEOPLE_TAG)
    return result;
}

function recursivePrettifyOutput(objectArray, indentations) {
    let result = "";
    console.log(result)
    objectArray.forEach(obj => {
        result += Indentation(indentations) + StartTag(obj.type) + "\n"
        indentations++    
        Object.entries(obj).forEach(([key, value]) => {
            if (key !== "type" && typeof key === "string") {
                if (key === "includedInfoList") {
                    result += recursivePrettifyOutput(obj[key], indentations);
                }
                else {
                    result += Indentation(indentations) + OutputTag(key, value) + "\n"
                }
            }
        })
        indentations--
        result += Indentation(indentations) + EndTag(obj.type) + "\n"
    })
    return result;
}

function StartTag(tag) {

    console.log("StartTag : ", tag)
    return `<${tag}>`
}

function EndTag(tag) {
    console.log("EndTag : ", tag)
    return `</${tag}>`
}

function OutputTag(key, value) {
    console.log("OutputTag : ", key)
    return `<${key}>${value}</${key}>`
}

function Indentation(nrOf) {
    let indentations = ""
    for (let i = 0; i < nrOf; i++)
        indentations += "   "
    return indentations
}

export default App
