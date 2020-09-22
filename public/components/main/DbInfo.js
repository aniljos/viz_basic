import React, { PureComponent } from 'react';
import { EuiFlexGroup } from '@elastic/eui';
import { EuiFlexItem } from '@elastic/eui';
import { EuiCard } from '@elastic/eui';
import './DbInfo.css'
import { EuiTextColor } from '@elastic/eui';
import axios from 'axios';
import { EuiStat } from '@elastic/eui';
import { EuiText } from '@elastic/eui';
import { EuiTitle } from '@elastic/eui';


class DbInfo extends PureComponent {

    state = {
        channelCount: 0,
        postsCount: 0,
        messagesInLast24hours: 0
    }

    constructor(props) {
        super(props);

        // this.elasticBaseUrl = config.elasticBaseCountUrl;
        //this.elasticBaseUrl_search = config.elasticBaseSearchUrl;
    }

    async componentDidMount() {

        try {

            const c_data = {
                "query": {
                    "has_child": {
                        "type": "parent",
                        "query": {
                            "match_all": {}
                        }
                    }
                }
            }
            //const c_response = await axios.post(this.elasticBaseUrl, c_data);
            const c_response = await axios.get("../vizapi/es/channelcount");
            const c_count = c_response.data.count;
            // console.log("c_count", c_count)
            const p_data = {
                "query": {
                    "has_parent": {
                        "parent_type": "group",
                        "query": {
                            "match_all": {}
                        }
                    }
                }
            }
            //const p_response = await axios.post(this.elasticBaseUrl, p_data);
            const p_response = await axios.get("../vizapi/es/totalPosts");

            const p_count = p_response.data.count;
            //console.log("p_count", p_count);

            const m_data = {
                "query": {
                    "range": {
                        "date": {
                            "gte": "now-24h"
                        }
                    }
                },
                "_source": ["pc", "date"],
                size: 10000
            }
            const m_response = await axios.get("../vizapi/es/latestPosts");
            //console.log("M_resp1", m_response);
            //const m_response = await axios.post(this.elasticBaseUrl_search, m_data);
            const resp_data = m_response.data.hits.hits.map((item => {
                return {
                    _id: item._id,
                    ...item._source,
                }
            }));
            //console.log("DB_info data", resp_data);
            const filteredData = resp_data.filter(item => item.pc.name === "parent");
            //console.log("DB_info data filteredData", filteredData);
            const m_count = filteredData.length;
            //console.log("m_count", m_count);
            //const m_count = 0;



            this.setState({
                channelCount: c_count,
                postsCount: p_count,
                messagesInLast24hours: m_count
            })


        } catch (error) {
            console.log("DbInfo error", error);
        }

    }

    renderData = () => {
        return (
            <EuiFlexGroup>
                <EuiFlexItem>
                    <EuiCard
                        className="card"
                        title={<EuiStat title={this.state.channelCount} titleColor="secondary"
                            description={<EuiText color="subdued">Channels and Groups</EuiText>} textAlign="center" />}

                    />
                </EuiFlexItem>
                <EuiFlexItem>
                    <EuiCard
                        className="card"
                        title={<EuiStat title={this.state.postsCount} titleColor="secondary"
                            description={<EuiText color="subdued">Posts</EuiText>} textAlign="center" />}

                    />
                </EuiFlexItem>
                <EuiFlexItem>
                    <EuiCard
                        className="card"
                        title={<EuiStat title={this.state.messagesInLast24hours} titleColor="secondary"
                            description={<EuiText color="subdued">No. of Post in the last 24 hours</EuiText>} textAlign="center" />}

                    />
                </EuiFlexItem>
            </EuiFlexGroup>
        )
    }
    render() {
        return (


            <EuiFlexGroup direction="column">
                <EuiFlexItem>
                    <EuiTitle size="l" style={{ color: "#002699" }}>
                        <h1>
                            CHANNEL INFORMATION
                        </h1>
                    </EuiTitle>
                </EuiFlexItem>
                <EuiFlexItem>

                    {this.renderData()}


                </EuiFlexItem>
                <EuiFlexItem>
                    <EuiText size="m" color="subdued" >
                        These show the summary of the current database
                    </EuiText>
                </EuiFlexItem>
            </EuiFlexGroup>




        )
    }
}

export default DbInfo;