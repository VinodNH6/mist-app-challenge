import { useState } from "react";
import { itemsx } from "./constants";

const flexColStyle = {display: 'flex', flexDirection: 'column'};

const EachItem = ({selectedItem, onTextChange, onOptionChange, onToggleChange}) => {
    console.log(selectedItem);
    return (
        <div style={{display: 'flex', justifyContent: 'center', marginTop: 15}}>

            <div style={flexColStyle}>
                <span> {selectedItem.id} - {selectedItem.name} </span>

                <div style={flexColStyle}>
                    {selectedItem.fields && selectedItem.fields.map(field => <>

                            {field.fieldType === 'text' &&
                            <div style={flexColStyle}>
                                <label>{field.fieldName}</label>
                                <input type="text" value={field.fieldValue} onChange={(e) => {
                                    console.log(e.target.value);

                                    // const latestAction = {
                                    //     id: selectedItem.id,
                                    //     name: selectedItem.name,
                                    //     fieldType: field.fieldType,
                                    //     fieldValue: e.target.value
                                    // };
                                    // historyStack['lastaction'] = latestAction;
                                    // onTextChange(latestAction);

                                    const prevAction = {
                                        id: selectedItem.id,
                                        name: selectedItem.name,
                                        fieldType: field.fieldType,
                                        fieldValue: field.fieldValue
                                    };

                                    onTextChange({
                                        id: selectedItem.id,
                                        name: selectedItem.name,
                                        fieldType: field.fieldType,
                                        fieldValue: e.target.value
                                    }, 
                                    prevAction);
                                }}/>
                            </div>
                            }
                        
                            {field.fieldType === 'option' &&
                            <div style={flexColStyle}>
                                <label>{field.fieldName}</label>
                                <select name="cars" id="cars" onChange={(e) => {
                                    const {selectedIndex} = e.target.options;
                                    console.log(field.fieldOptions[selectedIndex]);
                                    // const latestAction = {
                                    //     id: selectedItem.id,
                                    //     name: selectedItem.name,
                                    //     fieldType: field.fieldType,
                                    //     fieldValue: selectedIndex
                                    // };
                                    // historyStack['lastaction'] = latestAction;
                                    // onOptionChange(latestAction);

                                    const prevAction = {
                                        id: selectedItem.id,
                                        name: selectedItem.name,
                                        fieldType: field.fieldType,
                                        fieldValue: field.fieldValue
                                    };

                                    onOptionChange({
                                        id: selectedItem.id,
                                        name: selectedItem.name,
                                        fieldType: field.fieldType,
                                        fieldValue: selectedIndex
                                    },
                                    prevAction);
                                }}>
                                      {field.fieldOptions.map((car, index) => <option value={car.optionValue} selected={index === field.fieldValue}> {car.optionName} </option>)}
                                </select>
                            </div>
                            }

                            {field.fieldType === 'toggle' &&
                            <div style={flexColStyle}>
                                <label>{field.fieldName}</label>
                                <input type="checkbox" checked={field.fieldValue} onChange={(e) => {
                                    console.log(e.target.checked);
                                    // const latestAction = {
                                    //     id: selectedItem.id,
                                    //     name: selectedItem.name,
                                    //     fieldType: field.fieldType,
                                    //     fieldValue: e.target.checked
                                    // };
                                    // historyStack['lastaction'] = latestAction;
                                    // onToggleChange(latestAction);

                                    const prevAction = {
                                        id: selectedItem.id,
                                        name: selectedItem.name,
                                        fieldType: field.fieldType,
                                        fieldValue: field.fieldValue
                                    };

                                    onToggleChange({
                                        id: selectedItem.id,
                                        name: selectedItem.name,
                                        fieldType: field.fieldType,
                                        fieldValue: e.target.checked
                                    },
                                    prevAction);
                                }}/>
                            </div>
                            }

                        </>
                    )}
                </div>
            </div>
        </div>
    );
};


const Items = ({items, onSelect}) => {
    console.log(items);
    return (
        <div>
            <ul>
                {items.map(item =>  <li 
                                        onClick={() => {
                                            // historyStack['lastaction'] = item;
                                            onSelect(item);
                                        }}
                                    >
                                        {item.id} - {item.name}
                                    </li>)}
            </ul>
        </div>
    );
};

const Actions = ({actions, onSelect}) => {
    return (
        <div>
            {actions.map(action => <button onClick={() => onSelect(action.name)} disabled={!action.enabled}>{action.name}</button>)}
        </div>
    );
};

