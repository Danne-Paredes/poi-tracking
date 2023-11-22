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

export const findDifferences = (originalVisit, updatedVisit, curIndex, transactionDetails) => {
    let transactionChanges = [];

    // If curIndex is not null, we are modifying or deleting a transaction
    if (curIndex != null) {
        const originalTransaction = originalVisit.transactions[curIndex];

        // Check if the transaction was modified
        const isModified = Object.keys(transactionDetails).some(key => transactionDetails[key] !== originalTransaction[key]);
        if (isModified) {
            transactionChanges.push({ type: 'modified', original: originalTransaction, updated: transactionDetails });
        }
        // If the transaction was not modified, it implies it might be deleted, but that's handled in a different logic block
    } else {
        // If curIndex is null, we are adding a new transaction
        transactionChanges.push({ type: 'added', original: null, updated: transactionDetails });
    }

    // Check for deleted transactions
    originalVisit.transactions.forEach((orgTrans, index) => {
        if (!updatedVisit.transactions.find(updTrans => updTrans === orgTrans) && index !== curIndex) {
            transactionChanges.push({ type: 'deleted', original: orgTrans, updated: null });
        }
    });

    return {
        visitArrival: updatedVisit.arrival,
        original: originalVisit,
        updated: updatedVisit,
        changes: transactionChanges
    };
};

