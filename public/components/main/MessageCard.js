import React, { PureComponent } from 'react';

import ShowMoreText from 'react-show-more-text';
import {
    EuiText,
    EuiButton,
    EuiFlexGroup, EuiFlexItem, EuiSpacer,
    EuiIcon,
    EuiPanel,
    EuiTextColor,
    EuiBadge,
    EuiCard
} from '@elastic/eui';
import './MessageCard.css'
import 'bootstrap/dist/css/bootstrap.css';



class MessageCard extends PureComponent {




    state = {
        tag: false
    }
    updateCard = () => {

        //console.log("updating card");
        this.setState({
            tag: !this.state.tag
        });
    }

    renderCard = (item, className) => {

        // console.log("rendercard", item);




        let childPanel;
        if (item.text) {
            childPanel = (
                // <EuiHighlight search={this.state.search} highlightAll={true}>{item.text}</EuiHighlight>
                <EuiText size="s">
                    <ShowMoreText lines={3} more="more" less="less" keepNewLines={true}>{item.text}</ShowMoreText>
                </EuiText>
            );
        }
        else if (item.document) {


            childPanel = (
                <div>
                    <div>
                        <EuiTextColor color="secondary">Document: {item.document.file_name}</EuiTextColor>
                    </div>
                    <EuiSpacer />
                    <EuiButton color="primary" size="s" onClick={() => { this.props.openDocument(item) }}>
                        Open
                    </EuiButton>
                   
                    {item.caption ? (<> <EuiSpacer /><EuiText size="s">
                        <ShowMoreText lines={3} more="more" less="less" keepNewLines={true}>{item.caption}</ShowMoreText>
                    </EuiText></>) : null}

                </div>
            )
        }
        else if (item.audio) {


            childPanel = (
                <div>
                    <div>
                        <EuiTextColor color="secondary">Audio: {item.audio.file_name}</EuiTextColor>
                    </div>
                    <EuiSpacer />
                    <EuiButton color="primary" size="s" hidden={item.media_visible == true} onClick={() => { this.props.openAudio(item, this) }}>
                        Open
                    </EuiButton>
                    <EuiSpacer />
                    <audio hidden={item.media_visible == false} controls src={item.mediaLocalPath}></audio>
                    {item.caption ? (<> <EuiSpacer /><EuiText size="s">
                        <ShowMoreText lines={3} more="more" less="less" keepNewLines={true}>{item.caption}</ShowMoreText>
                    </EuiText></>) : null}

                </div>
            )
        }
        else if (item.video) {


            childPanel = (
                <div>
                    <div>
                        <EuiTextColor color="secondary">Video: {item.attached_file_name}</EuiTextColor>
                    </div>
                    <EuiSpacer />
                    <EuiButton color="primary" size="s" hidden={item.media_visible == true} onClick={() => { this.props.openVideo(item, this) }}>
                        Open
                    </EuiButton>
                    <EuiSpacer />
                    <video height="250" width="300" hidden={item.media_visible == false} controls src={item.mediaLocalPath}></video>
                    {item.caption ? (<> <EuiSpacer /><EuiText size="s">
                        <ShowMoreText lines={3} more="more" less="less" keepNewLines={true}>{item.caption}</ShowMoreText>
                    </EuiText></>) : null}


                </div>
            )
        }
        else if (item.photo) {

            //console.log(" Photo: ", item)
            if (!item.mediaLocalPath) {

                //console.log("Fetching Photo: ", item.mediaLocalPath)
                this.props.openPhoto(item, this)
            }

            childPanel = (
                <div>
                    <div>
                        <EuiTextColor color="secondary">Photo: {item.attached_file_name}</EuiTextColor>
                    </div>
                    <EuiSpacer />
                    <img onClick={() => window.open(item.mediaLocalPath)} id="theImg" src={item.mediaLocalPath} width="150" height="175" />
                    {item.caption ? (<> <EuiSpacer /><EuiText size="s">
                        <ShowMoreText lines={3} more="more" less="less" keepNewLines={true}>{item.caption}</ShowMoreText>
                    </EuiText></>) : null}

                </div>
            )
        }
        else {
            childPanel = (<div>No Content</div>)
        }

        let chatTitle;
        if (item.chat && item.chat.title) {
            chatTitle = `${item.chat.title}(@${item.chat.username})`
        }
        else {
            chatTitle = "Message"
        }


        const itemdate = new Date(item.date);
        let dateText = `${itemdate.toLocaleDateString()}  ${itemdate.toLocaleTimeString()}`

        return (

            <div className="card mb-3 message" style={{ minWidth: "36rem", maxWidth: "36rem" }} >
                <div className="card-header">
                    <div className="row">
                        <div className="col">
                            <EuiText size="m" color="subdued">{chatTitle}</EuiText>
                        </div>
                        <div className="col-auto">
                            <EuiText size="s" color="subdued">{dateText}</EuiText>
                        </div>
                    </div>

                </div>
                <div className="card-body">
                    {/* <h5 className="card-title">Light card title</h5> */}
                    <div className="card-text">{childPanel}</div>
                </div>
                <div className="card-footer">
                    <div className="row">
                        <div className="col">
                            {/* <EuiButton color="primary" size="s" style={{ width: '150px' }}
                                onClick={() => this.props.openFlyout(item)}>
                                 <EuiText size="s">        Analytics</EuiText>
                            </EuiButton> */}
                        </div>
                        {item.views ?
                            <div className="col-auto">
                                <EuiBadge iconType="eye">
                                    {item.views}
                                </EuiBadge>
                            </div> : null}
                    </div>
                </div>
            </div>
        )
        //  }


    }

    render() {

        return this.renderCard(this.props.item, this.props.className)

    }
}


export default MessageCard;