const performAction = (action) => {
    console.log(action);
};

const areItemsModified = (original, modified) => {
    // for (const [key, value] of Object.entries(original)) {
    //     console.log(`${key}: ${value}`);
    //   }
    return JSON.stringify(original) !== JSON.stringify(modified);
};

const ItemEditor = () => {
    const [items, setItems] = useState(itemsx);
    const [selectedItem, setSelectedItem] = useState(itemsx[0]);
    const [history, setHistory] = useState('');
    const [historyRedo, setHistoryRedo] = useState('');

    console.log(items);
    console.log(history);
    console.log(historyRedo);

    console.log('ORIGINAL:');
    console.log(itemsx);
    console.log('MODIFIED');
    console.log(items);

    const onTextChange = (items, {id, name, fieldType, fieldValue}) => {
        console.log(items);
        console.log(id, name, fieldType, fieldValue);
        const xxxx = items.map(item => {
            if(item.id === id && item.name === name) {
                console.log(item);
                return {
                        ...item,
                        fields: item.fields.map(field => {
                            if(field.fieldType === fieldType) {
                                console.log(field, fieldValue);
                                const yy = {
                                    ...field,
                                    fieldValue: fieldValue
                                };
                                console.log(yy);
                                return yy;
                            } else {
                                return field;
                            }
                        })
                    };
            } else {
                return item;
            }
        });
        setItems(xxxx);
        setSelectedItem(xxxx.filter(item => item.id === selectedItem.id && item.name === selectedItem.name)[0]);
    };

    return (
        <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', margin: 10, padding: 10}}>

            <div style={{display: 'flex', margin: 10}}>
                <div style={{width: '30%'}}> 
                    ITEM EDITOR 
                </div>
                <div>
                    <Actions 
                        actions={[
                            {name: 'undo', enabled: Object.keys(history).length > 0},
                            {name: 'redo', enabled: Object.keys(historyRedo).length > 0},
                            {name: 'save', enabled: areItemsModified(itemsx, items)},
                            {name: 'cancel', enabled: areItemsModified(itemsx, items)}
                        ]} 
                        onSelect={(action) => {
                            performAction && performAction(action);
                            if(action === 'undo') {
                                console.log(history);
                                // const zz = onTextChange(items, history);  //apply history
                                // setItems(zz);
                                onTextChange(items, history);  //apply history
                                // setSelectedItem(zz[0]);
                                setHistory(''); //empty history
                            }
                            if(action === 'redo') {
                                // const zz = onTextChange(items, historyRedo); //apply redo
                                // setItems(zz);
                                onTextChange(items, historyRedo); //apply redo
                                // setSelectedItem(zz[0]);
                                setHistoryRedo(''); //empty redo
                            }
                            if(action === 'save') {
                                if(areItemsModified(itemsx, items)) {
                                    itemsx = items; //put updated values into original one.
                                    setItems(itemsx);
                                }
                            }
                            if(action === 'cancel') {
                                setItems(itemsx); //back to original
                                setSelectedItem(itemsx[0]);
                                setHistory('');
                                setHistoryRedo('');
                            }
                        }}
                    />
                </div>
            </div>
            
            <div style={{display: 'flex', margin: 10}}>
                <div style={{width: '30%'}}> 
                    <Items 
                        items={items} 
                        onSelect={(item) => {
                            setSelectedItem(item);
                            setHistory(item);
                        }}
                    />
                </div>
                <div>
                    <EachItem 
                        selectedItem={selectedItem}
                        onTextChange={(curAction, prevAction) => {
                            // const xx = onTextChange(items, curAction);
                            // setItems(xx);
                            // setSelectedItem(xx[0]);

                            onTextChange(items, curAction);

                            setHistory(prevAction);
                            setHistoryRedo(curAction);
                        }}
                        onOptionChange={(curAction, prevAction) => {
                            // const xx = onTextChange(items, curAction);
                            // setItems(xx);
                            // setSelectedItem(xx[0]);

                            onTextChange(items, curAction);

                            setHistory(prevAction);
                            setHistoryRedo(curAction);
                        }} 
                        onToggleChange={(curAction, prevAction) => {
                            // const xx = onTextChange(items, curAction);
                            // setItems(xx);
                            // setSelectedItem(xx[0]);

                            onTextChange(items, curAction);

                            setHistory(prevAction);
                            setHistoryRedo(curAction);
                        }}
                    />   
                </div>     
            </div>

        </div>
    );
};

export default ItemEditor;
