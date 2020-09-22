import React from 'react';
import {
  EuiPage,
  EuiPageHeader,
  EuiTitle,
  EuiPageBody,
  EuiPageContent,
  EuiPageContentHeader,
  EuiPageContentBody,
  EuiText,
} from '@elastic/eui';
import { FormattedMessage } from '@kbn/i18n/react';
import DbInfo from './DbInfo';
import PredefinedSearch from './PredefinedSearch';
import TopMessages from './topMessages';
import { EuiPanel } from '@elastic/eui';
import { EuiSpacer } from '@elastic/eui';

export class Main extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {

    const { httpClient } = this.props;
    httpClient.get('../api/viz_basic/example').then(resp => {
      this.setState({ time: resp.data.time });
    });
  }
  render() {
    const { title } = this.props;
    return (
      <EuiPage>
        <EuiPageBody>
          <EuiPageHeader>
            <EuiTitle size="m">
              <h1>
                <FormattedMessage
                  id="vizBasic.helloWorldText"
                  defaultMessage="{title}"
                  values={{ title }}
                />
              </h1>
            </EuiTitle>
          </EuiPageHeader>
          <EuiPageContent>
            <EuiPageContentHeader>

            </EuiPageContentHeader>
            <EuiPageContentBody>
              <EuiPanel hasShadow={true} >
                <DbInfo />
              </EuiPanel>

              <EuiSpacer />

              <EuiPanel hasShadow={true} >
                <PredefinedSearch />
              </EuiPanel>

              <EuiSpacer />
              <EuiPanel hasShadow={true}>
                <TopMessages httpClient={this.props.httpClient}/>
              </EuiPanel>


            </EuiPageContentBody>
          </EuiPageContent>
        </EuiPageBody>
      </EuiPage>
    );
  }
}
