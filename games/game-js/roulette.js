class Item {
    constructor(id, name, type, rarity){
        this.id = id;
        this.name = name;
        this.type = type;
        this.rarity = rarity;
    }
}
Item.GEM = 0;
Item.METAL = 1;

class Prize {
    constructor(item, rate, ultraprizes) {
        this.item = item
        this.rate = rate
        this.ultraprizes = ultraprizes
    }
}

class Roulette {
    constructor(prizelist=[]) {
        this.prizelist = prizelist;
        this.totalrate = 0;
        for (var prize in prizelist) {
            this.totalrate += prizelist[prize].rate;
        }
    }
    addPrize(prize) {
        this.prizelist.append(prize);
        this.totalrate += prize.rate;
    }
    removePrize(prize) {
        this.prizelist.splice(this.prizelist.indexOf(prize), 1);
        this.totalrate -= prize.rate;
    }
    spin() {
        if(this.prizelist.length != 0) {
            var target = Math.random() * this.totalrate;
            var sum = 0;
            for (var index in this.prizelist) {
                sum += this.prizelist[index].rate;
                if (sum > target) {
                    return this.prizelist[index].item;
                }
            }
            console.log("spin: ERROR: Target not found in roulette!");
            return null;
        } else {
            console.log("spin: No prizes in roulette!");
            return null;
        }
    }
    ultraspin(id) {
        if(this.prizelist.length != 0) {
            for (var index in this.prizelist) {
                if (this.prizelist[index].item.id == id) {
                    return this.prizelist[index].ultraprizes.spin();
                }
            }
            console.log("ultraspin: No this prize in roulette! " + id);
            return null;
        } else {
            console.log("ultraspin: No prizes in roulette!");
            return null;
        }
    }
    percentage(id) {
        if(this.prizelist.length != 0) {
            for (var index in this.prizelist) {
                if (this.prizelist[index].item.id == id) {
                    return this.prizelist[index].rate / this.totalrate;
                }
            }
            console.log("percentage: No this prize in roulette! " + id);
            return null;
        } else {
            console.log("percentage: No prizes in roulette!");
            return null;
        }
    }
    toTable() {
        var str = "<tr>" +
            "<th>Prize</th>" +
            "<th>Type</th>" +
            "<th>Rarity</th>" +
            "</tr>"
        for (var index in this.prizelist) {
            str = str.concat("<tr><td>" + this.prizelist[index].item.name + "</td><td>"
                + (this.prizelist[index].item.type == Item.GEM ? "Gem" : "")
                + (this.prizelist[index].item.type == Item.METAL ? "Metal" : "")
                + "</td><td>" + "$".repeat(this.prizelist[index].item.rarity) + "</td></tr>");
        }
        return str;
    }
}

var gems = {
    "100001": new Item(100001, "Ruby", Item.GEM, 5),
    "100002": new Item(100002, "Sapphire", Item.GEM, 5),
    "100003": new Item(100003, "Emerald", Item.GEM, 4)
}

var metals = {
    "200001": new Item(200001, "Gold", Item.METAL, 5),
    "200002": new Item(200002, "Silver", Item.METAL, 4),
    "200003": new Item(200003, "Copper", Item.METAL, 3),
    "200004": new Item(200004, "Iron", Item.METAL, 2),
    "200005": new Item(200005, "Tin", Item.METAL, 1),
    "200006": new Item(200006, "Platinum", Item.METAL, 5),
    "201001": new Item(201001, "Aluminum", Item.METAL, 3),
    "201002": new Item(201002, "Chromium", Item.METAL, 4),
    "201003": new Item(201003, "Titanium", Item.METAL, 4),
    "201004": new Item(201004, "Beryllium", Item.METAL, 2),
    "201005": new Item(201005, "Vanadium", Item.METAL, 5)
};

function getItemByID(id) {
    if (gems[id] != null) return gems[id];
    if (metals[id] != null) return metals[id];
    return null;
}

var roulette = new Roulette([
    new Prize(gems["100001"], 2, new Roulette([
        new Prize(metals["201001"], 12),
        new Prize(metals["201002"], 5)
    ])),
    new Prize(gems["100002"], 2, new Roulette([
        new Prize(metals["201001"], 10),
        new Prize(metals["200004"], 4),
        new Prize(metals["201003"], 1)
    ])),
    new Prize(gems["100003"], 3, new Roulette([
        new Prize(metals["201002"], 4),
        new Prize(metals["201004"], 8),
        new Prize(metals["201005"], 1)
    ])),
    new Prize(metals["200001"], 2),
    new Prize(metals["200002"], 4),
    new Prize(metals["200003"], 7),
    new Prize(metals["200004"], 15),
    new Prize(metals["200005"], 24)
]);

var results = [];

function spinRoulette() {
    var roulette_type = "Normal Roulette";
    var new_item = roulette.spin();
    if (new_item.type == Item.GEM && results.indexOf(new_item) >= 0) {
        roulette_type = "2nd-Chance Roulette of " + new_item.name;
        new_item = roulette.ultraspin(new_item.id);
    }
    if (new_item != null) {
        results.push(new_item);
    } else {
        console.log("spinRoulette: ERROR: Spin failed!");
    }
    return ("Got " + new_item.name + " from " + roulette_type + "!");
}

function dictGroupBy(array, prop){
    var items = {}, key;
    $.each(array, function(index, val) {
        key = val[prop];
        if (!items[key]) items[key] = []
        items[key].push(val);
    });
    return items;
}

function getResults() {
    // var groupArray = require('group-array');
    // gresults = groupBy(results, "id");

    gresults = dictGroupBy(results, "id");
    hresults = "<tr>" +
        "<th>Times</th>" +
        "<th>Name</th>" +
        "<th>Type</th>" +
        "<th>Rarity</th>" +
        "</tr>"
    for (var index in gresults) {
        hresults = hresults.concat("<tr><td>" + gresults[index].length.toString()
            + "</td><td>" + getItemByID(index).name + "</td><td>"
            + (getItemByID(index).type == Item.GEM ? "Gem" : "")
            + (getItemByID(index).type == Item.METAL ? "Metal" : "")
            + "</td><td>" + "$".repeat(getItemByID(index).rarity) + "</td></tr>");
    }
    return hresults;
}