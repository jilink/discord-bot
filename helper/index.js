export const getAuthorTag = (author) => {

  return `<@${author.id}>`
}

export const getAuthorTagByMessage = (message) => {

  return `<@${message.author.id}>`
}