import { useState } from "react"

const PEOPLE_TAG = "people"

function App() {
    const [input, setInput] = useState("P | förnamn | efternamn \nT | mobilnummer | fastnätsnummer \nT | mobilnummer | fastnätsnummer \nA | gata | stad | postnummer \nF | namn | födelseår \nP | förnamn | efternamn \nA | gata | stad | postnummer ")
    const [output, setOutput] = useState("")

    const onFileUpload = (event) => {
        const file = event.target.files[0]
        if (file && file.type === "text/plain") {
            const reader = new FileReader()
            reader.onload = (e) => { setInput(e.target.result) }
            reader.readAsText(file)
        } else {
            alert("[onFileUploaded] UNKNOWN FILE TYPE")
        }
    }

    const onDownload = () => {
        const blob = new Blob([output], { type: "text/xml" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = "AwesomeOutput.xml"
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }

    return (
        <div>
            <input type="file" accept=".txt" onChange={ onFileUpload }/>
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
                FORMAT
            </button>
            <textarea
                value={output}
                multiple
                style={{ height: "400px", width: "400px" }}
            />
            <button
                onClick={onDownload}
                style={{ height: "60px", width: "100px" }}
            >
                DOWNLOAD FILE
            </button>
        </div>
    )
}

function formatButton(input, setOutput) {
    setOutput("")
    fetch("http://localhost:8000/")
        .then(result => result.json())
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
        .then(result => result.json())
        .then(result => setOutput(formatJsonToXml(JSON.parse(result))))
}

function formatJsonToXml(json) {
    let xmlFormat = StartTag(PEOPLE_TAG) + "\n"
    xmlFormat += recursivePrettifyOutput(json, 1)
    xmlFormat += EndTag(PEOPLE_TAG)
    return xmlFormat
}

function recursivePrettifyOutput(objectArray, indentations) {
    let result = ""
    console.log(result)
    objectArray.forEach(obj => {
        result += Indentation(indentations) + StartTag(obj.type) + "\n"
        indentations++    
        Object.entries(obj).forEach(([key, value]) => {
            if (key !== "type" && typeof key === "string") {
                if (key === "includedInfoList") {
                    result += recursivePrettifyOutput(obj[key], indentations)
                }
                else {

                    result += value===""? "" : (Indentation(indentations) + OutputTag(key, value) + "\n")
                }
            }
        })
        indentations--
        result += Indentation(indentations) + EndTag(obj.type) + "\n"
    })
    return result
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
