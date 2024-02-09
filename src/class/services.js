async function postData(range, data) {
    try {
      let response = await gapi.client.sheets.spreadsheets.values.append({
        spreadsheetId: spreadsheetId,
        range: range,
        includeValuesInResponse: true,
        insertDataOption: "INSERT_ROWS",
        responseDateTimeRenderOption: "FORMATTED_STRING",
        responseValueRenderOption: "FORMATTED_VALUE",
        valueInputOption: "USER_ENTERED",
        resource: {
          majorDimension: "ROWS",
          range: "",
          values: [
            data
          ]
        }
      })
      return response
    } catch (e) {
  
    }
}
async function updateData(data) {
  try {
    let response = await gapi.client.sheets.spreadsheets.values.batchUpdate({
      spreadsheetId: spreadsheetId,
      resource: {
        data: data,
        includeValuesInResponse: false,
        responseDateTimeRenderOption: "FORMATTED_STRING",
        responseValueRenderOption: "FORMATTED_VALUE",
        valueInputOption: "USER_ENTERED"
      }
    })
    return response
  } catch (e) {
    console.log(e)
  }
}
function createdDataToUpdate(arr, sheet) {
  /* arr = [{row, colum, value}] */
  let data = new Array()
  for (item of arr) {
    data.push({
      majorDimension: "ROWS",
      range: `${sheet}!R${item.row}C${item.column}`,
      values: [
        [item.value]
      ]
    })
  }
  return data
}
async function getEmail() {
  try {
    let response = await gapi.client.gmail.users.getProfile({
      "userId": "me"
    })
    return response.result.emailAddress
  } catch (e) {
    console.log(e)
  }
}