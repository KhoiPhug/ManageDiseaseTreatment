function ConvertDateToString(date = new Date()) {
    let day = date.getDate();
    let month = date.getMonth();
    let year = date.getFullYear();
    return '' + month + '/' + day + '/' + year;
}

export default ConvertDateToString;
