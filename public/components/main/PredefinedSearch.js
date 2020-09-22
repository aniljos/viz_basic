import React, { Component } from 'react';
import axios from 'axios';

import { EuiFlexItem } from '@elastic/eui';
import { EuiTitle } from '@elastic/eui';
import { EuiFlexGroup } from '@elastic/eui';
import { EuiCard } from '@elastic/eui';
import { EuiIcon } from '@elastic/eui';
import { EuiButton } from '@elastic/eui';
import { EuiSpacer } from '@elastic/eui';
import { EuiText } from '@elastic/eui';
import './PredefinedSearch.css'
import { EuiBadge } from '@elastic/eui';
import { EuiLink } from '@elastic/eui';
import { EuiIconTip } from '@elastic/eui';
import { EuiPanel } from '@elastic/eui';
import { EuiFlexGrid } from '@elastic/eui';
import { EuiTextAlign } from '@elastic/eui';


class PredefinedSearch extends Component {

    state = {
        data: null
    };

    constructor(props) {

        super(props);

    }

    async componentDidMount() {

        try {

            const requestData = {
                size: 1,
                sort: { "aggregate_date": "desc" },
                query: {
                    "match_all": {}
                }
            }

            const resp = await axios.get("../vizapi/es/predefined");
            const data_items = resp.data.hits.hits.map((item, index) => {
                return {
                    _id: item._id,
                    page_id: index,
                    ...item._source,
                }
            });

            if (data_items.length > 0) {
                this.setState({
                    data: data_items[0]
                }, () => {
                    console.log(this.state.data);
                });
            }

        } catch (error) {
            console.log("Cannot fetch predefined search", error)
        }
    }

    capitalizeWord(str) {
        str = str.split(" ");

        for (var i = 0, x = str.length; i < x; i++) {
            str[i] = str[i][0].toUpperCase() + str[i].substr(1);
        }

        return str.join(" ");
    }

    renderData = () => {

        if (this.state.data) {
            let data = []
            for (const item in this.state.data) {
                if (typeof this.state.data[item] === 'object') {

                    data.push({ category: item, items: [] });
                    const current = data[data.length - 1];

                    const temp = this.state.data[item];
                    for (const key in temp) {
                        current.items.push({
                            //type: item,
                            name: key,
                            views: this.state.data[item][key][0],
                            occurances: this.state.data[item][key][1]
                        })
                    }
                }
            }

            console.log(data);

            const data_view = data.map((item, index) => {

                return (
                    <EuiFlexItem key={index}>
                        <EuiPanel paddingSize="m">
                            <EuiFlexGroup>
                                <EuiFlexItem grow={6}>
                                    <EuiTitle size="m" style={{ color: 'darkblue' }}>
                                        <div>
                                            {this.capitalizeWord(item.category)}
                                        </div>
                                    </EuiTitle>
                                </EuiFlexItem>
                                <EuiFlexItem grow={2}>
                                    <EuiTitle style={{ color: 'purple' }} size="xxs">
                                        <EuiTextAlign textAlign="right" style={{ color: 'blue' }} >
                                            Mentions
                                        </EuiTextAlign>
                                    </EuiTitle>
                                </EuiFlexItem>
                                <EuiFlexItem grow={2}>
                                    <EuiTitle style={{ color: 'purple' }} size="xxs">
                                        <EuiTextAlign textAlign="right">
                                            Views
                                        </EuiTextAlign>

                                    </EuiTitle>
                                </EuiFlexItem>
                            </EuiFlexGroup>
                            {item.items.map((item, index) => {
                                return (
                                    <EuiFlexGroup key={index}>
                                        <EuiFlexItem grow={6}>
                                            {this.capitalizeWord(item.name)}
                                        </EuiFlexItem>
                                        <EuiFlexItem grow={2}>
                                            <EuiText size="s">
                                                <EuiTextAlign textAlign="right">
                                                    {item.occurances}
                                                </EuiTextAlign>
                                            </EuiText>
                                        </EuiFlexItem>
                                        <EuiFlexItem grow={2}>
                                            <EuiText size="s">
                                                <EuiTextAlign textAlign="right">
                                                    {item.views}
                                                </EuiTextAlign>
                                            </EuiText>
                                        </EuiFlexItem>
                                    </EuiFlexGroup>
                                );
                            })}

                        </EuiPanel>
                    </EuiFlexItem>

                );

            })

            return (
                <EuiFlexGrid columns={3}>
                    {data_view}
                </EuiFlexGrid>
            )
        }


    }

    render() {
        return (

            <EuiFlexGroup direction="column">
                <EuiFlexItem>
                    <EuiTitle size="l" style={{ color: "#002699" }}>
                        <h1>
                            PERSONALITIES
                        </h1>
                    </EuiTitle>
                </EuiFlexItem>
                <EuiFlexItem>
                   
                        {this.renderData()}
                   

                </EuiFlexItem>
                <EuiFlexItem>
                    <EuiText size="m" color="subdued" >
                            These show the popular personailites in various fields of work
                    </EuiText>
                </EuiFlexItem>
            </EuiFlexGroup>

            


        )
    }
}

export default PredefinedSearch;