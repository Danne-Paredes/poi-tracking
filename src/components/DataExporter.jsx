import React from 'react';
import { convertDataToHtmlTable, copyToClipboard } from './functions'

const DataExporter = ({ data }) => {
    const handleExport = () => {
        const htmlTable = convertDataToHtmlTable(data);
        copyToClipboard(htmlTable);
    };

    return (
        <button
                className='btn'
                onClick={handleExport}>Export to Clipboard</button>
    );
};

export default DataExporter;
