export const dateTransformer = (date) => {
    const transformedDate = date.split('T')
    return transformedDate[0]
}

export const timeTransformer = (date) => {
    const transformedDate = date.split('T')
    return transformedDate[1]
}
export const dateTimeTransformer = (date) => {
    const transformedDate = date.split('T')
    return `${transformedDate[0]} ${transformedDate[1]}`
}