import React from 'react';
import moment from 'moment';
import 'moment/locale/id';

const FormatDate = ({ timestamp }) => {
    const formattedDate = moment(timestamp).locale('id').format('DD MMMM YYYY');
    return <span>{formattedDate}</span>;
};  

export default FormatDate;
