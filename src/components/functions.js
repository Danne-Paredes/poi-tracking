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
export const monthTransformer = (date) => {
    const transformedDate = date.split(' ')
    return `${transformedDate[0]}`
}
export const yearTransformer = (date) => {
    const transformedDate = date.split(' ')
    return `${transformedDate[1]}`
}

export const getMonthFromString = (mon) =>{
    return new Date(Date.parse(mon +" 1, 2012")).getMonth()+1
 }
 
export const useLongPress = (onLongPress, ms = 100) => {
    let timerId;

    const start = (index) => {
        timerId = setTimeout(() => onLongPress(index), ms);
    };

    const stop = () => {
        clearTimeout(timerId);
    };

    return (index) => ({
        onTouchStart: () => start(index),
        onTouchEnd: stop,
        onMouseDown: () => start(index),
        onMouseUp: stop,
        onMouseLeave: stop,
    });
};