const itemNames = [
    'ABC',
    'DEF',
    'GHI',
    'JKL',
    'MNO',
    'PQR'
];


export const initialItems = itemNames.map((item, index) => {
    return {
        id: index,
        name: item,
        fields: [
            {
                id: '1',
                fieldName: 'field 1',
                fieldType: 'text',
                fieldValue: item
            },
            {
                id: '2',
                fieldName: 'field 2',
                fieldType: 'option',
                fieldValue: 3,
                fieldOptions: [
                    {
                        optionName: 'maruti',
                        optionValue: 'brezza'
                    },
                    {
                        optionName: 'hyundai',
                        optionValue: 'venue'
                    },
                    {
                        optionName: 'tata',
                        optionValue: 'nexon'
                    },
                    {
                        optionName: 'mahindra',
                        optionValue: 'xuv300'
                    },
                    {
                        optionName: 'ford',
                        optionValue: 'ecosport'
                    }
                ]
            },
            {
                id: '3',
                fieldName: 'field 3',
                fieldType: 'toggle',
                fieldValue: true
            }
        ]
    };
});