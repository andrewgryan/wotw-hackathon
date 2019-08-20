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
        let select = document.createElement("select")
        let instanceSelect = document.createElement("select")
        url = "http://labs.metoffice.gov.uk/wotw/collections?outputFormat=application%2Fjson"
        getRequest(url, function(responseText) {
            JSON.parse(responseText).collections.forEach((collection) => {
                let option = document.createElement("option")
                option.value = collection.id
                option.innerHTML = collection.id
                select.appendChild(option)
            })
        })
        document.body.appendChild(select)
        document.body.appendChild(instanceSelect)
        select.onchange = function(event) {
            let collectionID = event.target.value
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


        let queryDiv = document.getElementById("query")
        let div = document.getElementById("response")
        url = "http://labs.metoffice.gov.uk/wotw/collections?outputFormat=application%2Fjson"

        let ul = document.createElement('ul')
        let visit = function(url) {
            let li = document.createElement('li')
            li.innerHTML = url
            ul.appendChild(li)
        }
        queryDiv.appendChild(ul)

        visit(url)
        getRequest(url, function(responseText) {
            let jsonResponse = JSON.parse(responseText);
            let ukv = jsonResponse.collections.filter(function(collection) {
                return collection.id == "ukv_deterministic_surface_239"
            });
            let url = ukv[0].links[0].href;
            visit(url)
            getRequest(url, function(responseText) {
                let instances = JSON.parse(responseText).instances
                let latest = instances.filter((instance) => instance.id == 'latest');
                let url = latest[0].links[0].href;
                visit(url)
                getRequest(url, function(responseText) {
                    let obj = JSON.parse(responseText)
                    let links = obj.collection.links.filter((l) => l.type == 'polygon')
                    let url = links[0].href;
                    visit(url)
                    getRequest(url, function(responseText) {
                        console.log(responseText)
                    })
                })
            })
        })
    }
    return ns
})();
