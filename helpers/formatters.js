const currencyFormat = (value) => {
    return value.toLocaleString("id-ID", {style:"currency", currency:"IDR"});
}

module.exports = {currencyFormat}