// A simple weather on the web API scraper
wotw = (function() {
    let ns = {}
    let getRequest = function(url, callback) {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", url)
        xhr.onreadystatechange = function() {
            if ((xhr.readyState == 4) && (xhr.status == 200)) {
                callback(xhr.responseText)
            }
        }
        xhr.send()
    }

    let setOptions = function(el, values) {
        el.innerHTML = ""
        values.forEach(function(value) {
            let option = document.createElement("option")
            option.value = value
            option.innerHTML = value
            el.appendChild(option)
        })
    }

    ns.main = function() {
        let collectionID = null;
        let instanceID = null;
        let collectionSelect = document.createElement("select")
        let instanceSelect = document.createElement("select")
        let navDiv = document.getElementById("nav")
        let responseDiv = document.getElementById("response")
        navDiv.appendChild(collectionSelect)
        navDiv.appendChild(instanceSelect)
        url = "http://labs.metoffice.gov.uk/wotw/collections?outputFormat=application%2Fjson"
        getRequest(url, function(responseText) {
            let values = JSON.parse(responseText).collections.map((c) => c.id)
            setOptions(collectionSelect, values)
        })
        collectionSelect.onchange = function(event) {
            collectionID = event.target.value
            let url = `http://labs.metoffice.gov.uk/wotw/collections/${collectionID}?outputFormat=application%2Fjson`
            getRequest(url, function(responseText) {
                let values = JSON.parse(responseText).instances.map((i) => i.id)
                setOptions(instanceSelect, values)
            })
        }
        instanceSelect.onchange = function(event) {
            instanceID = event.target.value
            let url = `http://labs.metoffice.gov.uk/wotw/collections/${collectionID}/${instanceID}?outputFormat=application%2Fjson`
            getRequest(url, function(responseText) {
                console.log(JSON.parse(responseText).collection.parameters)
                responseDiv.innerHTML = responseText
            })
        }
    }
    return ns
})();
