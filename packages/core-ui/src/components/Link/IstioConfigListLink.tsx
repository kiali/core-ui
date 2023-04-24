import * as React from 'react';
//import { Link } from 'react-router-dom';

interface Props {
  namespaces: string[];
  errors?: boolean;
  warnings?: boolean;
  link?: string;
  pathIstio?: string;
}

class IstioConfigListLink extends React.Component<Props> {
  namespacesToParams = () => {
    let param: string = '';
    if (this.props.namespaces.length > 0) {
      param = 'namespaces=' + this.props.namespaces.join(',');
    }
    return param;
  };

  validationToParams = () => {
    let params: string = '';

    if (this.props.warnings) {
      params += 'configvalidation=Warning';
    }

    let errorParams: string = '';
    if (this.props.errors) {
      errorParams += 'configvalidation=Not+Valid';
    }

    if (params !== '' && errorParams !== '') {
      params += '&';
    }

    params += errorParams;

    return params;
  };

  render() {
    if (this.props.link) {
      /*
      return (
        <Link to={this.props.link}>
          {this.props.children}
        </Link>
      );*/
      return <>{this.props.children}</>;
    } else {
      let params: string = this.namespacesToParams();
      const validationParams: string = this.validationToParams();
      if (params !== '' && validationParams !== '') {
        params += '&';
      }
      params += validationParams;
      /*
      return (
        <Link to={`/${this.props.pathIstio}?${params}`}>
          {this.props.children}
        </Link>
      );*/
      return <>{this.props.children}</>;
    }
  }
}

export default IstioConfigListLink;
