import { useEffect, useState } from "react";
import { initialItems } from "./constants";

localStorage.setItem('itemsJson', JSON.stringify(initialItems));
let cachedItems = JSON.parse(localStorage.getItem('itemsJson'));


const areItemsModified = (original, modified) => {
    return JSON.stringify(original) !== JSON.stringify(modified);
};


const flexColStyle = {display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'};

const EachItem = ({selectedItem, onFieldChange}) => {

    const handleChange = (field, oldVal, newVal) => {
        const defaultProps = {
            id: selectedItem.id,
            name: selectedItem.name,
            fieldType: field.fieldType
        };
        const prevAction = {
            ...defaultProps,
            fieldValue: oldVal
        };
        const curAction = {
            ...defaultProps,
            fieldValue: newVal
        };
        onFieldChange(curAction, prevAction);
    };

    return (
            <>
                <span style={{
                    height: '20%', 
                    backgroundColor: 'darkgray', 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    fontSize: 'x-large'}}
                > 
                    {selectedItem.name} 
                </span>

                <div style={{display: 'flex', flexDirection: 'column', alignSelf: 'flex-end', width: '80%'}}>
                    {selectedItem.fields && selectedItem.fields.map(field => <>

                        <form>
                            {field.fieldType === 'text' &&
                            <div class="form-group">
                                <label for="field"><b>{field.fieldName}</b></label>
                                <input 
                                    type="text" 
                                    class="form-control"  
                                    placeholder="Enter field" 
                                    value={field.fieldValue} 
                                    onChange={(e) => {
                                        handleChange(field, field.fieldValue, e.target.value);
                                    }}/>
                            </div>
                            }
                        
                            {field.fieldType === 'option' &&
                            <div class="form-group">
                                <label for="field"><b>{field.fieldName}</b></label>
                                <select 
                                    name="cars" 
                                    id="cars" 
                                    class="form-control" 
                                    onChange={(e) => {
                                        const {selectedIndex} = e.target.options;
                                        handleChange(field, field.fieldValue, selectedIndex);
                                    }}>
                                      {field.fieldOptions.map((car, index) => <> 
                                        <option 
                                            value={car.optionValue} 
                                            selected={index === field.fieldValue}> 
                                                {car.optionName} 
                                        </option>
                                        </>)}
                                </select>
                            </div>
                            }

                            {field.fieldType === 'toggle' && <>
                            <label for="field"><b>{field.fieldName}</b></label>
                            <div class="form-group form-check">
                                <label class="form-check-label">
                                    <input 
                                        type="checkbox" 
                                        class="form-check-input" 
                                        checked={field.fieldValue} 
                                        onChange={(e) => {
                                            handleChange(field, field.fieldValue, e.target.checked);
                                        }}/>
                                    {field.fieldName ? 'checked' : 'unchecked'}
                                </label>
                            </div>
                            </>}
                        </form>

                        </>
                    )}
                </div>
            </>
    );
};


const Items = ({items, selectedItem, onSelect}) => {
    return (
        <div>
            <ul class="list-group">
                {items && items.map(item =>  <li 
                    class={`list-group-item ${selectedItem.id === item.id && selectedItem.name === item.name && 'active'}`} 
                    onClick={() => onSelect(item)}>
                        <b>{item.name}</b>
                </li>)}
            </ul>

        </div>
    );
};

const Actions = ({actions, onSelect}) => {
    return (
        <>
            {actions.map(action => <button 
                style={{margin: '0px 10px 0px 10px', opacity: !action.enabled ? 0.4 : 1}}
                type="button" 
                class={`btn btn-${action.type}`} 
                onClick={() => onSelect(action.name)} 
                disabled={!action.enabled}
                >
                    {action.name}
            </button>)}
        </>
    );
};

const ItemEditor = () => {
    const [items, setItems] = useState(cachedItems);
    const [selectedItem, setSelectedItem] = useState(cachedItems[0]);
    const [historyUndo, setHistoryUndo] = useState('');
    const [historyRedo, setHistoryRedo] = useState('');
    const [save, setSave] = useState(false);

    useEffect(() => {
        if(save === true) {
            localStorage.setItem('itemsJson', JSON.stringify(items));
            cachedItems = JSON.parse(localStorage.getItem('itemsJson'));
            setItems(cachedItems);
            setHistoryUndo('');
            setHistoryRedo('');
            setSave(false);
        }
    }, [save]);

    const onValueChange = (items, {id, name, fieldType, fieldValue}) => {
        const modifiedItems = items.map(item => {
            if(item.id === id && item.name === name) {
                return {
                        ...item,
                        fields: item.fields.map(field => {
                            if(field.fieldType === fieldType) {
                                return {
                                    ...field,
                                    fieldValue: fieldValue
                                };
                            } else {
                                return field;
                            }
                        })
                    };
            } else {
                return item;
            }
        });
        setItems(modifiedItems);
        setSelectedItem(modifiedItems.filter(item => item.id === selectedItem.id && item.name === selectedItem.name)[0]);
    };

    const onselectionchange = (history) => {
        const selItem = history.data;
        setSelectedItem(items.filter(item => item.id === selItem.id && item.name === selItem.name)[0]);
    };

    const performAction = (action) => {
        switch(action) { 
            case 'undo':
                historyUndo.action === 'item selection' ?
                    onselectionchange(historyUndo) :
                        onValueChange(items, historyUndo);  //apply undo
                
                setHistoryUndo('');
                break;

            case 'redo':
                historyRedo.action === 'item selection' ?
                    onselectionchange(historyRedo) :
                        onValueChange(items, historyRedo); //apply redo

                setHistoryRedo('');
                break;
        
            case 'save':
                areItemsModified(cachedItems, items) && setSave(true); //save
                break;
        
            case 'cancel':
                setItems(cachedItems); //back to original
                setSelectedItem(cachedItems[0]);
                setHistoryUndo('');
                setHistoryRedo('');
                break;
        }
    };

    return (
        <div style={{display: 'flex'}}>
        <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', height: '100%', width: '50%', margin: 10, padding: 10}}>

            <div style={{display: 'flex', margin: 10, backgroundColor: 'black', width: '100%', height: '100%'}}>
                <div style={{width: '20%', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white'}}> 
                    <b>ITEM EDITOR</b>
                </div>
                <div style={{width: '80%', display: 'flex', justifyContent: 'flex-end', margin: 10}}>
                    <Actions 
                        actions={[
                            {name: 'undo', type: 'primary', enabled: Object.keys(historyUndo).length > 0},
                            {name: 'redo', type: 'warning', enabled: Object.keys(historyRedo).length > 0},
                            {name: 'save', type: 'success', enabled: areItemsModified(cachedItems, items)},
                            {name: 'cancel', type: 'danger', enabled: areItemsModified(cachedItems, items)}
                        ]} 
                        onSelect={performAction}
                    />
                </div>
            </div>
            
            <div style={{display: 'flex', margin: 10, width: '100%', height: '100%', border: '1px solid lightgray'}}>
                <div style={{width: '20%'}}> 
                    <Items 
                        items={items} 
                        selectedItem={selectedItem}
                        onSelect={(item) => {
                            setSelectedItem(item);
                            setHistoryUndo({
                                action: 'item selection',
                                data: selectedItem
                            });
                            setHistoryRedo({
                                action: 'item selection',
                                data: item
                            });
                        }}
                    />
                </div>
                <div style={{width: '80%'}}>
                    <div style={{display: 'flex', justifyContent: 'flex-end', width: '100%', height: '100%'}}>
                        <div style={{...flexColStyle, width: '100%', height: '100%'}}>
                            <EachItem 
                                selectedItem={selectedItem}
                                onFieldChange={(curAction, prevAction) => {
                                    onValueChange(items, curAction);

                                    setHistoryUndo(prevAction);
                                    setHistoryRedo(curAction);
                                }}
                            />   
                        </div>
                    </div>
                </div>     
            </div>
        </div>

        <div style={{marginTop: 100}}>
            <HistoryView history={historyUndo}/>
        </div>
    </div>
    );
};

export default ItemEditor;

const HistoryView = ({history}) => {
    const viewType = history.action === 'item selection' ? 'selection' : 'modify';
    const data = history.action === 'item selection' ? history.data : history;

    let value = '';
    if(data) {
        if(data.fieldType === 'toggle') {
            value = data.fieldValue === true ? 'checked' : 'unchecked';
        } else {
            value = data.fieldValue;
        }
    }
    return (
        <> {data && 
                <div style={{marginLeft: 20}}>
                    <h4>History</h4>
                    <span>{viewType === 'modify' ?
                            `${data.name} ==> ${data.fieldType} ==> ${value}` : 
                                `${data.name} ==> selected`}
                    </span>
                </div>}
        </>
    );
};
