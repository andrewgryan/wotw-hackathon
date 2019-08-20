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
            JSON.parse(responseText).collections.forEach((collection) => {
                let option = document.createElement("option")
                option.value = collection.id
                option.innerHTML = collection.id
                collectionSelect.appendChild(option)
            })
        })
        collectionSelect.onchange = function(event) {
            collectionID = event.target.value
            let url = `http://labs.metoffice.gov.uk/wotw/collections/${collectionID}?outputFormat=application%2Fjson`
            getRequest(url, function(responseText) {
                instanceSelect.innerHTML = ""
                JSON.parse(responseText).instances.forEach((instance) => {
                    let option = document.createElement("option")
                    option.value = instance.id
                    option.innerHTML = instance.id
                    instanceSelect.appendChild(option)
                })
            })
        }
        instanceSelect.onchange = function(event) {
            instanceID = event.target.value
            let url = `http://labs.metoffice.gov.uk/wotw/collections/${collectionID}/${instanceID}?outputFormat=application%2Fjson`
            getRequest(url, function(responseText) {
                console.log(JSON.parse(responseText))
                responseDiv.innerHTML = responseText
            })
        }
    }
    return ns
})();
