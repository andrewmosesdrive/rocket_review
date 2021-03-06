import React from 'react';
import { SprkCheckboxGroup, SprkFieldset, SprkLegend, SprkCheckboxItem, SprkHeading } from '@sparkdesignsystem/spark-react';
import { useEffect, useState } from 'react';
import axios from 'axios';

const SubTopicsGrid = () => {
    const [results, setResults] = useState([]);
    const [refresh, toggleRefresh] = useState(0);
    const refreshParent = () => {
        toggleRefresh(refresh + 1);
    };

    useEffect(() => {
        fetchReviewItems();
    }, [refresh]);
    async function fetchReviewItems() {
        const { data } = await axios.get('/api/revObjs');
        setResults(data);
    };

    const subTopicResultsFiltered = [];
    let subCounter;

    for (let i = 0; i < results.length; i++) {
        subCounter = 0
        for (let j = i + 1; j < results.length; j++) {

            if (results[i].topic == results[j].topic) {
                subCounter++;
            }

        }
        if (subCounter < 1) {
            subTopicResultsFiltered.push(results[i])
        }
    }

    const [checkedItems, setCheckedItems] = useState({});
    const handleChange = (event) => {
        setCheckedItems({ ...checkedItems, [event.target.name]: event.target.checked });
    }

    useEffect(() => {
        console.log('checkedSubTopics: ', checkedItems);
    }, [checkedItems]);

    const subTopicsCheckboxes = subTopicResultsFiltered;

    return (
        <div>
            <SprkCheckboxGroup variant='huge'>
                <SprkFieldset>
                    <SprkLegend><SprkHeading
                        element='h1'
                        variant='displayTwo'
                        isPageTitle
                        idString='heading-component-options'
                    >Subtopics</SprkHeading></SprkLegend>
                    {subTopicsCheckboxes.map(result => {
                        return (
                            <div key={result.subTopic}>
                                <SprkCheckboxItem name={result.subTopic} variant='huge' onChange={handleChange}>
                                    {result.subTopic}
                                </SprkCheckboxItem>
                            </div>
                        )
                    })}
                </SprkFieldset>
            </SprkCheckboxGroup>

        </div>
    )
}


export default SubTopicsGrid;