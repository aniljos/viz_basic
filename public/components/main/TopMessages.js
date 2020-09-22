import React, { PureComponent } from 'react';
import axios from 'axios';
import { EuiFlexGroup } from '@elastic/eui';
import { EuiFlexItem } from '@elastic/eui';
import { EuiText } from '@elastic/eui';
import { EuiCard } from '@elastic/eui';
import { EuiIcon } from '@elastic/eui';
import { EuiBadge } from '@elastic/eui';
import { EuiFlexGrid } from '@elastic/eui';
import ShowMoreText from 'react-show-more-text';
import { EuiTitle } from '@elastic/eui';
import { EuiTextColor } from '@elastic/eui';
import { EuiSpacer } from '@elastic/eui';
import { EuiButton } from '@elastic/eui';
import 'bootstrap/dist/css/bootstrap.css';
import MessageCard from './MessageCard';

class TopMessages extends PureComponent {

    state = {
        data: []
    }
    async componentDidMount() {


        try {
            const topMessages = await axios
                .get('../vizapi/es/fetchTopViewedMessages');
            console.log(topMessages);
            const data = topMessages.data.indexes;
            const p_data =  data.map((item, index) => ({
                ...item,
                _id: item._id,
                media_visible: false,
                mediaLocalPath: "",
                page_id: index

            }));
            this.setState({ data: p_data });
        } catch (error) {
            console.log(error);
        }
    }



    openDocument = async (item) => {
        //const fileName = item.document.file_name;
        const fileName = item.attached_file_name;

        const url = "../api/deep_intel/fetchDocument";
        const data = { fileName };




        try {

            const resp = await this.props.httpClient.post(url, data, { responseType: 'blob' });
            const buffer = resp.data;
            const mimeType = item.document.mime_type || 'application/octet-stream';
            //console.log("MimeType", mimeType);
            var file = new Blob([buffer], { type: mimeType });
            var fileURL = URL.createObjectURL(file);
            window.open(fileURL);
            $("#docViewer").attr('href', fileURL);
        }
        catch (err) {
            console.log(err)
        }


    }

    openVideo = async (item, cardRef) => {
        //const fileName = item.document.file_name;
        const fileName = item.attached_file_name;
        //const fileName = "telegram.@channel2fspl.6.hindi_video3.mp4";

        const url = "../api/deep_intel/fetchVideo?fileName=" + fileName;
        const data = { fileName: fileName };
        //console.log("openVideo", data);
        try {

            const resp = await this.props.httpClient.post(url, data, { responseType: 'json' });
            // console.log(resp);
            const data = [...this.state.data];
            const index = data.findIndex(it => it.page_id === item.page_id);
            data[index].media_visible = true;
            data[index].mediaLocalPath = `../api/deep_intel/static/${resp.data.fileName}`
            //console.log(data[index].mediaLocalPath);
            this.setState({
                data
            }, () => {
                // console.log(this.state.data);
                if (cardRef) {
                    cardRef.updateCard();
                }

            });
        }
        catch (err) {
            console.log(err);

        }


    }
    
    openAudio = async (item, cardRef) => {
        //const fileName = item.document.file_name;
        const fileName = item.attached_file_name;
    
        const url = "../api/deep_intel/fetchVideo?fileName=" + fileName;
        const postdata = { fileName: fileName };
        // console.log("openAudio", data);
        try {
    
          const resp = await this.props.httpClient.post(url, postdata, { responseType: 'json' });
          // console.log(resp);
          const data = [...this.state.data];
          const index = data.findIndex(it => it.page_id === item.page_id);
          console.log("Index", index);
          data[index].media_visible = true;
          data[index].mediaLocalPath = `../api/deep_intel/static/${resp.data.fileName}`
          //console.log(data[index].mediaLocalPath);
          this.setState({
            data
          }, () => {
            //console.log(this.state.data);
            if (cardRef) {
              cardRef.updateCard()
            }
          });
        }
        catch (err) {
          console.log(err)
        }
      }
    openPhoto = async (item, cardRef) => {

       // console.log("Open Photo");
        const fileName = item.attached_file_name;
        //const fileName = "telegram.@banking_zone.38158.photo.jpg";
        const url = "../api/deep_intel/fetchVideo?fileName=" + fileName;
        const postdata = { fileName: fileName };

        try {

            const resp = await this.props.httpClient.post(url, postdata, { responseType: 'json' });
            //console.log("response photo", resp);
            const data = [...this.state.data];
            //const index = data.findIndex(it => it._id === item._id);
            const index = data.findIndex(it => it.page_id === item.page_id);
           // console.log("Index", index);
            data[index].media_visible = true;
            data[index].mediaLocalPath = `../api/deep_intel/static/${resp.data.fileName}`
            //("index", index, data[index]);
            this.setState({
                data
            }, () => {
                console.log("After photo: ", this.state.data);
                if (cardRef) {
                    cardRef.updateCard();
                }
            });
        }
        catch (err) {
            console.log(err)
        }


    }

    renderMessages = () => {

      //  console.log("TopMessages", this.state.data);
        if (this.state.data && this.state.data.length > 0) {
            return this.state.data.map((item) => {

                return (
                    <MessageCard key={item._id} item={item}
                        openDocument={this.openDocument}
                        openFlyout={this.openFlyout}
                        openAudio={this.openAudio}
                        openPhoto={this.openPhoto}
                        openVideo={this.openVideo} />
                )

            });
        }

    }

    render() {
        return (



            <EuiFlexGroup direction="column">
                <EuiFlexItem>
                    <EuiTitle size="l" style={{color: "#002699"}}>
                        <h2>
                            VIRALITY: TOP 10 MOST VIEWED MESSAGES
                        </h2>
                    </EuiTitle>
                </EuiFlexItem> 
                <EuiFlexItem>
                    <div class="card-deck">
                        {this.renderMessages()}
                    </div>

                </EuiFlexItem>
                <EuiFlexItem>
                    <EuiText size="m" color="subdued" >
                        These messages throw light on what is becoming viral and helps in indicating what should be the counter propaganda messaging, Click here for further intelligence analysis on these viral messages
                    </EuiText>
                </EuiFlexItem>
            </EuiFlexGroup>
        );
    }

}
export default TopMessages;
