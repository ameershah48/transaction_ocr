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

    return dates.map((date, index) => {
        return {
            date: date,
            name: names[index],
            value: values[index],
        };
    });
}

module.exports = {
    getTransactions
}