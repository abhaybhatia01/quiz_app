    export function shuffle(array) {
        let currentIndex = array.length,  randomIndex
        while (currentIndex != 0) {
            // Pick a remaining element.
            randomIndex = Math.floor(Math.random() * currentIndex)
            currentIndex--
            // And swap it with the current element.
            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]]
        }
    return array
    }

    export function decodeHtml(html) {
        const txt = document.createElement("textarea")
        txt.innerHTML = html
        return txt.value
    }