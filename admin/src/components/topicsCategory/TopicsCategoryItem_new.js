import React, {useContext} from 'react';
import TopicsCategoryItem from "./TopicsCategoryItem";
import {Button} from "react-bootstrap";
import {Context} from "../../index";

const TopicsCategoryItemNew = (props) => {
    const {topicsCategoryStore} = useContext(Context)
    const addItemTrigger2 = React.useRef(null)
    // const cancelItemTrigger = React.useRef(null)

    // const [newItemName, setNewItemName] = useState('')
    // const [newItemDescription, setNewItemDescription] = useState('')

    const {addItemTrigger, addNewItemFunc, loadingAddItem, saveItemError} = props

    React.useEffect(() => {
        if(addItemTrigger) {
            addItemTrigger.added = alertTrigger
        }
    }, [])

    const alertTrigger = () => {
        addItemTrigger2.added()
    }

    const changeName = (name) => {
        // setNewItemName(name)
        topicsCategoryStore.setName = name
    }
    const changeDescription = (description) => {
        // setNewItemDescription(description)
        topicsCategoryStore.setDescription = description
    }

    const handleAddBtn = () => {
        // if(itemName && itemName.length > 0) {
        if(topicsCategoryStore.name && topicsCategoryStore.name.length > 0) {
            // addNewItemFunc({name: itemName, description: itemDescription})
            addNewItemFunc({name: topicsCategoryStore.name, description: topicsCategoryStore.description})
        }
    }

    const handleCancelBtn = () => {
        addItemTrigger2.clear()
    }

    const buttons = () => (
        <div style={{display: 'flex', marginLeft: '10px'}}>
            <Button
                variant='outline-primary'
                style={{marginRight: '5px'}}
                onClick={handleAddBtn}
                disabled={!!loadingAddItem}
            >Add</Button>
            <Button
                variant='outline-danger'
                onClick={handleCancelBtn}
                disabled={!!loadingAddItem}
            >Cancel</Button>
        </div>
    );

    return (
        <TopicsCategoryItem
            buttons={buttons}
            name={topicsCategoryStore.name}
            description={topicsCategoryStore.description}
            changeName={changeName}
            changeDescription={changeDescription}
            isNameEdit={true}
            addItemTrigger={addItemTrigger2}
            saveError={saveItemError}
        />
    );
};

export default TopicsCategoryItemNew;