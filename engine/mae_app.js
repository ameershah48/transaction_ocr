let seperatorWord = [
    "Today",
    "Yesterday",
    "Jan"
];

function getTransactionValue(text) {
    const lines = text.split(/\r?\n/);

    //remove empty lines
    const filteredLines = lines.filter(function (el) {
        return el != "";
    });

    //find today index
    const startIndex = filteredLines.findIndex((line) => {
        return line.includes("Transaction History") || line.includes("Debit Card History") || line.includes("M2U History");
    });

    //remove index 0 to today index
    filteredLines.splice(0, startIndex + 1);

    //find all index of seperator word in array
    const seperatorIndex = filteredLines.map((line, index) => {
        //remove number
        line = line.replace(/\d/g, '').trim();

        if (seperatorWord.includes(line)) {
            return index;
        }
    });

    //remove all index that is not found
    const filteredSeperatorIndex = seperatorIndex.filter(function (el) {
        return el != null;
    });

    //count lines that contain the word "RM" and "-RM" is the first word in the line
    const count = filteredLines.filter((line) => {
        return line.includes("RM") && line.indexOf("RM") === 0;
    }).length;

    const count2 = filteredLines.filter((line) => {
        return line.includes("-RM") && line.indexOf("-RM") === 0;
    }).length;

    //get 6 elements from last index of filteredLines
    const values = filteredLines.slice(filteredLines.length - (count + count2), filteredLines.length);

    return values;
}

function getGroupTransactionName(text) {
    const lines = text.split(/\r?\n/);

    //split by empty line
    let splitByEmptyLine = lines.reduce((acc, line) => {
        if (line === "") {
            acc.push([]);
        } else {
            acc[acc.length - 1].push(line);
        }
        return acc;
    }, [[]]);

    //flatten array
    splitByEmptyLine = splitByEmptyLine.map((line) => line.join(" "));
    
    //remove empty lines
    splitByEmptyLine = splitByEmptyLine.filter(function (el) {
        return el != "";
    });

    //find today index
    const startIndex = splitByEmptyLine.findIndex((line) => {
        return line.includes("Transaction History");
    });

    //remove index 0 to today index
    splitByEmptyLine.splice(0, startIndex + 1);

    //find all index of seperator word in array
    const seperatorIndex = splitByEmptyLine.map((line, index) => {
        //remove number
        line = line.replace(/\d/g, '').trim();

        if (seperatorWord.includes(line)) {
            return index;
        }
    });

    //remove all index that is not found
    const filteredSeperatorIndex = seperatorIndex.filter(function (el) {
        return el != null;
    });

    //count lines that contain the word "RM" and "-RM" is the first word in the line
    const count = splitByEmptyLine.filter((line) => {
        return line.includes("RM") && line.indexOf("RM") === 0;
    }).length;

    const count2 = splitByEmptyLine.filter((line) => {
        return line.includes("-RM") && line.indexOf("-RM") === 0;
    }).length;

    //remove 6 elements from last index of filteredLines
    splitByEmptyLine.splice(splitByEmptyLine.length - (count + count2), count + count2);

    //iterate through filteredSeperatorIndex, group lines by seperator word
    const groupedLines = filteredSeperatorIndex.map((index, i) => {
        if (i === filteredSeperatorIndex.length - 1) {
            return splitByEmptyLine.slice(index + 1, splitByEmptyLine.length);
        } else {
            return splitByEmptyLine.slice(index + 1, filteredSeperatorIndex[i + 1]);
        }
    });

    return groupedLines;
}

function getTransactionDate(text) {
    const lines = text.split(/\r?\n/);

    //remove empty lines
    const filteredLines = lines.filter(function (el) {
        return el != "";
    });

    //find today index
    const startIndex = filteredLines.findIndex((line) => {
        return line.includes("Transaction History");
    });

    //remove index 0 to today index
    filteredLines.splice(0, startIndex + 1);

    //find all index of seperator word in array
    const seperatorIndex = filteredLines.map((line, index) => {
        //remove number
        const trimmed = line.replace(/\d/g, '').trim();

        if (seperatorWord.includes(trimmed)) {
            return line;
        }
    });

    //remove all index that is not found
    const filteredSeperatorIndex = seperatorIndex.filter(function (el) {
        return el != null;
    });

    return filteredSeperatorIndex;
}

function getTransactions(text) {
    const dates = getTransactionDate(text);
    const transactions = getGroupTransactionName(text);
    let values = getTransactionValue(text);

    values = values.map((value) => {
        value = value
            .replace("RM", "")
            .replace(" ", "")
            .replace(" ", "")
            .trim();

        return parseFloat(value);
    });

    //combine dates and transactions
    const combined1 = dates.map((date, i) => {
        return {
            date: date,
            transactions: transactions[i]
        };
    });

    //flatten transactions array
    const flattenedTransactions = [].concat.apply([], transactions);

    //combine transactions and values
    const combined2 = flattenedTransactions.map((transaction, i) => {
        return {
            name: transaction,
            value: values[i] ? values[i] : null
        };
    });

    //combine combined1 and combined2
    const combined3 = combined1.map((item, i) => {
        return {
            date: item.date,
            transactions: combined2.splice(0, item.transactions.length)
        };
    });

    combined3.forEach(element => {
        //add date to each transaction
        element.transactions.forEach(transaction => {
            transaction.date = element.date;
        });
    });

    //flatten transactions array
    let flattenedTransactions2 = [].concat.apply([], combined3.map(item => item.transactions));

    flattenedTransactions2 = flattenedTransactions2.map((item, i) => {
        return {
            date: Date.parse(item.date),
            name: item.name,
            value: item.value
        };
    });

    return flattenedTransactions2;
}

module.exports = {
    getTransactions
};