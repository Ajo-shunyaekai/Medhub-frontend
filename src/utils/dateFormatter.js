// Function to format the date
export const formatDate = (dateString) => {
  const date = new Date(dateString);

  const day = ("0" + date.getDate()).slice(-2); // Add leading zero if necessary
  const month = ("0" + (date.getMonth() + 1)).slice(-2); // Add leading zero and adjust month (0-indexed)
  const year = date.getFullYear();
  const hours = ("0" + date.getHours()).slice(-2); // Add leading zero if necessary
  const minutes = ("0" + date.getMinutes()).slice(-2); // Add leading zero if necessary
  const seconds = ("0" + date.getSeconds()).slice(-2); // Add leading zero if necessary

  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
};
