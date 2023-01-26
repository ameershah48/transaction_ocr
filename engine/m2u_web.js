function getTransactions(text){

    // Split the text into lines
    let lines = text.split(/\r?\n/);

    //remove empty lines
    lines = lines.filter(function (el) {
        return el != "";
    });

    //find line that have word "RM" and "-RM"
    let count = lines.filter(function (el) {
        return el.includes("RM") || el.includes("-RM");
    }).length;

    let dates = lines.slice(0, count);
    let names = lines.slice(count, count * 2);
    let values = lines.slice(count * 2, count * 3);

    values = values.map((value) => {
        value = value
            .replace("RM", "")
            .replace(" ", "")
            .replace(" ", "")
            .trim();

        return parseFloat(value);
    });

    return dates.map((date, index) => {
        return {
            date: Date.parse(date),
            name: names[index],
            value: values[index],
        };
    });
}

module.exports = {
    getTransactions
}