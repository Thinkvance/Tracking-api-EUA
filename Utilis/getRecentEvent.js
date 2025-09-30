function getRecentEvent(data) {
  for (let i = data.length - 1; i >= 0; i--) {
    if (data[i].Progress === true) {
      return data[i];
    }
  }
  return { Status: "Not Found" };
}

export default getRecentEvent;